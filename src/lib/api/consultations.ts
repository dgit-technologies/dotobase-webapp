import { createResource } from '@/lib/api/resource';
import type {
  Consultation,
  ConsultationSymptome,
  CreateConsultationPayload,
  CreateConsultationSymptomePayload,
  CreateSymptomePayload,
  Symptome,
  UpdateConsultationPayload,
  UpdateSymptomePayload,
} from '@/lib/api/types';

export type ConsultationsQuery = {
  patient_id?: string;
  medecin_id?: string;
};

export const consultations = createResource<
  Consultation,
  CreateConsultationPayload,
  UpdateConsultationPayload,
  ConsultationsQuery
>('/consultations');

/** Catalogue des symptômes sélectionnables. */
export const symptomes = createResource<
  Symptome,
  CreateSymptomePayload,
  UpdateSymptomePayload
>('/symptomes');

export type ConsultationSymptomesQuery = {
  consultation_id?: string;
};

/** Symptômes rattachés à une consultation (table de liaison, pas de PATCH). */
const liaisonSymptomes = createResource<
  ConsultationSymptome,
  CreateConsultationSymptomePayload,
  never,
  ConsultationSymptomesQuery
>('/consultation-symptomes');

export const consultationSymptomes = {
  list: liaisonSymptomes.list,
  get: liaisonSymptomes.get,
  create: liaisonSymptomes.create,
  remove: liaisonSymptomes.remove,
};
