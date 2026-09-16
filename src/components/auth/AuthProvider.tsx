'use client';

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { api, hasSessionHint, subscribeToAccessToken } from '@/lib/api';
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
  /** Établissement actif sélectionné par le praticien. */
  etablissementActif: Etablissement | null;
  /** Liste de tous les établissements rattachés au compte. */
  etablissements: Etablissement[];
  /** Permet au praticien de basculer d'un établissement à un autre. */
  changerEtablissementActif: (etab: Etablissement) => void;
  /** `true` si le compte est admin global ou a un rôle admin/directeur sur l'établissement actif. */
  isEtablissementAdmin: boolean;
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
 * Établissements de rattachement du compte et établissement actif.
 */
async function fetchEtablissementsEtActif(
  profile: AuthProfile
): Promise<{ etablissements: Etablissement[]; actif: Etablissement | null }> {
  if (profile.type === 'patient') {
    return { etablissements: [], actif: null };
  }

  try {
    const list: Etablissement[] = [];

    // Si admin global, on charge tous les établissements disponibles
    if (profile.type === 'admin') {
      try {
        const tous = await api.etablissements.list();
        list.push(...tous);
      } catch {
        // Ignorer
      }
    }

    // 1. Si les rattachements sont déjà fournis par le backend dans /auth/me
    if (profile.etablissements && profile.etablissements.length > 0) {
      const etabs = await Promise.all(
        profile.etablissements.map(async (lien) => {
          try {
            return await api.etablissements.get(lien.etablissement_id);
          } catch {
            return null;
          }
        })
      );
      etabs.forEach((e) => {
        if (e && !list.some((item) => item.id === e.id)) {
          list.push(e);
        }
      });
    }

    // 2. Rattachements via medecinEtablissements ou infirmierEtablissements
    if (profile.id) {
      try {
        const affectations =
          profile.type === 'infirmier'
            ? await api.infirmierEtablissements.list({ infirmier_id: profile.id })
            : await api.medecinEtablissements.list({ medecin_id: profile.id });

        const etabs = await Promise.all(
          affectations.map(async (aff) => {
            try {
              return await api.etablissements.get(aff.etablissement_id);
            } catch {
              return null;
            }
          })
        );
        etabs.forEach((e) => {
          if (e && !list.some((item) => item.id === e.id)) {
            list.push(e);
          }
        });
      } catch {
        // Ignorer
      }
    }

    // Détermination de l'établissement actif :
    // A. Établissement mémorisé dans localStorage
    let actif: Etablissement | null = null;
    if (typeof window !== 'undefined') {
      const savedId = localStorage.getItem('dotobase_etablissement_actif_id');
      if (savedId) {
        actif = list.find((e) => e.id === savedId) ?? null;
      }
    }

    // B. Établissement principal configuré sur le profil
    if (!actif) {
      const principalLien = profile.etablissements?.find((item) => item.est_principal);
      if (principalLien) {
        actif = list.find((e) => e.id === principalLien.etablissement_id) ?? null;
      }
    }

    // C. Premier établissement trouvé
    if (!actif && list.length > 0) {
      actif = list[0];
    }

    // D. Si la liste est vide, tentative de fallback direct
    if (!actif) {
      actif = await fetchEtablissementActif(profile);
      if (actif && !list.some((e) => e.id === actif?.id)) {
        list.push(actif);
      }
    }

    return { etablissements: list, actif };
  } catch {
    const actif = await fetchEtablissementActif(profile);
    return { etablissements: actif ? [actif] : [], actif };
  }
}

/**
 * Fallback unitaire d'établissement de rattachement.
 */
