import { describe, expect, it } from 'vitest';
import { libelleRole, nomAffiche } from '@/lib/hooks/use-auth';
import type { AuthProfile } from '@/lib/api/types';

describe('use-auth utilities', () => {
  describe('libelleRole', () => {
    it('renvoie le libellé correct pour chaque rôle', () => {
      expect(libelleRole('admin')).toBe('Administrateur');
      expect(libelleRole('medecin')).toBe('Médecin');
      expect(libelleRole('infirmier')).toBe('Infirmier');
      expect(libelleRole('directeur')).toBe('Directeur');
      expect(libelleRole('patient')).toBe('Patient');
      expect(libelleRole(null)).toBeUndefined();
    });
  });

  describe('nomAffiche', () => {
    it('renvoie undefined si user est null', () => {
      expect(nomAffiche(null)).toBeUndefined();
    });

    it('affiche le nom complet pour un admin sans préfixe Dr.', () => {
      const user = {
        nom: 'Admin',
        prenom: 'Compte',
        type: 'admin',
      } as AuthProfile;
      expect(nomAffiche(user)).toBe('Compte Admin');
    });

    it('affiche Dr. Nom Prenom pour un medecin', () => {
      const user = {
        nom: 'Hounkpatin',
        prenom: 'Jean',
        type: 'medecin',
      } as AuthProfile;
      expect(nomAffiche(user)).toBe('Dr. Jean Hounkpatin');
    });

    it('gère de manière robuste un prenom manquant', () => {
      const user = {
        nom: 'Admin',
        type: 'admin',
      } as AuthProfile;
      expect(nomAffiche(user)).toBe('Admin');
    });

    it('gère de manière robuste un nom manquant', () => {
      const user = {
        prenom: 'Admin',
        type: 'admin',
      } as AuthProfile;
      expect(nomAffiche(user)).toBe('Admin');
    });

    it('renvoie undefined plutôt que undefined undefined si les deux sont absents', () => {
      const user = {
        type: 'admin',
      } as AuthProfile;
      expect(nomAffiche(user)).toBeUndefined();
    });
  });
});
