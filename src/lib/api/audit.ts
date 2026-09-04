import { createResource } from '@/lib/api/resource';
import type { AuditLog, CreateAuditLogPayload } from '@/lib/api/types';

export type AuditQuery = {
  table_name?: string;
  record_id?: string;
  medecin_id?: string;
};

const resource = createResource<
  AuditLog,
  CreateAuditLogPayload,
  never,
  AuditQuery
>('/audit');

/** Journal d'audit : en écriture seule (aucune modification/suppression). */
export const audit = {
  list: resource.list,
  get: resource.get,
  create: resource.create,
};
