import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { apiFetch } from '@/lib/api/client';
import { ApiError } from '@/lib/api/errors';
import { clearSession, getAccessToken, setAccessToken } from '@/lib/api/token';

function reponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: () => Promise.resolve(body === undefined ? '' : JSON.stringify(body)),
  } as unknown as Response;
}

function appels() {
  return (globalThis.fetch as unknown as ReturnType<typeof vi.fn>).mock.calls as [
    string,
    RequestInit,
  ][];
}

function autorisation(index: number): string | null {
  const [, init] = appels()[index];
  return new Headers(init.headers).get('Authorization');
}

describe('apiFetch', () => {
  beforeEach(() => {
    clearSession();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('préfixe les routes par /v1 et ignore les paramètres vides', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(reponse([])));

    await apiFetch('/patients', {
      query: { nom: 'Koné', prenom: undefined, sexe: '' },
    });

    expect(appels()[0][0]).toBe('http://localhost:4000/v1/patients?nom=Kon%C3%A9');
  });

  it('envoie le token en mémoire et les cookies', async () => {
    setAccessToken('token-actif');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(reponse({ id: '1' })));

    await apiFetch('/patients/1');

    expect(autorisation(0)).toBe('Bearer token-actif');
    expect(appels()[0][1].credentials).toBe('include');
  });

  it('sérialise le corps en JSON sur un POST', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(reponse({ id: '1' })));

    await apiFetch('/specialites', { method: 'POST', body: { code: 'CARD' } });

    const [, init] = appels()[0];
    expect(init.body).toBe('{"code":"CARD"}');
    expect(new Headers(init.headers).get('Content-Type')).toBe('application/json');
  });

  it('transforme une erreur Nest en ApiError lisible', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        reponse(
          {
            statusCode: 400,
            error: 'Bad Request',
            message: ['telephone must be a valid phone number', 'password too short'],
          },
          400
        )
      )
    );

    const erreur = await apiFetch('/auth/login', {
      method: 'POST',
      body: {},
      skipAuthRefresh: true,
    }).catch((e: unknown) => e);

    expect(erreur).toBeInstanceOf(ApiError);
    expect((erreur as ApiError).status).toBe(400);
    expect((erreur as ApiError).message).toBe(
      'telephone must be a valid phone number · password too short'
    );
  });

  it('renvoie undefined sur un 204 (DELETE)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(reponse(undefined, 204)));

    await expect(apiFetch('/patients/1', { method: 'DELETE' })).resolves.toBeUndefined();
  });

  it('rejoue la requête après un refresh réussi sur 401', async () => {
    setAccessToken('token-expire');

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(reponse({ message: 'Token invalide ou expiré' }, 401))
      .mockResolvedValueOnce(reponse({ access_token: 'token-neuf' }))
      .mockResolvedValueOnce(reponse([{ id: 'patient-1' }]));
    vi.stubGlobal('fetch', fetchMock);

    await expect(apiFetch('/patients')).resolves.toEqual([{ id: 'patient-1' }]);

    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(appels()[1][0]).toBe('http://localhost:4000/v1/auth/refresh');
    expect(autorisation(2)).toBe('Bearer token-neuf');
    expect(getAccessToken()).toBe('token-neuf');
  });

  it('remonte le 401 et vide la session si le refresh échoue', async () => {
    setAccessToken('token-expire');

    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce(reponse({ message: 'Token invalide ou expiré' }, 401))
        .mockResolvedValueOnce(reponse({ message: 'Refresh token invalide' }, 401))
    );

    await expect(apiFetch('/patients')).rejects.toBeInstanceOf(ApiError);
    expect(getAccessToken()).toBeNull();
  });

  it('ne tente pas de refresh sur les routes d’authentification', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(reponse({ message: 'Téléphone ou mot de passe incorrect' }, 401));
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      apiFetch('/auth/login', { method: 'POST', body: {}, skipAuthRefresh: true })
    ).rejects.toBeInstanceOf(ApiError);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
