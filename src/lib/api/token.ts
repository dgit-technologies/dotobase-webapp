import {
  SESSION_HINT_COOKIE,
  SESSION_HINT_MAX_AGE_S,
} from '@/lib/api/config';

/**
 * Stockage de l'access token (durée de vie 15 min côté backend).
 *
 * Il est gardé EN MÉMOIRE uniquement, jamais en localStorage ni dans un
 * cookie lisible : un XSS ne peut pas le voler au repos, et il disparaît à
 * chaque rechargement de page. La session est reconstruite au démarrage via
 * `POST /v1/auth/refresh`, qui s'appuie sur le cookie HttpOnly posé par le
 * backend (voir client.ts → refreshSession).
 */
let accessToken: string | null = null;

type TokenListener = (token: string | null) => void;
const listeners = new Set<TokenListener>();

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
  listeners.forEach((listener) => listener(token));
}

/** S'abonne aux changements de token (login / refresh / logout). */
export function subscribeToAccessToken(listener: TokenListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Pose le cookie témoin de session. Ne contient pas de token : il indique
 * seulement qu'un refresh token existe probablement côté navigateur.
 */
export function setSessionHint(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${SESSION_HINT_COOKIE}=1; path=/; max-age=${SESSION_HINT_MAX_AGE_S}; SameSite=Lax`;
}

export function clearSessionHint(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${SESSION_HINT_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function hasSessionHint(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie
    .split(';')
    .some((part) => part.trim().startsWith(`${SESSION_HINT_COOKIE}=1`));
}

/** Oublie la session côté client (token en mémoire + cookie témoin). */
export function clearSession(): void {
  setAccessToken(null);
  clearSessionHint();
}
