'use client';

import { useContext } from 'react';
import {
  AuthContext,
  type AuthContextValue,
} from '@/components/auth/AuthProvider';
import type { AuthProfile, UserType } from '@/lib/api/types';

/**
 * Session du compte connecté (backend Nest).
 *
 * Doit être appelé sous `<AuthProvider>` (monté dans le layout racine).
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth doit être utilisé à l’intérieur de <AuthProvider>');
  }

  return context;
}

const LIBELLES_ROLE: Record<UserType, string> = {
  medecin: 'Médecin',
  infirmier: 'Infirmier',
  admin: 'Administrateur',
  directeur: 'Directeur',
  patient: 'Patient',
};

/** Libellé affichable du rôle. */
export function libelleRole(role: UserType | null): string | undefined {
  return role ? LIBELLES_ROLE[role] : undefined;
}

/** Nom d'affichage, préfixé « Dr. » pour les médecins. */
export function nomAffiche(user: AuthProfile | null): string | undefined {
  if (!user) return undefined;

  const nomComplet = `${user.prenom} ${user.nom}`.trim();
  return user.type === 'medecin' ? `Dr. ${nomComplet}` : nomComplet;
}
