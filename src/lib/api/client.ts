import { API_BASE_URL, API_VERSION_PREFIX } from '@/lib/api/config';
import { ApiError, extractErrorMessage } from '@/lib/api/errors';
import {
  clearSession,
  getAccessToken,
  setAccessToken,
  setSessionHint,
} from '@/lib/api/token';

export type QueryValue = string | number | boolean | null | undefined;
export type QueryParams = Record<string, QueryValue>;

export interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  /** Corps sérialisé en JSON (objet) — ou `FormData`/`string` brut. */
  body?: unknown;
  /** Query string : les valeurs `undefined`, `null` et `''` sont ignorées. */
  query?: QueryParams;
  /**
   * Force le bearer utilisé. `null` = requête anonyme. Sert au refresh et à
   * un éventuel appel côté serveur (Server Action) avec un token explicite,
   * puisque le token en mémoire n'existe que dans le navigateur.
   */
  token?: string | null;
  /** N'essaie pas de rejouer la requête après un 401 (routes d'auth). */
  skipAuthRefresh?: boolean;
  /** `false` pour taper hors du préfixe `/v1` (ex: `/health`). */
  versioned?: boolean;
}

function buildUrl(
  path: string,
  query?: QueryParams,
  versioned = true
): string {
  const prefix = versioned ? API_VERSION_PREFIX : '';
  const url = new URL(
    `${API_BASE_URL}${prefix}${path.startsWith('/') ? path : `/${path}`}`
  );

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    url.searchParams.set(key, String(value));
  });

  return url.toString();
}

async function parseBody(response: Response): Promise<unknown> {
  if (response.status === 204) return undefined;

  const text = await response.text();
  if (text === '') return undefined;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function sendRequest(
  path: string,
  options: ApiRequestOptions
): Promise<Response> {
  const { body, query, token, versioned, ...init } = options;

  const headers = new Headers(init.headers);
  const isJsonBody =
    body !== undefined &&
    !(typeof FormData !== 'undefined' && body instanceof FormData) &&
    typeof body !== 'string';

  if (isJsonBody) headers.set('Content-Type', 'application/json');

  const bearer = token === undefined ? getAccessToken() : token;
  if (bearer) headers.set('Authorization', `Bearer ${bearer}`);

  return fetch(buildUrl(path, query, versioned), {
    ...init,
    headers,
    // Indispensable : le refresh token vit dans un cookie HttpOnly posé par
    // le backend (origine différente de la webapp en local et en prod).
    credentials: 'include',
    body: isJsonBody ? JSON.stringify(body) : (body as BodyInit | undefined),
  });
}

async function toResult<T>(response: Response): Promise<T> {
  const payload = await parseBody(response);

  if (!response.ok) {
    throw new ApiError(
      response.status,
      extractErrorMessage(payload, response.status),
      payload
    );
  }

  return payload as T;
}

/**
 * Un seul refresh à la fois : si trois requêtes se prennent un 401 en même
 * temps, elles attendent toutes le même appel plutôt que d'en déclencher
 * trois (ce qui ferait tourner le refresh token trois fois de suite).
 */
let pendingRefresh: Promise<string | null> | null = null;

/**
 * Redemande un access token à partir du cookie HttpOnly `refresh_token`.
 * Renvoie le nouveau token, ou `null` si la session est morte (dans ce cas
 * l'état local est nettoyé).
 */
export function refreshSession(): Promise<string | null> {
  pendingRefresh ??= (async () => {
    try {
      const response = await sendRequest('/auth/refresh', {
        method: 'POST',
        // Le refresh token est lu du cookie ; le body reste requis par le DTO.
        body: {},
        token: null,
        skipAuthRefresh: true,
      });

      if (!response.ok) {
        clearSession();
        return null;
      }

      const { access_token } = ((await parseBody(response)) ?? {}) as {
        access_token?: string;
      };

      if (!access_token) {
        clearSession();
        return null;
      }

      setAccessToken(access_token);
      setSessionHint();
      return access_token;
    } catch {
      // Backend injoignable : on ne détruit pas la session, l'appelant
      // affichera l'erreur réseau et pourra réessayer.
      return null;
    } finally {
      pendingRefresh = null;
    }
  })();

  return pendingRefresh;
}

/**
 * Appel typé vers l'API Nest. `path` est relatif au préfixe de version
 * (ex: `/patients/123` → `http://localhost:4001/v1/patients/123`).
 *
 * Sur 401, tente un refresh puis rejoue la requête une seule fois.
 */
export async function apiFetch<T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const response = await sendRequest(path, options);

  if (response.status === 401 && !options.skipAuthRefresh) {
    const token = await refreshSession();
    if (token) {
      return toResult<T>(await sendRequest(path, { ...options, token }));
    }
  }

  return toResult<T>(response);
}

/** Ping du backend (`/health`, hors versioning). */
export function checkApiHealth(): Promise<{ status: string }> {
  return apiFetch<{ status: string }>('/health', {
    versioned: false,
    token: null,
    skipAuthRefresh: true,
  });
}
