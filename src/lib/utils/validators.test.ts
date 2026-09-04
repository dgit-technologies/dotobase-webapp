import { describe, expect, it } from 'vitest';
import {
  loginSchema,
  normaliserTelephone,
  npiSchema,
  otpCodeSchema,
  premiereErreur,
  telephoneSchema,
} from '@/lib/utils/validators';

describe('normaliserTelephone', () => {
  it('ajoute l’indicatif béninois à un numéro local', () => {
    expect(normaliserTelephone('01 61 00 00 00')).toBe('+2290161000000');
  });

  it('accepte les séparateurs courants', () => {
    expect(normaliserTelephone('01-61.00 (00) 00')).toBe('+2290161000000');
  });

  it('convertit le préfixe 00 en +', () => {
    expect(normaliserTelephone('00229 0161000000')).toBe('+2290161000000');
  });

  it('conserve un numéro déjà international', () => {
    expect(normaliserTelephone('+2290161000000')).toBe('+2290161000000');
  });

  it('ne double pas l’indicatif quand il est saisi sans +', () => {
    expect(normaliserTelephone('2290161000000')).toBe('+2290161000000');
  });

  it('renvoie une chaîne vide pour une saisie vide', () => {
    expect(normaliserTelephone('   ')).toBe('');
  });
});

describe('telephoneSchema', () => {
  it('normalise la saisie valide', () => {
    expect(telephoneSchema.parse('0161000000')).toBe('+2290161000000');
  });

  it('rejette une saisie non numérique', () => {
    expect(telephoneSchema.safeParse('abc').success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('renvoie le payload attendu par POST /v1/auth/login', () => {
    const resultat = loginSchema.safeParse({
      telephone: '01 61 00 00 00',
      password: 'Admin@1234',
    });

    expect(resultat.success).toBe(true);
    expect(resultat.success && resultat.data).toEqual({
      telephone: '+2290161000000',
      password: 'Admin@1234',
    });
  });

  it('refuse un mot de passe de moins de 8 caractères', () => {
    const resultat = loginSchema.safeParse({
      telephone: '0161000000',
      password: 'court',
    });

    expect(resultat.success).toBe(false);
    expect(!resultat.success && premiereErreur(resultat.error)).toContain('8 caractères');
  });
});

describe('otpCodeSchema / npiSchema', () => {
  it('valide un code à 6 chiffres', () => {
    expect(otpCodeSchema.safeParse('482913').success).toBe(true);
    expect(otpCodeSchema.safeParse('48291').success).toBe(false);
  });

  it('valide un NPI à 10 chiffres', () => {
    expect(npiSchema.safeParse('0123456789').success).toBe(true);
    expect(npiSchema.safeParse('123').success).toBe(false);
  });
});
