import { vi } from 'vitest';
import type { AuthProfile, Etablissement, Patient } from '@/lib/api/types';

/**
 * Données et mocks partagés pour les tests qui touchent au backend Nest.
 *
 * Remplace l'ancien `mock-supabase.ts` : la webapp n'a plus de client
 * Supabase, tout passe par `@/lib/api`.
 */

export const mockMedecin: AuthProfile = {
  id: 'medecin-uuid',
  utilisateur_id: 'user-uuid',
  nom: 'Hounkpatin',
  prenom: 'Jean',
  specialite_id: 'specialite-uuid',
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
  telephone: '+2290161000000',
  type: 'medecin',
};

export const mockEtablissement: Etablissement = {
  id: 'etablissement-uuid',
  nom: 'Hôpital Central de Cotonou',
  type: 'hopital',
  ville: 'Cotonou',
  adresse: null,
  telephone: null,
  email: null,
  statut: 'valide',
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
};

export const mockPatient: Patient = {
  id: 'patient-uuid',
  utilisateur_id: 'user-patient-uuid',
  nom: 'Koné',
  prenom: 'Fatou',
  date_naissance: '1990-05-14',
  sexe: 'F',
  adresse: 'Cotonou, Quartier Akpakpa',
  groupe_sanguin: 'O+',
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
};

/** Réponse minimale : `apiFetch` ne lit que `ok`, `status` et `text()`. */
export function mockResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: () => Promise.resolve(body === undefined ? '' : JSON.stringify(body)),
  } as unknown as Response;
}

/**
 * Remplace `fetch` par une table de routes. La clé est
 * `"<METHODE> <chemin>"`, par exemple `"GET /v1/patients"`. Une route absente
 * répond 404 avec un message explicite.
 */
export function mockFetchRoutes(routes: Record<string, unknown>) {
  const fetchMock = vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(typeof input === 'string' ? input : input.toString());
    const methode = (init?.method ?? 'GET').toUpperCase();
    const cle = `${methode} ${url.pathname}`;

    if (!(cle in routes)) {
      return Promise.resolve(
        mockResponse({ statusCode: 404, message: `Route non mockée : ${cle}` }, 404)
      );
    }

    return Promise.resolve(mockResponse(routes[cle]));
  });

  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}
