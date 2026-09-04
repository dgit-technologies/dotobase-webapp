import { apiFetch, type QueryParams } from '@/lib/api/client';

/**
 * Fabrique les opérations REST communes à tous les modules du backend, qui
 * suivent tous la même forme : `GET /x`, `GET /x/:id`, `POST /x`,
 * `PATCH /x/:id`, `DELETE /x/:id`.
 *
 * Chaque module ne réexporte que les opérations réellement exposées par son
 * controller (certains n'ont ni PATCH ni DELETE) et ajoute ses routes
 * spécifiques.
 */
export interface Resource<
  TRow,
  TCreate = never,
  TUpdate = never,
  TQuery extends QueryParams = QueryParams,
> {
  list(query?: TQuery): Promise<TRow[]>;
  get(id: string): Promise<TRow>;
  create(payload: TCreate): Promise<TRow>;
  update(id: string, payload: TUpdate): Promise<TRow>;
  remove(id: string): Promise<void>;
}

export function createResource<
  TRow,
  TCreate = never,
  TUpdate = never,
  TQuery extends QueryParams = QueryParams,
>(basePath: string): Resource<TRow, TCreate, TUpdate, TQuery> {
  return {
    list: (query) => apiFetch<TRow[]>(basePath, { query }),
    get: (id) => apiFetch<TRow>(`${basePath}/${encodeURIComponent(id)}`),
    create: (payload) =>
      apiFetch<TRow>(basePath, { method: 'POST', body: payload }),
    update: (id, payload) =>
      apiFetch<TRow>(`${basePath}/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: payload,
      }),
    remove: (id) =>
      apiFetch<void>(`${basePath}/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      }),
  };
}
