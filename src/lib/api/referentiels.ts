import { apiFetch } from '@/lib/api/client';
import { createResource } from '@/lib/api/resource';
import type {
  CreateEtablissementPayload,
  CreateEtablissementSpecialitePayload,
  CreateSpecialitePayload,
  Etablissement,
  EtablissementSpecialite,
  RefuserEtablissementPayload,
  Specialite,
  UpdateEtablissementPayload,
  UpdateSpecialitePayload,
} from '@/lib/api/types';

export const specialites = createResource<
  Specialite,
  CreateSpecialitePayload,
  UpdateSpecialitePayload
>('/specialites');

export type EtablissementsQuery = {
  statut?: Etablissement['statut'];
};

const etablissementsResource = createResource<
  Etablissement,
  CreateEtablissementPayload,
  UpdateEtablissementPayload,
  EtablissementsQuery
>('/etablissements');

/** Module `etablissements` : pas de suppression exposée par le backend. */
export const etablissements = {
  list: etablissementsResource.list,
  get: etablissementsResource.get,
  /** Création directe — réservée aux rôles admin/directeur. */
  create: etablissementsResource.create,
  update: etablissementsResource.update,

  /** Demande d'inscription publique (statut `en_attente`), sans auth. */
  demande: (payload: CreateEtablissementPayload) =>
    apiFetch<Etablissement>('/etablissements/demande', {
      method: 'POST',
      body: payload,
      token: null,
      skipAuthRefresh: true,
    }),

  approuver: (id: string) =>
    apiFetch<Etablissement>(
      `/etablissements/${encodeURIComponent(id)}/approuver`,
      { method: 'PATCH' }
    ),

  refuser: (id: string, payload?: RefuserEtablissementPayload) =>
    apiFetch<Etablissement>(
      `/etablissements/${encodeURIComponent(id)}/refuser`,
      {
        method: 'PATCH',
        body: payload ?? {},
      }
    ),
};

export type EtablissementSpecialitesQuery = {
  etablissement_id?: string;
  specialite_id?: string;
};

const liaisonSpecialites = createResource<
  EtablissementSpecialite,
  CreateEtablissementSpecialitePayload,
  never,
  EtablissementSpecialitesQuery
>('/etablissement-specialites');

export const etablissementSpecialites = {
  list: liaisonSpecialites.list,
  get: liaisonSpecialites.get,
  create: liaisonSpecialites.create,
  remove: liaisonSpecialites.remove,
};
