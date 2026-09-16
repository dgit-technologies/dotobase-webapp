import { describe, it, expect } from 'vitest';
import {
  calculerAge,
  extraireInitiales,
  formaterDateDerniereVisite,
  formaterNpi,
} from './formatters';

describe('formatters', () => {
  describe('calculerAge', () => {
    it('calcule correctement l age pour une date valide', () => {
      const birthDate = '1994-05-15';
      const age = calculerAge(birthDate);
      expect(age).toBeTypeOf('number');
      expect(age).toBeGreaterThanOrEqual(30);
    });

    it('renvoie null pour une date invalide ou absente', () => {
      expect(calculerAge(null)).toBeNull();
      expect(calculerAge(undefined)).toBeNull();
      expect(calculerAge('date-invalide')).toBeNull();
    });
  });

  describe('extraireInitiales', () => {
    it('extrait les initiales prenom + nom', () => {
      expect(extraireInitiales('Codjo', 'Armand')).toBe('AC');
      expect(extraireInitiales('Lawson', 'Marcelle')).toBe('ML');
    });

    it('gere les valeurs incompletes ou vides', () => {
      expect(extraireInitiales('Kocou', '')).toBe('KO');
      expect(extraireInitiales('', '')).toBe('PT');
    });
  });

  describe('formaterDateDerniereVisite', () => {
    it('affiche Aujourd hui pour la date du jour', () => {
      const today = new Date().toISOString();
      expect(formaterDateDerniereVisite(today)).toBe("Aujourd'hui");
    });

    it('affiche Hier pour la date d hier', () => {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      expect(formaterDateDerniereVisite(yesterday)).toBe('Hier');
    });

    it('affiche un tiret si aucune date', () => {
      expect(formaterDateDerniereVisite(null)).toBe('—');
      expect(formaterDateDerniereVisite(undefined)).toBe('—');
    });
  });

  describe('formaterNpi', () => {
    it('groupe les chiffres en blocs', () => {
      expect(formaterNpi('2290847210')).toBe('2290 8472 10');
      expect(formaterNpi('123')).toBe('123');
    });

    it('gere null ou vide', () => {
      expect(formaterNpi(null)).toBe('—');
      expect(formaterNpi('')).toBe('—');
    });
  });
});
