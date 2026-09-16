import { apiFetch, refreshSession } from '@/lib/api/client';
import { clearSession, setAccessToken, setSessionHint } from '@/lib/api/token';
import type {
  AuthMeResponse,
  AuthProfile,
  GenericMessageResponse,
  LoginPayload,
  LoginResponse,
  OtpRequestPayload,
  OtpVerifyPayload,
  OtpVerifyResponse,
} from '@/lib/api/types';

/**
 * Authentification staff et patient (module `auth` du backend).
 *
 * Staff (webapp) : téléphone + mot de passe → access token en mémoire,
 * refresh token en cookie HttpOnly posé par le backend. Il n'y a PAS d'OTP
 * côté staff : l'OTP est le mode de connexion des patients (app mobile).
 */
export const auth = {
  /**
   * Login staff. Stocke l'access token en mémoire et pose le cookie témoin
   * de session.
   */
  async login(payload: LoginPayload): Promise<string> {
    const { access_token } = await apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: payload,
      token: null,
      skipAuthRefresh: true,
    });

    setAccessToken(access_token);
    setSessionHint();
    return access_token;
  },

  /** Login patient, étape 1 : envoi du code par SMS. */
  requestOtp(payload: OtpRequestPayload): Promise<GenericMessageResponse> {
    return apiFetch<GenericMessageResponse>('/auth/otp/request', {
      method: 'POST',
      body: payload,
      token: null,
      skipAuthRefresh: true,
    });
  },

  /** Login patient, étape 2 : vérification du code (tokens dans le body). */
  async verifyOtp(payload: OtpVerifyPayload): Promise<OtpVerifyResponse> {
    const tokens = await apiFetch<OtpVerifyResponse>('/auth/otp/verify', {
      method: 'POST',
      body: payload,
      token: null,
      skipAuthRefresh: true,
    });

    setAccessToken(tokens.access_token);
    setSessionHint();
    return tokens;
  },

  /** Profil du compte connecté (médecin / infirmier / patient), normalisé pour la webapp. */
  async me(): Promise<AuthProfile> {
    const raw = await apiFetch<AuthMeResponse | AuthProfile>('/auth/me');
    return normalizeAuthProfile(raw);
  },

  /** Rejoue le refresh à partir du cookie HttpOnly. */
  refresh: refreshSession,

  /**
   * Déconnexion côté client : oublie l'access token et le cookie témoin.
   *
   * Le backend n'expose pas encore de route de logout ; le cookie
   * `refresh_token` étant HttpOnly, JS ne peut pas l'effacer. Il reste donc
   * valide jusqu'à son expiration (30 jours) — une route `POST /auth/logout`
   * qui l'invalide côté serveur est à demander au backend.
   */
  logout(): void {
    clearSession();
  },
};

/**
 * Normalise la réponse de `GET /auth/me`.
 * Gère le format multi-profil retourné par le backend NestJS
 * ({ telephone, type, medecin?, infirmier?, patient?, etablissements? })
 * ainsi que le format plat direct ({ id, nom, prenom, type, ... }).
 */
export function normalizeAuthProfile(
  raw: AuthMeResponse | AuthProfile
): AuthProfile {
  if (!raw) return raw as AuthProfile;

  // Si c'est déjà un profil plat contenant directement nom ou prenom
  if ('nom' in raw || 'prenom' in raw) {
    return raw as AuthProfile;
  }

  const multi = raw as AuthMeResponse;
  const activeProfile =
    (multi.type === 'medecin' || multi.type === 'admin' || multi.type === 'directeur'
      ? multi.medecin
      : multi.type === 'infirmier'
        ? multi.infirmier
        : multi.patient) ??
    multi.medecin ??
    multi.infirmier ??
    multi.patient ??
    {};

  return {
    ...activeProfile,
    telephone: multi.telephone ?? (activeProfile as any).telephone,
    type: multi.type ?? (activeProfile as any).type,
    ...(multi.etablissements ? { etablissements: multi.etablissements } : {}),
  } as AuthProfile;
}
