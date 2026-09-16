import { z } from 'zod';

/**
 * Le backend attend les téléphones au format international E.164 et les
 * valide contre le plan de numérotation béninois
 * (`IsTelephoneBJ`, libphonenumber-js). On normalise donc la saisie avant
 * l'envoi plutôt que d'imposer le « + » à l'utilisateur.
 */
export const INDICATIF_BENIN = '+229';
export const EXEMPLE_TELEPHONE = '+229 01 61 00 00 00';

/**
 * Normalise une saisie libre en E.164 :
 *   « 01 61 00 00 00 » → « +2290161000000 »
 *   « 00229 0161000000 » → « +2290161000000 »
 * Une saisie déjà internationale est conservée telle quelle.
 */
export function normaliserTelephone(saisie: string): string {
  const compact = saisie.replace(/[\s.\-()]/g, '');

  if (compact.startsWith('+')) return compact;
  if (compact.startsWith('00')) return `+${compact.slice(2)}`;

  const chiffres = compact.replace(/\D/g, '');
  if (chiffres === '') return '';
  if (chiffres.startsWith('229')) return `+${chiffres}`;

  return `${INDICATIF_BENIN}${chiffres}`;
}

/**
 * Vérifie si un numéro de téléphone respecte le plan de numérotation béninois :
 * - Nouveau plan national à 10 chiffres : commence par '01' suivi de 8 chiffres
 * - Format traditionnel à 8 chiffres : 8 chiffres (commençant par 2, 4, 5, 6 ou 9)
 * Gère la saisie locale ou internationale (avec ou sans indicatif +229).
 */
export function isTelephoneBJ(saisie: string): boolean {
  if (!saisie || typeof saisie !== 'string') return false;
  const compact = saisie.replace(/[\s.\-()]/g, '');
  const chiffres = compact.replace(/\D/g, '');

  let local = chiffres;
  if (local.startsWith('229')) {
    local = local.slice(3);
  }

  // Nouveau format béninois (10 chiffres : 01 + 8 chiffres)
  if (/^01\d{8}$/.test(local)) return true;

  // Ancien format béninois (8 chiffres : commence par 2, 4, 5, 6 ou 9)
  if (/^[24569]\d{7}$/.test(local)) return true;

  return false;
}

/** Téléphone plausible : indicatif + 6 à 14 chiffres. */
export const telephoneSchema = z
  .string()
  .trim()
  .min(1, 'Le téléphone est obligatoire.')
  .transform(normaliserTelephone)
  .refine((valeur) => /^\+\d{6,15}$/.test(valeur), {
    message: `Numéro invalide. Format attendu : ${EXEMPLE_TELEPHONE}`,
  });

/** Aligné sur le minimum imposé par le backend (LoginDto). */
export const passwordSchema = z
  .string()
  .min(8, 'Le mot de passe doit contenir au moins 8 caractères.');

export const loginSchema = z.object({
  telephone: telephoneSchema,
  password: passwordSchema,
});

export type LoginFormValues = z.infer<typeof loginSchema>;

/** Code OTP à 6 chiffres (connexion patient). */
export const otpCodeSchema = z
  .string()
  .regex(/^\d{6}$/, 'Le code doit contenir 6 chiffres.');

/** NPI : 10 chiffres. Donnée de profil uniquement, plus un identifiant. */
export const npiSchema = z
  .string()
  .regex(/^\d{10}$/, 'Le NPI doit contenir exactement 10 chiffres.');

/** Renvoie le premier message d'erreur d'un `safeParse` raté. */
export function premiereErreur(error: z.ZodError): string {
  return error.issues[0]?.message ?? 'Saisie invalide.';
}
