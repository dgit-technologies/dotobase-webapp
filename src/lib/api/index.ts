/**
 * Client de l'API Dotobase (backend Nest, dépôt `dotobase-backend`).
 *
 * Usage :
 *   import { api } from '@/lib/api';
 *   const liste = await api.patients.list({ nom: 'Koné' });
 *   await api.consultations.create({ ... });
 *
 * Toutes les routes exigent un JWT sauf `auth.login`, `auth.requestOtp`,
 * `auth.verifyOtp` et `etablissements.demande`. Le token est géré
 * automatiquement (mémoire + refresh sur 401), voir client.ts.
 */
import { auth } from '@/lib/api/auth';
import { acces, biometrie } from '@/lib/api/acces';
import { audit } from '@/lib/api/audit';
import {
  consultationSymptomes,
  consultations,
  symptomes,
} from '@/lib/api/consultations';
import {
  diagnostics,
  documents,
  examens,
  ordonnances,
  traitements,
} from '@/lib/api/dossier';
import { notifications } from '@/lib/api/notifications';
import { patients } from '@/lib/api/patients';
import {
  etablissementSpecialites,
  etablissements,
  specialites,
} from '@/lib/api/referentiels';
import {
  infirmierEtablissements,
  infirmiers,
  medecinEtablissements,
  medecins,
} from '@/lib/api/staff';

export const api = {
  auth,
  patients,
  consultations,
  symptomes,
  consultationSymptomes,
  diagnostics,
  traitements,
  ordonnances,
  examens,
  documents,
  notifications,
  acces,
  biometrie,
  medecins,
  infirmiers,
  medecinEtablissements,
  infirmierEtablissements,
  etablissements,
  etablissementSpecialites,
  specialites,
  audit,
};

export { apiFetch, checkApiHealth, refreshSession } from '@/lib/api/client';
export { ApiError, toDisplayMessage } from '@/lib/api/errors';
export {
  clearSession,
  getAccessToken,
  hasSessionHint,
  setAccessToken,
  subscribeToAccessToken,
} from '@/lib/api/token';
export * from '@/lib/api/types';
