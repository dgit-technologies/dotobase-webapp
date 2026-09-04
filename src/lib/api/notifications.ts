import { apiFetch } from '@/lib/api/client';
import { createResource } from '@/lib/api/resource';
import type {
  CreateNotificationPayload,
  Notification,
} from '@/lib/api/types';

export type NotificationsQuery = {
  medecin_id?: string;
};

const resource = createResource<
  Notification,
  CreateNotificationPayload,
  { est_lue: boolean },
  NotificationsQuery
>('/notifications');

/** Module `notifications` : pas de suppression exposée par le backend. */
export const notifications = {
  list: resource.list,
  get: resource.get,
  create: resource.create,
  update: resource.update,

  /** Raccourci de `PATCH /notifications/:id/lu`. */
  marquerLue: (id: string) =>
    apiFetch<Notification>(`/notifications/${encodeURIComponent(id)}/lu`, {
      method: 'PATCH',
    }),
};
