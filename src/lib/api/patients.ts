import { apiFetch } from '@/lib/api/client';
import { createResource } from '@/lib/api/resource';
import type {
  CreatePatientPayload,
  GroupeSanguin,
  Patient,
  Sexe,
  UpdatePatientPayload,
} from '@/lib/api/types';

export type PatientsQuery = {
  /** Recherche exacte. */
  telephone?: string;
  /** Recherche exacte par NPI (10 chiffres). */
  npi?: string;
  /** Recherche partielle, insensible à la casse. */
  nom?: string;
  /** Recherche partielle, insensible à la casse. */
  prenom?: string;
  sexe?: Sexe;
  groupe_sanguin?: GroupeSanguin;
};

export type PatientRechercheResult = {
  id: string;
  nom: string;
  prenom: string;
  date_naissance: string;
  sexe: Sexe;
  a_acces: boolean;
};

export type PatientRechercheQuery = {
  telephone?: string;
  npi?: string;
};

const resource = createResource<
  Patient,
  CreatePatientPayload,
  UpdatePatientPayload,
  PatientsQuery
>('/patients');

/**
 * Module `patients` du backend.
 *
 * Expose les opérations standards (`list`, `get`, `create`, `update`, `remove`)
 * ainsi que la recherche préalable non scopée (`GET /patients/recherche`).
 */
export const patients = {
  ...resource,
  /**
   * Recherche préalable par téléphone ou NPI (exact) - non scopée par établissement.
   * Renvoie l'identité minimale et le statut `a_acces` (l'établissement a déjà accès ou non).
   */
  recherche: (query: PatientRechercheQuery) =>
    apiFetch<PatientRechercheResult>('/patients/recherche', { query }),
};

