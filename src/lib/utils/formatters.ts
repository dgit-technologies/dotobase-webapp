/**
 * Fonctions utilitaires de formatage pour l'affichage des dossiers patients.
 */

/**
 * Calcule l'âge en années à partir d'une date de naissance (format ISO ou YYYY-MM-DD).
 */
export function calculerAge(dateNaissance?: string | null): number | null {
  if (!dateNaissance) return null;
  const dateObj = new Date(dateNaissance);
  if (isNaN(dateObj.getTime())) return null;

  const aujourdhui = new Date();
  let age = aujourdhui.getFullYear() - dateObj.getFullYear();
  const diffMois = aujourdhui.getMonth() - dateObj.getMonth();

  if (diffMois < 0 || (diffMois === 0 && aujourdhui.getDate() < dateObj.getDate())) {
    age--;
  }

  return age >= 0 ? age : null;
}

/**
 * Extrait les initiales d'un patient (Prénom Nom ou Nom Prénom).
 */
export function extraireInitiales(nom?: string | null, prenom?: string | null): string {
  const p = prenom?.trim() ? prenom.trim()[0].toUpperCase() : '';
  const n = nom?.trim() ? nom.trim()[0].toUpperCase() : '';
  if (p && n) return `${p}${n}`;
  if (n) return nom!.trim().slice(0, 2).toUpperCase();
  if (p) return prenom!.trim().slice(0, 2).toUpperCase();
  return 'PT';
}

/**
 * Formate la date de dernière visite pour l'affichage (ex: "Aujourd'hui", "Hier", ou "DD/MM/YYYY").
 */
export function formaterDateDerniereVisite(dateStr?: string | null): string {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '—';

  const aujourdhui = new Date();
  const memeJour =
    date.getDate() === aujourdhui.getDate() &&
    date.getMonth() === aujourdhui.getMonth() &&
    date.getFullYear() === aujourdhui.getFullYear();

  if (memeJour) return "Aujourd'hui";

  const hier = new Date(aujourdhui);
  hier.setDate(hier.getDate() - 1);
  const etaitHier =
    date.getDate() === hier.getDate() &&
    date.getMonth() === hier.getMonth() &&
    date.getFullYear() === hier.getFullYear();

  if (etaitHier) return 'Hier';

  const j = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const a = date.getFullYear();
  return `${j}/${m}/${a}`;
}

/**
 * Formate un identifiant ou NPI sous forme groupée (ex: "2290 8472 10").
 */
export function formaterNpi(valeur?: string | null): string {
  if (!valeur) return '—';
  const nettoye = valeur.replace(/\s+/g, '');
  if (nettoye.length <= 4) return nettoye;
  const parties = nettoye.match(/.{1,4}/g);
  return parties ? parties.join(' ') : nettoye;
}
