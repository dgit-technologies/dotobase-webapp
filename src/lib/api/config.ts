/**
 * Configuration d'accès au backend Nest (dépôt `dotobase-backend`).
 *
 * Supabase n'est plus appelé directement par la webapp : il ne sert plus que
 * de base de données, derrière le backend. Toutes les lectures/écritures
 * passent par l'API Nest, qui détient la service role key et applique les
 * règles d'accès (guards JWT + rôles).
 */

/** URL racine de l'API Nest, sans slash final. */
export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4001'
).replace(/\/+$/, '');

/**
 * Toutes les routes métier sont versionnées (`app.enableVersioning` côté
 * backend). Seul `/health` vit hors de ce préfixe.
 */
export const API_VERSION_PREFIX = '/v1';

/**
 * Cookie témoin (non HttpOnly) posé après un login réussi. Il ne contient
 * aucun token : le vrai refresh token est dans un cookie HttpOnly posé par le
 * backend sur le chemin `/v1/auth/refresh`, donc invisible depuis JS ET
 * jamais envoyé aux requêtes de la webapp. Ce témoin sert uniquement à savoir
 * qu'une session est probablement active (bootstrap client, garde de routes
 * dans `proxy.ts`) sans faire d'appel réseau inutile.
 */
export const SESSION_HINT_COOKIE = 'dotobase_session';

/** 30 jours, aligné sur la durée de vie du refresh token backend. */
export const SESSION_HINT_MAX_AGE_S = 30 * 24 * 60 * 60;
