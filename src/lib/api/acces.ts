import { apiFetch } from '@/lib/api/client';
import { createResource } from '@/lib/api/resource';
import type {
  AccesDossier,
  CreateAccesPayload,
  CreateEmpreintePayload,
  EmpreintePatient,
  IdentifierPayload,
  UpdateAccesPayload,
} from '@/lib/api/types';

export type AccesQuery = {
  patient_id?: string;
  etablissement_id?: string;
};

const resource = createResource<
  AccesDossier,
  CreateAccesPayload,
  UpdateAccesPayload,
  AccesQuery
>('/acces');

/**
 * Demandes d'accès au dossier patient (module M9). L'accès est accordé à un
 * établissement entier, pas à un médecin précis, et expire au bout de
 * `duree_heures`.
 */
export const acces = {
  list: resource.list,
  get: resource.get,
  create: resource.create,
  update: resource.update,

  approuver: (id: string) =>
    apiFetch<AccesDossier>(`/acces/${encodeURIComponent(id)}/approuver`, {
      method: 'PATCH',
    }),

  refuser: (id: string) =>
    apiFetch<AccesDossier>(`/acces/${encodeURIComponent(id)}/refuser`, {
      method: 'PATCH',
    }),
};

export interface MatchResult {
  patient_id: string;
  score: number;
}

const empreintes = createResource<
  EmpreintePatient,
  CreateEmpreintePayload,
  never,
  { patient_id?: string }
>('/biometrie/empreintes');

/**
 * Empreintes patients (terminal Aratek).
 *
 * `identifier` (matching 1:N) répond aujourd'hui 501 : le moteur de matching
 * n'est pas encore branché côté backend. Prévoir un repli sur la recherche
 * par téléphone dans l'UI.
 */
export const biometrie = {
  empreintes: {
    list: empreintes.list,
    create: empreintes.create,
    remove: empreintes.remove,
  },

  identifier: (payload: IdentifierPayload) =>
    apiFetch<MatchResult | null>('/biometrie/identifier', {
      method: 'POST',
      body: payload,
    }),
};
