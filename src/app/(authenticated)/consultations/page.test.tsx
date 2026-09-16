import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import ConsultationsPage from './page';

const mockPush = vi.fn();
const mockReplace = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
}));

const mockUser = {
  id: 'med-current',
  nom: 'Hounkpatin',
  prenom: 'Jean',
  type: 'medecin' as const,
  telephone: '+22901020304',
};

const mockEtablissement = {
  id: 'etab-1',
  nom: 'Clinique Saint Luc',
  ville: 'Cotonou, Bénin',
};

vi.mock('@/lib/hooks/use-auth', () => ({
  useAuth: () => ({
    user: mockUser,
    role: 'medecin',
    etablissementActif: mockEtablissement,
  }),
  nomAffiche: (u: any) => (u ? `Dr. ${u.nom}` : undefined),
}));

const mockPatients = [
  {
    id: 'pat-1',
    nom: 'Codjo',
    prenom: 'Armand',
    date_naissance: '1985-04-12',
    sexe: 'M' as const,
    adresse: 'Cotonou',
    groupe_sanguin: 'O+' as const,
  },
  {
    id: 'pat-2',
    nom: 'Lawson',
    prenom: 'Marc',
    date_naissance: '1978-09-20',
    sexe: 'M' as const,
    adresse: 'Porto-Novo',
    groupe_sanguin: 'A+' as const,
  },
  {
    id: 'pat-3',
    nom: 'Dossou',
    prenom: 'Carine',
    date_naissance: '1992-01-15',
    sexe: 'F' as const,
    adresse: 'Cotonou',
    groupe_sanguin: 'B+' as const,
  },
];

const mockMedecins = [
  {
    id: 'med-current',
    utilisateur_id: 'u-1',
    nom: 'Hounkpatin',
    prenom: 'Jean',
    specialite_id: 'spec-1',
    created_at: '2026-01-01',
    updated_at: '2026-01-01',
  },
  {
    id: 'med-2',
    utilisateur_id: 'u-2',
    nom: 'Adjovi',
    prenom: 'Michel',
    specialite_id: 'spec-2',
    created_at: '2026-01-01',
    updated_at: '2026-01-01',
  },
  {
    id: 'med-3',
    utilisateur_id: 'u-3',
    nom: 'Mensah',
    prenom: 'Awa',
    specialite_id: 'spec-3',
    created_at: '2026-01-01',
    updated_at: '2026-01-01',
  },
];

const mockConsultations = [
  {
    id: 'c-1',
    patient_id: 'pat-1',
    medecin_id: 'med-current',
    etablissement_id: 'etab-1',
    type: 'rdv' as const,
    motif: 'Suivi hypertension artérielle',
    service: 'Médecine générale',
    salle: '101',
    statut: 'terminee' as const,
    notes: 'Tension stabilisée',
    date_consultation: new Date().toISOString(),
    created_at: '2026-01-01',
    updated_at: '2026-01-01',
  },
  {
    id: 'c-2',
    patient_id: 'pat-2',
    medecin_id: 'med-2',
    etablissement_id: 'etab-1',
    type: 'urgence' as const,
    motif: 'Douleur thoracique aiguë',
    service: 'Urgences',
    salle: 'U1',
    statut: 'en_cours' as const,
    notes: 'Suspicion SCA',
    date_consultation: new Date().toISOString(),
    created_at: '2026-01-01',
    updated_at: '2026-01-01',
  },
  {
    id: 'c-3',
    patient_id: 'pat-3',
    medecin_id: 'med-3',
    etablissement_id: 'etab-1',
    type: 'walk_in' as const,
    motif: 'Fièvre persistante',
    service: 'Consultation rapide',
    salle: '104',
    statut: 'annulee' as const,
    notes: 'Patient reparti',
    date_consultation: '2026-01-10T08:00:00.000Z',
    created_at: '2026-01-01',
    updated_at: '2026-01-01',
  },
];

vi.mock('@/lib/api', () => ({
  api: {
    consultations: {
      list: vi.fn(() => Promise.resolve(mockConsultations)),
    },
    patients: {
      list: vi.fn(() => Promise.resolve(mockPatients)),
    },
    medecins: {
      list: vi.fn(() => Promise.resolve(mockMedecins)),
    },
  },
  toDisplayMessage: (err: any) => err?.message || 'Erreur',
}));

