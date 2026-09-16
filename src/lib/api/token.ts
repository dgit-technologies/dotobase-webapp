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

export const SESSION_HINT_STORAGE_EXPIRY = 'dotobase_session_expires';

/**
 * Pose le témoin de session. Ne contient aucun token : il indique
 * seulement qu'un refresh token existe côté navigateur.
 * Stocké à la fois en cookie (pour le proxy/SSR) et en localStorage
 * pour résister aux purges ITP (7 jours max pour document.cookie sous Safari).
 */
export function setSessionHint(): void {
  if (typeof document !== 'undefined') {
    document.cookie = `${SESSION_HINT_COOKIE}=1; path=/; max-age=${SESSION_HINT_MAX_AGE_S}; SameSite=Lax`;
  }
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(SESSION_HINT_COOKIE, '1');
      window.localStorage.setItem(
        SESSION_HINT_STORAGE_EXPIRY,
        String(Date.now() + SESSION_HINT_MAX_AGE_S * 1000)
      );
    } catch {
      // Ignorer si localStorage est indisponible (navigation privée stricte)
    }
  }
}

export function clearSessionHint(): void {
  if (typeof document !== 'undefined') {
    document.cookie = `${SESSION_HINT_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  }
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.removeItem(SESSION_HINT_COOKIE);
      window.localStorage.removeItem(SESSION_HINT_STORAGE_EXPIRY);
    } catch {
      // Ignorer
    }
  }
}

export function hasSessionHint(): boolean {
  if (typeof document !== 'undefined') {
    const hasCookie = document.cookie
      .split(';')
      .some((part) => part.trim().startsWith(`${SESSION_HINT_COOKIE}=1`));
    if (hasCookie) return true;
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const val = window.localStorage.getItem(SESSION_HINT_COOKIE);
      if (val === '1') {
        const expStr = window.localStorage.getItem(SESSION_HINT_STORAGE_EXPIRY);
        const exp = expStr ? Number(expStr) : NaN;
        if (!expStr || isNaN(exp) || exp > Date.now()) {
          // Restauration automatique du cookie si Safari ou le navigateur l'a purgé
          if (typeof document !== 'undefined') {
            document.cookie = `${SESSION_HINT_COOKIE}=1; path=/; max-age=${SESSION_HINT_MAX_AGE_S}; SameSite=Lax`;
          }
          return true;
        } else {
          // Expiré après 30 jours
          window.localStorage.removeItem(SESSION_HINT_COOKIE);
          window.localStorage.removeItem(SESSION_HINT_STORAGE_EXPIRY);
        }
      }
    } catch {
      // Ignorer
    }
  }

  return false;
}

/** Oublie la session côté client (token en mémoire + cookie témoin). */
export function clearSession(): void {
  setAccessToken(null);
  clearSessionHint();
}
