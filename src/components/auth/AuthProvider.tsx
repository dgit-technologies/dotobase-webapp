'use client';

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { api, hasSessionHint } from '@/lib/api';
import type {
  AuthProfile,
  Etablissement,
  LoginPayload,
  UserType,
} from '@/lib/api/types';

export interface AuthContextValue {
  /** Profil renvoyé par `GET /v1/auth/me`, ou `null` si non connecté. */
  user: AuthProfile | null;
  /** Type de compte : medecin, infirmier, admin, directeur, patient. */
  role: UserType | null;
  specialiteId: string | null;
  /** Établissement principal du compte (premier trouvé sinon). */
  etablissementActif: Etablissement | null;
  /** `true` tant que la session n'a pas été restaurée au démarrage. */
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<AuthProfile>;
  signOut: () => void;
  /** Recharge le profil depuis l'API (après édition des paramètres). */
  reload: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Établissement de rattachement du compte. Deux appels (affectations puis
 * détail) : le backend n'expose pas encore de route qui renvoie directement
 * l'établissement d'un membre du staff.
 */
async function fetchEtablissementActif(
  profile: AuthProfile
): Promise<Etablissement | null> {
  // Un patient n'est rattaché à aucun établissement (dossier national).
  if (profile.type === 'patient') return null;

  try {
    const affectations =
      profile.type === 'infirmier'
        ? await api.infirmierEtablissements.list({ infirmier_id: profile.id })
        : await api.medecinEtablissements.list({ medecin_id: profile.id });

    const affectation =
      affectations.find((item) => item.est_principal) ?? affectations[0];
    if (!affectation) return null;

    return await api.etablissements.get(affectation.etablissement_id);
  } catch {
    // Pas bloquant : l'app reste utilisable sans nom d'établissement.
    return null;
  }
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<AuthProfile | null>(null);
  const [etablissementActif, setEtablissementActif] =
    useState<Etablissement | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(async (): Promise<AuthProfile> => {
    const profile = await api.auth.me();
    setUser(profile);
    setEtablissementActif(await fetchEtablissementActif(profile));
    return profile;
  }, []);

  // Restauration de session au démarrage : l'access token ne vit qu'en
  // mémoire, il est perdu à chaque rechargement de page. Le cookie HttpOnly
  // `refresh_token` (posé par le backend) permet d'en réémettre un.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        if (!hasSessionHint()) return;

        const token = await api.auth.refresh();
        if (!token || cancelled) return;

        await loadProfile();
      } catch {
        // Session morte ou backend injoignable : on reste déconnecté.
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [loadProfile]);

  const login = useCallback(
    async (payload: LoginPayload) => {
      await api.auth.login(payload);
      return loadProfile();
    },
    [loadProfile]
  );

  const signOut = useCallback(() => {
    api.auth.logout();
    setUser(null);
    setEtablissementActif(null);
    router.replace('/login');
  }, [router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role: user?.type ?? null,
      specialiteId:
        user && 'specialite_id' in user ? (user.specialite_id ?? null) : null,
      etablissementActif,
      isLoading,
      isAuthenticated: user !== null,
      login,
      signOut,
      reload: async () => {
        await loadProfile();
      },
    }),
    [user, etablissementActif, isLoading, login, signOut, loadProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
