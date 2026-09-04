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
  /** Recherche partielle, insensible à la casse. */
  nom?: string;
  /** Recherche partielle, insensible à la casse. */
  prenom?: string;
  sexe?: Sexe;
  groupe_sanguin?: GroupeSanguin;
};

/**
 * Module `patients` du backend.
 *
 * Attention : l'API n'expose pas de recherche par NPI (le NPI n'est plus un
 * identifiant de connexion, ANIP indisponible). L'identification d'un patient
 * se fait par téléphone, par nom/prénom, ou par empreinte
 * (`biometrie.identifier`).
 */
export const patients = createResource<
  Patient,
  CreatePatientPayload,
  UpdatePatientPayload,
  PatientsQuery
>('/patients');
