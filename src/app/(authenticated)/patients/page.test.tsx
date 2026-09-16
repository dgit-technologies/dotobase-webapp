import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PatientsPage from './page';
import { api } from '@/lib/api';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock('@/lib/hooks/use-auth', () => ({
  useAuth: () => ({
    etablissementActif: { id: 'etab-1', nom: 'Clinique Saint Luc' },
    role: 'medecin',
  }),
}));

vi.mock('@/lib/api', () => ({
  api: {
    patients: {
      list: vi.fn(),
    },
    consultations: {
      list: vi.fn(),
    },
    traitements: {
      list: vi.fn(),
    },
    diagnostics: {
      list: vi.fn(),
    },
    audit: {
      list: vi.fn(),
    },
    acces: {
      list: vi.fn(),
    },
  },
  toDisplayMessage: (err: any) => err?.message || 'Erreur',
}));

const mockPatients = [
  {
    id: 'pat-1',
    utilisateur_id: 'u-1',
    nom: 'Codjo',
    prenom: 'Armand',
    date_naissance: '1992-04-12',
    sexe: 'M' as const,
    adresse: 'Cotonou',
    groupe_sanguin: 'O+' as const,
    created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'pat-2',
    utilisateur_id: 'u-2',
    nom: 'Lawson',
    prenom: 'Marcelle',
    date_naissance: '1996-08-20',
    sexe: 'F' as const,
    adresse: 'Porto-Novo',
    groupe_sanguin: 'A+' as const,
    created_at: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

describe('PatientsPage (/patients route)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (api.patients.list as any).mockResolvedValue(mockPatients);
    (api.consultations.list as any).mockResolvedValue([]);
    (api.traitements.list as any).mockResolvedValue([]);
    (api.diagnostics.list as any).mockResolvedValue([]);
    (api.audit.list as any).mockResolvedValue([]);
    (api.acces.list as any).mockResolvedValue([
      {
        id: 'acc-1',
        patient_id: 'pat-1',
        etablissement_id: 'etab-1',
        statut: 'approuve',
        date_expiration: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      },
      {
        id: 'acc-2',
        patient_id: 'pat-2',
        etablissement_id: 'etab-1',
        statut: 'approuve',
        date_expiration: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      },
    ]);
  });

  it('affiche le titre et charge les patients', async () => {
    render(<PatientsPage />);
    expect(screen.getByRole('heading', { level: 1, name: /dossiers médicaux/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Armand Codjo')).toBeInTheDocument();
      expect(screen.getByText('Marcelle Lawson')).toBeInTheDocument();
    });
  });
});
