/**
 * Erreur remontée par le client API pour toute réponse HTTP non 2xx.
 *
 * Le backend Nest renvoie `{ statusCode, error, message }` où `message` est
 * soit une chaîne, soit un tableau (erreurs de validation class-validator).
 * On normalise ça en un seul message affichable.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }

  /** Token absent, invalide ou expiré. */
  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  /** Authentifié mais rôle insuffisant. */
  get isForbidden(): boolean {
    return this.status === 403;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }

  /** Throttler backend : 5 requêtes/min sur les routes d'auth. */
  get isRateLimited(): boolean {
    return this.status === 429;
  }
}

/** Extrait un message lisible du corps d'erreur renvoyé par Nest. */
export function extractErrorMessage(body: unknown, status: number): string {
  if (typeof body === 'string' && body.trim() !== '') return body;

  if (body !== null && typeof body === 'object') {
    const message = (body as { message?: unknown }).message;
    if (Array.isArray(message)) return message.join(' · ');
    if (typeof message === 'string' && message.trim() !== '') return message;
  }

  return `Erreur ${status}`;
}

/** Message affichable pour n'importe quelle exception (réseau inclus). */
export function toDisplayMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return 'Une erreur inattendue est survenue.';
}
