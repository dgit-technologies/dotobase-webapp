import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearSession,
  clearSessionHint,
  getAccessToken,
  hasSessionHint,
  SESSION_HINT_STORAGE_EXPIRY,
  setAccessToken,
  setSessionHint,
  subscribeToAccessToken,
} from './token';
import { SESSION_HINT_COOKIE } from './config';

describe('token utils', () => {
  beforeEach(() => {
    clearSession();
    document.cookie = `${SESSION_HINT_COOKIE}=; path=/; max-age=0`;
    localStorage.clear();
  });

  describe('accessToken & subscribers', () => {
    it('gère la mémoire du token et notifie les abonnés', () => {
      const listener = vi.fn();
      const unsubscribe = subscribeToAccessToken(listener);

      setAccessToken('test-token-123');
      expect(getAccessToken()).toBe('test-token-123');
      expect(listener).toHaveBeenCalledWith('test-token-123');

      unsubscribe();
      setAccessToken('new-token');
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('clearSession réinitialise le token et le témoin de session', () => {
      setAccessToken('token-a-effacer');
      setSessionHint();

      expect(getAccessToken()).toBe('token-a-effacer');
      expect(hasSessionHint()).toBe(true);

      clearSession();

      expect(getAccessToken()).toBeNull();
      expect(hasSessionHint()).toBe(false);
    });
  });

  describe('sessionHint (double persistance cookie + localStorage)', () => {
    it('setSessionHint enregistre à la fois dans document.cookie et localStorage', () => {
      setSessionHint();

      expect(document.cookie).toContain(`${SESSION_HINT_COOKIE}=1`);
      expect(localStorage.getItem(SESSION_HINT_COOKIE)).toBe('1');

      const exp = Number(localStorage.getItem(SESSION_HINT_STORAGE_EXPIRY));
      expect(exp).toBeGreaterThan(Date.now());
    });

    it('clearSessionHint supprime de document.cookie et localStorage', () => {
      setSessionHint();
      expect(hasSessionHint()).toBe(true);

      clearSessionHint();

      expect(document.cookie).not.toContain(`${SESSION_HINT_COOKIE}=1`);
      expect(localStorage.getItem(SESSION_HINT_COOKIE)).toBeNull();
      expect(localStorage.getItem(SESSION_HINT_STORAGE_EXPIRY)).toBeNull();
      expect(hasSessionHint()).toBe(false);
    });

    it('hasSessionHint renvoie true si le cookie est présent', () => {
      document.cookie = `${SESSION_HINT_COOKIE}=1; path=/`;
      expect(hasSessionHint()).toBe(true);
    });

    it('hasSessionHint restaure le cookie si absent mais présent et valide dans localStorage (ex: Safari après 7 jours)', () => {
      document.cookie = `${SESSION_HINT_COOKIE}=; path=/; max-age=0`;
      localStorage.setItem(SESSION_HINT_COOKIE, '1');
      localStorage.setItem(
        SESSION_HINT_STORAGE_EXPIRY,
        String(Date.now() + 20 * 24 * 60 * 60 * 1000)
      );

      expect(document.cookie).not.toContain(`${SESSION_HINT_COOKIE}=1`);

      const result = hasSessionHint();

      expect(result).toBe(true);
      expect(document.cookie).toContain(`${SESSION_HINT_COOKIE}=1`);
    });

    it('hasSessionHint nettoie et renvoie false si l’expiration de 30 jours est dépassée', () => {
      document.cookie = `${SESSION_HINT_COOKIE}=; path=/; max-age=0`;
      localStorage.setItem(SESSION_HINT_COOKIE, '1');
      localStorage.setItem(
        SESSION_HINT_STORAGE_EXPIRY,
        String(Date.now() - 1000)
      );

      const result = hasSessionHint();

      expect(result).toBe(false);
      expect(localStorage.getItem(SESSION_HINT_COOKIE)).toBeNull();
      expect(localStorage.getItem(SESSION_HINT_STORAGE_EXPIRY)).toBeNull();
    });
  });
});