async function fetchEtablissementActif(
  profile: AuthProfile
): Promise<Etablissement | null> {
  if (profile.type === 'patient') return null;

  try {
    if (profile.etablissements && profile.etablissements.length > 0) {
      const lien =
        profile.etablissements.find((item) => item.est_principal) ??
        profile.etablissements[0];
      if (lien?.etablissement_id) {
        return await api.etablissements.get(lien.etablissement_id);
      }
    }

    if (!profile.id) return null;

    const affectations =
      profile.type === 'infirmier'
        ? await api.infirmierEtablissements.list({ infirmier_id: profile.id })
        : await api.medecinEtablissements.list({ medecin_id: profile.id });

    const affectation =
      affectations.find((item) => item.est_principal) ?? affectations[0];
    if (!affectation) return null;

    return await api.etablissements.get(affectation.etablissement_id);
  } catch {
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
  const [etablissements, setEtablissements] = useState<Etablissement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const changerEtablissementActif = useCallback((etab: Etablissement) => {
    setEtablissementActif(etab);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dotobase_etablissement_actif_id', etab.id);
    }
  }, []);

  const loadProfile = useCallback(async (): Promise<AuthProfile> => {
    const profile = await api.auth.me();
    setUser(profile);
    const { etablissements: liste, actif } = await fetchEtablissementsEtActif(profile);
    setEtablissements(liste);
    setEtablissementActif(actif);
    return profile;
  }, []);

  // Restauration de session au démarrage : l'access token ne vit qu'en
  // mémoire, il est perdu à chaque rechargement de page. Le cookie HttpOnly
  // `refresh_token` (posé par le backend pour 30 jours) permet d'en réémettre un.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const isAuthOrDashboard =
          typeof window !== 'undefined' &&
          (window.location.pathname.startsWith('/login') ||
            window.location.pathname.startsWith('/dashboard') ||
            window.location.pathname.startsWith('/patients') ||
            window.location.pathname.startsWith('/consultations') ||
            window.location.pathname.startsWith('/dossiers-medicaux') ||
            window.location.pathname.startsWith('/personnel') ||
            window.location.pathname.startsWith('/admin'));

        // Si nous avons le témoin de session OU si nous sommes sur une page staff/auth,
        // on tente de restaurer la session via le refresh token backend de 30 jours
        if (!hasSessionHint() && !isAuthOrDashboard) return;

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

  // Synchronisation avec l'état global du token (déconnexion ou invalidation)
  useEffect(() => {
    const unsubscribe = subscribeToAccessToken((token) => {
      if (!token) {
        setUser(null);
        setEtablissementActif(null);
        setEtablissements([]);
      }
    });
    return unsubscribe;
  }, []);

  // Renouvellement silencieux proactif (toutes les 10 min) et à la réactivation de l'onglet
  // (l'access_token expire à 15 min côté backend, le rafraîchissement prolonge les 30 jours)
  useEffect(() => {
    if (!user) return;

    const REFRESH_INTERVAL_MS = 10 * 60 * 1000;
    const interval = setInterval(async () => {
      try {
        await api.auth.refresh();
      } catch {
        // Échec silencieux, apiFetch réessaiera au besoin
      }
    }, REFRESH_INTERVAL_MS);

    const handleVisibilityOrFocus = async () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        try {
          await api.auth.refresh();
        } catch {
          // Échec silencieux
        }
      }
    };

    window.addEventListener('focus', handleVisibilityOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
    };
  }, [user]);

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
    setEtablissements([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('dotobase_etablissement_actif_id');
    }
    router.replace('/login');
  }, [router]);

  const isEtablissementAdmin = useMemo(() => {
    if (!user) return false;
    if (user.type === 'admin' || user.type === 'directeur') return true;
    if (!etablissementActif?.id || !user.etablissements) return false;
    return user.etablissements.some(
      (e) =>
        e.etablissement_id === etablissementActif.id &&
        (e.role === 'admin' || e.role === 'directeur')
    );
  }, [user, etablissementActif]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role: user?.type ?? null,
      specialiteId:
        user && 'specialite_id' in user ? (user.specialite_id ?? null) : null,
      etablissementActif,
      etablissements,
      changerEtablissementActif,
      isEtablissementAdmin,
      isLoading,
      isAuthenticated: user !== null,
      login,
      signOut,
      reload: async () => {
        await loadProfile();
      },
    }),
    [user, etablissementActif, etablissements, changerEtablissementActif, isEtablissementAdmin, isLoading, login, signOut, loadProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
