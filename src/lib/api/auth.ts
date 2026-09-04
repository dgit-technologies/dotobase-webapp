import { apiFetch, refreshSession } from '@/lib/api/client';
import { clearSession, setAccessToken, setSessionHint } from '@/lib/api/token';
import type {
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

  /** Profil du compte connecté (médecin / infirmier / patient). */
  me(): Promise<AuthProfile> {
    return apiFetch<AuthProfile>('/auth/me');
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
