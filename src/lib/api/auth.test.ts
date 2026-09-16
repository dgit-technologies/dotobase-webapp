import { describe, expect, it, vi } from 'vitest';
import { auth, normalizeAuthProfile } from '@/lib/api/auth';
import type { AuthMeResponse, AuthProfile } from '@/lib/api/types';

vi.mock('@/lib/api/client', () => ({
  apiFetch: vi.fn(),
  refreshSession: vi.fn(),
}));

import { apiFetch } from '@/lib/api/client';

describe('normalizeAuthProfile', () => {
  it('normalise la structure multi-profil renvoyée pour un compte admin', () => {
    const raw: AuthMeResponse = {
      telephone: '+2290161000000',
      type: 'admin',
      medecin: {
        id: '37034f1f-7c90-40a7-a97c-a026cd9b79e0',
        utilisateur_id: '90805515-9000-4806-9791-bf0eccc303bc',
        nom: 'Admin',
        prenom: 'Compte',
        specialite_id: null,
        created_at: '2026-09-10T14:48:06.90201+00:00',
        updated_at: '2026-09-10T14:48:06.90201+00:00',
      },
      etablissements: [],
    };

    const profile = normalizeAuthProfile(raw);

    expect(profile.id).toBe('37034f1f-7c90-40a7-a97c-a026cd9b79e0');
    expect(profile.nom).toBe('Admin');
    expect(profile.prenom).toBe('Compte');
    expect(profile.type).toBe('admin');
    expect(profile.telephone).toBe('+2290161000000');
    expect(profile.etablissements).toEqual([]);
  });

  it('normalise la structure multi-profil pour un infirmier', () => {
    const raw: AuthMeResponse = {
      telephone: '+2290162000000',
      type: 'infirmier',
      infirmier: {
        id: 'inf-uuid',
        utilisateur_id: 'user-uuid',
        nom: 'Koffi',
        prenom: 'Awa',
        service: null,
        created_at: '2026-01-01T00:00:00.000Z',
        updated_at: '2026-01-01T00:00:00.000Z',
      },
      etablissements: [
        { etablissement_id: 'etab-1', role: 'infirmier', est_principal: true },
      ],
    };

    const profile = normalizeAuthProfile(raw);

    expect(profile.id).toBe('inf-uuid');
    expect(profile.nom).toBe('Koffi');
    expect(profile.prenom).toBe('Awa');
    expect(profile.type).toBe('infirmier');
    expect(profile.telephone).toBe('+2290162000000');
    expect(profile.etablissements).toHaveLength(1);
  });

  it('préserve un profil déjà plat (ex: tests et mocks existants)', () => {
    const flat: AuthProfile = {
      id: 'medecin-uuid',
      utilisateur_id: 'user-uuid',
      nom: 'Hounkpatin',
      prenom: 'Jean',
      specialite_id: 'spec-uuid',
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z',
      telephone: '+2290161000000',
      type: 'medecin',
    };

    const profile = normalizeAuthProfile(flat);

    expect(profile).toEqual(flat);
  });
});

describe('auth.me', () => {
  it('appelle GET /auth/me et normalise la réponse', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce({
      telephone: '+2290161000000',
      type: 'admin',
      medecin: {
        id: 'med-id',
        utilisateur_id: 'u-id',
        nom: 'Dossou',
        prenom: 'Paul',
        specialite_id: null,
        created_at: '2026-01-01T00:00:00.000Z',
        updated_at: '2026-01-01T00:00:00.000Z',
      },
      etablissements: [],
    });

    const result = await auth.me();

    expect(apiFetch).toHaveBeenCalledWith('/auth/me');
    expect(result.id).toBe('med-id');
    expect(result.nom).toBe('Dossou');
    expect(result.prenom).toBe('Paul');
  });
});
