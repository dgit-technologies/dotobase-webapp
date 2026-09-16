import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { patients } from '@/lib/api/patients';
import { clearSession, setAccessToken } from '@/lib/api/token';

function mockResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: () => Promise.resolve(body === undefined ? '' : JSON.stringify(body)),
  } as unknown as Response;
}

function fetchCalls() {
  return (globalThis.fetch as unknown as ReturnType<typeof vi.fn>).mock.calls as [
    string,
    RequestInit,
  ][];
}

describe('patients API', () => {
  beforeEach(() => {
    clearSession();
    setAccessToken('fake-jwt-token');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('patients.recherche', () => {
    it('envoie une requête GET vers /patients/recherche avec query telephone', async () => {
      const mockResult = {
        id: 'pat-10',
        nom: 'Kone',
        prenom: 'Fatou',
        date_naissance: '1990-01-01',
        sexe: 'F' as const,
        a_acces: true,
      };
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse(mockResult)));

      const res = await patients.recherche({ telephone: '+2290100000456' });

      expect(res).toEqual(mockResult);
      const [url, init] = fetchCalls()[0];
      expect(url).toBe('http://localhost:4001/v1/patients/recherche?telephone=%2B2290100000456');
      expect(init.method ?? 'GET').toBe('GET');
    });

    it('envoie une requête GET vers /patients/recherche avec query npi', async () => {
      const mockResult = {
        id: 'pat-11',
        nom: 'Bio',
        prenom: 'Ousmane',
        date_naissance: '1985-05-12',
        sexe: 'M' as const,
        a_acces: false,
      };
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse(mockResult)));

      const res = await patients.recherche({ npi: '1234567890' });

      expect(res).toEqual(mockResult);
      const [url, init] = fetchCalls()[0];
      expect(url).toBe('http://localhost:4001/v1/patients/recherche?npi=1234567890');
      expect(init.method ?? 'GET').toBe('GET');
    });
  });

  describe('patients.list', () => {
    it('permet de filtrer avec le nouveau champ npi', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse([])));

      await patients.list({ npi: '1234567890' });

      const [url] = fetchCalls()[0];
      expect(url).toBe('http://localhost:4001/v1/patients?npi=1234567890');
    });
  });
});
