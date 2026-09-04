import { createResource } from '@/lib/api/resource';
import type {
  CreateInfirmierEtablissementPayload,
  CreateInfirmierPayload,
  CreateMedecinEtablissementPayload,
  CreateMedecinPayload,
  Infirmier,
  InfirmierEtablissement,
  Medecin,
  MedecinEtablissement,
  UpdateAffectationPayload,
  UpdateInfirmierPayload,
  UpdateMedecinPayload,
} from '@/lib/api/types';

export type StaffQuery = {
  /** Recherche exacte. */
  telephone?: string;
  /** Recherche partielle, insensible à la casse. */
  nom?: string;
  /** Recherche partielle, insensible à la casse. */
  prenom?: string;
};

/**
 * `create` crée en une requête le compte (`users`, avec mot de passe) ET le
 * profil métier. Réservé aux rôles admin/directeur côté backend.
 */
export const medecins = createResource<
  Medecin,
  CreateMedecinPayload,
  UpdateMedecinPayload,
  StaffQuery
>('/medecins');

export const infirmiers = createResource<
  Infirmier,
  CreateInfirmierPayload,
  UpdateInfirmierPayload,
  StaffQuery
>('/infirmiers');

export type MedecinEtablissementsQuery = {
  medecin_id?: string;
  etablissement_id?: string;
};

/** Affectations d'un médecin à un ou plusieurs établissements. */
export const medecinEtablissements = createResource<
  MedecinEtablissement,
  CreateMedecinEtablissementPayload,
  UpdateAffectationPayload,
  MedecinEtablissementsQuery
>('/medecin-etablissements');

export type InfirmierEtablissementsQuery = {
  infirmier_id?: string;
  etablissement_id?: string;
};

export const infirmierEtablissements = createResource<
  InfirmierEtablissement,
  CreateInfirmierEtablissementPayload,
  UpdateAffectationPayload,
  InfirmierEtablissementsQuery
>('/infirmier-etablissements');
