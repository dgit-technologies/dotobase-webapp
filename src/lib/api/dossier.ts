import { createResource } from '@/lib/api/resource';
import type {
  CreateDiagnosticPayload,
  CreateDocumentPayload,
  CreateExamenPayload,
  CreateOrdonnancePayload,
  CreateTraitementPayload,
  Diagnostic,
  DocumentMedical,
  Examen,
  Ordonnance,
  Traitement,
  UpdateDiagnosticPayload,
  UpdateDocumentPayload,
  UpdateExamenPayload,
  UpdateOrdonnancePayload,
  UpdateTraitementPayload,
} from '@/lib/api/types';

/**
 * Contenu du dossier médical : tout se filtre par `patient_id` (le dossier
 * est national et unique, il n'appartient à aucun établissement).
 */
export type PatientScopedQuery = {
  patient_id?: string;
};

export type DiagnosticsQuery = {
  patient_id?: string;
  consultation_id?: string;
};

export const diagnostics = createResource<
  Diagnostic,
  CreateDiagnosticPayload,
  UpdateDiagnosticPayload,
  DiagnosticsQuery
>('/diagnostics');

export const traitements = createResource<
  Traitement,
  CreateTraitementPayload,
  UpdateTraitementPayload,
  PatientScopedQuery
>('/traitements');

export const ordonnances = createResource<
  Ordonnance,
  CreateOrdonnancePayload,
  UpdateOrdonnancePayload,
  PatientScopedQuery
>('/ordonnances');

export const examens = createResource<
  Examen,
  CreateExamenPayload,
  UpdateExamenPayload,
  PatientScopedQuery
>('/examens');

/**
 * Métadonnées de documents. L'upload du fichier lui-même ne passe pas par
 * cette API : `url_storage` doit déjà pointer vers le fichier stocké.
 */
export const documents = createResource<
  DocumentMedical,
  CreateDocumentPayload,
  UpdateDocumentPayload,
  PatientScopedQuery
>('/documents');