describe('ConsultationsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('affiche le titre de la page et les statistiques KPIs', async () => {
    render(<ConsultationsPage />);

    expect(screen.getByText('Gestion des Consultations')).toBeInTheDocument();
    expect(screen.queryByText('Clinique Saint Luc')).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Consultations Récentes')).toBeInTheDocument();
    });

    // Vérification des libellés de stats
    expect(screen.getByText('Total Consultations')).toBeInTheDocument();
    expect(screen.getByText("Aujourd'hui")).toBeInTheDocument();
    expect(screen.getAllByText('En cours').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Terminées').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Urgences').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Annulées').length).toBeGreaterThanOrEqual(1);
  });

  it('affiche la liste des consultations récentes effectuées par les médecins avec patient et type', async () => {
    render(<ConsultationsPage />);

    await waitFor(() => {
      expect(screen.getByText('Codjo Armand')).toBeInTheDocument();
      expect(screen.getByText('Lawson Marc')).toBeInTheDocument();
      expect(screen.getByText('Dossou Carine')).toBeInTheDocument();
    });

    // Les médecins
    expect(screen.getByText('Dr. Hounkpatin')).toBeInTheDocument();
    expect(screen.getByText('Dr. Adjovi')).toBeInTheDocument();
    expect(screen.getByText('Dr. Mensah')).toBeInTheDocument();

    // Les types
    expect(screen.getAllByText('RDV').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Urgence').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Walk-in').length).toBeGreaterThanOrEqual(1);

    // Le badge "Vous" pour le médecin connecté
    expect(screen.getByText('Vous')).toBeInTheDocument();
  });

  it('permet de filtrer les consultations par médecin ("Mes consultations")', async () => {
    render(<ConsultationsPage />);

    await waitFor(() => {
      expect(screen.getByText('Codjo Armand')).toBeInTheDocument();
    });

    const selectMedecin = screen.getByDisplayValue('Tous les médecins');
    fireEvent.change(selectMedecin, { target: { value: 'moi' } });

    // Seule la consultation effectuée par le médecin connecté (Codjo) doit être affichée
    expect(screen.getByText('Codjo Armand')).toBeInTheDocument();
    expect(screen.queryByText('Lawson Marc')).not.toBeInTheDocument();
    expect(screen.queryByText('Dossou Carine')).not.toBeInTheDocument();
  });

  it('permet de filtrer par type (ex: Urgence)', async () => {
    render(<ConsultationsPage />);

    await waitFor(() => {
      expect(screen.getByText('Codjo Armand')).toBeInTheDocument();
    });

    const selectType = screen.getByDisplayValue("Type d'acte (Tous)");
    fireEvent.change(selectType, { target: { value: 'urgence' } });

    // Seul Lawson Marc a une consultation d'urgence
    expect(screen.getByText('Lawson Marc')).toBeInTheDocument();
    expect(screen.queryByText('Codjo Armand')).not.toBeInTheDocument();
    expect(screen.queryByText('Dossou Carine')).not.toBeInTheDocument();
  });

  it('permet de filtrer par recherche textuelle (patient ou motif)', async () => {
    render(<ConsultationsPage />);

    await waitFor(() => {
      expect(screen.getByText('Codjo Armand')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Recherche rapide/);
    fireEvent.change(searchInput, { target: { value: 'thoracique' } });

    expect(screen.getByText('Lawson Marc')).toBeInTheDocument();
    expect(screen.queryByText('Codjo Armand')).not.toBeInTheDocument();
  });

  it('ouvre la modale Nouvelle consultation et permet de choisir un patient', async () => {
    render(<ConsultationsPage />);

    await waitFor(() => {
      expect(screen.getByText('Gestion des Consultations')).toBeInTheDocument();
    });

    const btnNouv = screen.getAllByRole('button', { name: /Nouvelle consultation/i })[0];
    fireEvent.click(btnNouv);

    expect(screen.getByText('Sélectionnez le patient pour démarrer la consultation')).toBeInTheDocument();

    // Cliquer sur le patient Armand Codjo dans la modale
    const patientBtn = screen.getByRole('button', { name: /Codjo Armand/i });
    fireEvent.click(patientBtn);

    expect(mockPush).toHaveBeenCalledWith('/patients/pat-1/consultations/new');
  });

  it('navigue vers le dossier patient lors d’un clic sur une ligne du tableau', async () => {
    render(<ConsultationsPage />);

    await waitFor(() => {
      expect(screen.getByText('Codjo Armand')).toBeInTheDocument();
    });

    const rowPatient = screen.getByText('Codjo Armand');
    fireEvent.click(rowPatient);

    expect(mockPush).toHaveBeenCalledWith('/patients/pat-1');
  });

  it('applique le bleu primaire officiel du projet (#8BD2F2) aux boutons Nouvelle consultation', async () => {
    render(<ConsultationsPage />);

    await waitFor(() => {
      expect(screen.getByText('Gestion des Consultations')).toBeInTheDocument();
    });

    const boutonsNouvelleConsultation = screen.getAllByRole('button', { name: /Nouvelle consultation/i });
    expect(boutonsNouvelleConsultation.length).toBeGreaterThanOrEqual(2);

    boutonsNouvelleConsultation.forEach((btn) => {
      expect(btn.className).toContain('bg-[#8BD2F2]');
      expect(btn.className).toContain('text-[#0E1B2A]');
    });
  });
});
