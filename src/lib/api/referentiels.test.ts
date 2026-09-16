import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { etablissements } from '@/lib/api/referentiels';
import { clearSession } from '@/lib/api/token';

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

describe('referentiels API', () => {
  beforeEach(() => {
    clearSession();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('etablissements.refuser', () => {
    it('envoie une requête PATCH vers /etablissements/:id/refuser avec le motif', async () => {
      const fakeEtab = {
        id: 'etab-123',
        nom: 'Hôpital Central',
        statut: 'refuse',
        motif_refus: 'Pièces justificatives non conformes',
      };
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse(fakeEtab)));

      const res = await etablissements.refuser('etab-123', {
        motif: 'Pièces justificatives non conformes',
      });

      expect(res).toEqual(fakeEtab);
      const [url, init] = fetchCalls()[0];
      expect(url).toBe('http://localhost:4001/v1/etablissements/etab-123/refuser');
      expect(init.method).toBe('PATCH');
      expect(init.body).toBe(
        JSON.stringify({ motif: 'Pièces justificatives non conformes' })
      );
      expect(new Headers(init.headers).get('Content-Type')).toBe('application/json');
    });

    it('envoie un body vide {} lorsque le motif/payload est omis', async () => {
      const fakeEtab = {
        id: 'etab-456',
        nom: 'Clinique de l Espoir',
        statut: 'refuse',
        motif_refus: null,
      };
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse(fakeEtab)));

      const res = await etablissements.refuser('etab-456');

      expect(res).toEqual(fakeEtab);
      const [url, init] = fetchCalls()[0];
      expect(url).toBe('http://localhost:4001/v1/etablissements/etab-456/refuser');
      expect(init.method).toBe('PATCH');
      expect(init.body).toBe(JSON.stringify({}));
      expect(new Headers(init.headers).get('Content-Type')).toBe('application/json');
    });
  });

  describe('etablissements.approuver', () => {
    it('envoie une requête PATCH vers /etablissements/:id/approuver sans body', async () => {
      const fakeEtab = {
        id: 'etab-789',
        nom: 'CHU de Zone',
        statut: 'valide',
      };
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse(fakeEtab)));

      const res = await etablissements.approuver('etab-789');

      expect(res).toEqual(fakeEtab);
      const [url, init] = fetchCalls()[0];
      expect(url).toBe('http://localhost:4001/v1/etablissements/etab-789/approuver');
      expect(init.method).toBe('PATCH');
    });
  });

  describe('etablissements.demande', () => {
    it('envoie une requête POST vers /etablissements/demande avec token null et skipAuthRefresh', async () => {
      const payload = {
        nom: 'Centre Médical Saint Jean',
        type: 'cabinet' as const,
        ville: 'Cotonou',
        telephone: '+22901998877',
      };
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse({ id: 'new-1', ...payload })));

      await etablissements.demande(payload);

      const [url, init] = fetchCalls()[0];
      expect(url).toBe('http://localhost:4001/v1/etablissements/demande');
      expect(init.method).toBe('POST');
      expect(init.body).toBe(JSON.stringify(payload));
      expect(new Headers(init.headers).get('Authorization')).toBeNull();
    });
  });
});
