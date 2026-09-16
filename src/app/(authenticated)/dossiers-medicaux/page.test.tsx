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
      get: vi.fn(),
      recherche: vi.fn(),
      create: vi.fn(),
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
      create: vi.fn(),
    },
    biometrie: {
      identifier: vi.fn(),
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

const mockConsultations = [
  {
    id: 'c-1',
    patient_id: 'pat-1',
    medecin_id: 'med-1',
    etablissement_id: 'etab-1',
    type: 'rdv' as const,
    motif: 'Douleur thoracique',
    service: 'Cardiologie',
    salle: '101',
    statut: 'terminee' as const,
    notes: null,
    date_consultation: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const mockDiagnostics = [
  {
    id: 'd-1',
    patient_id: 'pat-2',
    consultation_id: 'c-2',
    code_libre: 'Pénicilline',
    icd10_code_id: null,
    type: 'principal' as const,
    commentaire: null,
    severite: 'critique' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const mockTraitements = [
  {
    id: 't-1',
    patient_id: 'pat-1',
    consultation_id: 'c-1',
    medicament: 'Paracétamol',
    dosage: '1g',
    frequence: '3x/jour',
    date_debut: '2026-09-01',
    date_fin: '2026-09-30',
    actif: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

describe('PatientsPage (Dossiers médicaux)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (api.patients.list as any).mockResolvedValue(mockPatients);
    (api.patients.get as any).mockImplementation((id: string) => {
      const found = mockPatients.find((p) => p.id === id);
      if (found) return Promise.resolve(found);
      return Promise.reject(new Error('404: Patient not found'));
    });
    (api.patients.recherche as any).mockRejectedValue(new Error('404: Not found'));
    (api.consultations.list as any).mockResolvedValue(mockConsultations);
    (api.traitements.list as any).mockResolvedValue(mockTraitements);
    (api.diagnostics.list as any).mockResolvedValue(mockDiagnostics);
    (api.audit.list as any).mockResolvedValue([]);
    (api.acces.create as any).mockResolvedValue({ id: 'acc-new' });
    (api.acces.list as any).mockResolvedValue([
      {
        id: 'acc-2',
        patient_id: 'pat-2',
        etablissement_id: 'etab-1',
        statut: 'approuve',
        date_expiration: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      },
    ]);
  });

  it('affiche le titre de la page "Dossiers médicaux" et le sous-titre', async () => {
    render(<PatientsPage />);
    expect(screen.getByRole('heading', { level: 1, name: /dossiers médicaux/i })).toBeInTheDocument();
    expect(
      screen.getByText(/gérez et suivez les dossiers médicaux des patients/i)
    ).toBeInTheDocument();
  });

  it('charge et affiche les données patients depuis le backend', async () => {
    render(<PatientsPage />);

    await waitFor(() => {
      expect(screen.getByText('Armand Codjo')).toBeInTheDocument();
      expect(screen.getByText('Marcelle Lawson')).toBeInTheDocument();
    });

    // Alertes et groupe sanguin
    expect(screen.getAllByText('O+').length).toBeGreaterThan(0);
    expect(screen.getAllByText('A+').length).toBeGreaterThan(0);
    expect(screen.getByText('Pénicilline')).toBeInTheDocument();
  });

  it('affiche les cartes KPIs calculées dynamiquement', async () => {
    render(<PatientsPage />);

    expect(screen.getByText('TOTAL DOSSIERS')).toBeInTheDocument();
    expect(screen.getByText('ACTIFS')).toBeInTheDocument();
    expect(screen.getByText('URGENT')).toBeInTheDocument();
    expect(screen.getByText('NOUVEAUX (7J)')).toBeInTheDocument();
    expect(screen.getByText('SOUS TRAITEMENT')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('TOTAL DOSSIERS').parentElement).toHaveTextContent('2');
    });
  });

  it('affiche 0 dans les cartes KPIs lorsquaucun patient nexiste (pas de valeurs en dur)', async () => {
    (api.patients.list as any).mockResolvedValueOnce([]);
    render(<PatientsPage />);

    await waitFor(() => {
      expect(screen.getByText('TOTAL DOSSIERS').parentElement).toHaveTextContent('0');
      expect(screen.getByText('ACTIFS').parentElement).toHaveTextContent('0');
      expect(screen.getByText('URGENT').parentElement).toHaveTextContent('0');
      expect(screen.getByText('NOUVEAUX (7J)').parentElement).toHaveTextContent('0');
      expect(screen.getByText('SOUS TRAITEMENT').parentElement).toHaveTextContent('0');
    });

    // S'assurer que les anciennes valeurs en dur ne sont pas affichées
    expect(screen.queryByText('120')).not.toBeInTheDocument();
    expect(screen.queryByText('98')).not.toBeInTheDocument();
    expect(screen.queryByText('+2%')).not.toBeInTheDocument();
  });

  it('permet de filtrer les patients par recherche textuelle', async () => {
    render(<PatientsPage />);

    await waitFor(() => {
      expect(screen.getByText('Armand Codjo')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/rechercher un dossier par nom, npi, téléphone.../i);
    fireEvent.change(searchInput, { target: { value: 'Marcelle' } });

    expect(screen.getByText('Marcelle Lawson')).toBeInTheDocument();
    expect(screen.queryByText('Armand Codjo')).not.toBeInTheDocument();
  });

  it('permet de filtrer les patients par genre et de réinitialiser avec "Effacer les filtres"', async () => {
    render(<PatientsPage />);

    await waitFor(() => {
      expect(screen.getByText('Armand Codjo')).toBeInTheDocument();
    });

    const genreSelect = screen.getByRole('combobox', { name: /genre/i });
    fireEvent.change(genreSelect, { target: { value: 'F' } });

    expect(screen.getByText('Marcelle Lawson')).toBeInTheDocument();
    expect(screen.queryByText('Armand Codjo')).not.toBeInTheDocument();

    const resetBtn = screen.getByRole('button', { name: /effacer les filtres/i });
    fireEvent.click(resetBtn);

    expect(screen.getByText('Armand Codjo')).toBeInTheDocument();
    expect(screen.getByText('Marcelle Lawson')).toBeInTheDocument();
  });

  it('navigue vers le dossier patient au clic sur Consulter', async () => {
    render(<PatientsPage />);

    await waitFor(() => {
      expect(screen.getByText('Armand Codjo')).toBeInTheDocument();
    });

    const voirDossierButtons = screen.getAllByRole('button', { name: /voir le dossier/i });
    expect(voirDossierButtons.length).toBeGreaterThan(0);
    fireEvent.click(voirDossierButtons[0]);

    expect(mockPush).toHaveBeenCalledWith('/dossiers-medicaux/pat-1');
  });

  it('ouvre la modale et permet de rechercher un patient par nom ou NPI', async () => {
    render(<PatientsPage />);

    const openBtn = screen.getByRole('button', { name: /ouvrir un dossier/i });
    fireEvent.click(openBtn);

    expect(screen.getByText(/ouvrir un dossier médical/i)).toBeInTheDocument();

    const input = screen.getByPlaceholderText(/Ex: \+229 97 00 00 01 ou 1234 5678 90/i);
    fireEvent.change(input, { target: { value: 'Codjo' } });

    const searchBtn = screen.getByRole('button', { name: /rechercher le dossier/i });
    fireEvent.click(searchBtn);

    await waitFor(() => {
      expect(screen.getByText(/autorisation accordée/i)).toBeInTheDocument();
    });

    const goBtn = screen.getByRole('button', { name: /aller au dossier médical/i });
    fireEvent.click(goBtn);

    expect(mockPush).toHaveBeenCalledWith('/dossiers-medicaux/pat-1');
  });

  it('permet de rechercher un dossier médical par numéro de téléphone', async () => {
    (api.patients.list as any).mockImplementation((query?: any) => {
      if (query?.telephone === '97000001' || query?.telephone === '+22997000001') {
        return Promise.resolve([mockPatients[0]]);
      }
      return Promise.resolve(mockPatients);
    });

    render(<PatientsPage />);

    await waitFor(() => {
      expect(screen.getByText('Armand Codjo')).toBeInTheDocument();
    });

    const openBtn = screen.getByRole('button', { name: /ouvrir un dossier/i });
    fireEvent.click(openBtn);

    const input = screen.getByPlaceholderText(/Ex: \+229 97 00 00 01 ou 1234 5678 90/i);
    fireEvent.change(input, { target: { value: '+229 97 00 00 01' } });

    const searchBtn = screen.getByRole('button', { name: /rechercher le dossier/i });
    fireEvent.click(searchBtn);

    await waitFor(() => {
      expect(screen.getByText(/autorisation accordée/i)).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: /Armand Codjo/i })).toBeInTheDocument();
    });
  });

  it('utilise api.patients.recherche et ouvre directement le dossier si a_acces est vrai', async () => {
    (api.patients.recherche as any).mockResolvedValue({
      id: 'pat-global-1',
      nom: 'Dossou',
      prenom: 'Eric',
      date_naissance: '1988-02-15',
      sexe: 'M',
      a_acces: true,
    });

    render(<PatientsPage />);

    await waitFor(() => {
      expect(screen.getByText('Armand Codjo')).toBeInTheDocument();
    });

    const openBtn = screen.getByRole('button', { name: /ouvrir un dossier/i });
    fireEvent.click(openBtn);

    const input = screen.getByPlaceholderText(/Ex: \+229 97 00 00 01 ou 1234 5678 90/i);
    fireEvent.change(input, { target: { value: '97001122' } });

    const searchBtn = screen.getByRole('button', { name: /rechercher le dossier/i });
    fireEvent.click(searchBtn);

    await waitFor(() => {
      expect(api.patients.recherche).toHaveBeenCalledWith({ telephone: '97001122' });
      expect(screen.getByText(/autorisation accordée/i)).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: /Eric Dossou/i })).toBeInTheDocument();
    });

    const goBtn = screen.getByRole('button', { name: /aller au dossier médical/i });
    fireEvent.click(goBtn);

    expect(mockPush).toHaveBeenCalledWith('/dossiers-medicaux/pat-global-1');
  });

  it('utilise api.patients.recherche et déclenche la demande d’accès si a_acces est faux (nouveau patient)', async () => {
    (api.patients.recherche as any).mockResolvedValue({
      id: 'pat-nouveau-2',
      nom: 'Houenou',
      prenom: 'Sena',
      date_naissance: '1995-10-10',
      sexe: 'F',
      a_acces: false,
    });

    render(<PatientsPage />);

    await waitFor(() => {
      expect(screen.getByText('Armand Codjo')).toBeInTheDocument();
    });

    const openBtn = screen.getByRole('button', { name: /ouvrir un dossier/i });
    fireEvent.click(openBtn);

    const input = screen.getByPlaceholderText(/Ex: \+229 97 00 00 01 ou 1234 5678 90/i);
    fireEvent.change(input, { target: { value: '1234567890' } }); // NPI 10 chiffres

    const searchBtn = screen.getByRole('button', { name: /rechercher le dossier/i });
    fireEvent.click(searchBtn);

    await waitFor(() => {
      expect(api.patients.recherche).toHaveBeenCalledWith({ npi: '1234567890' });
      expect(api.acces.create).toHaveBeenCalledWith(
        expect.objectContaining({
          patient_id: 'pat-nouveau-2',
          etablissement_id: 'etab-1',
        })
      );
      expect(screen.getByText(/en attente d'autorisation du patient/i)).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: /Sena Houenou/i })).toBeInTheDocument();
    });
  });

  it('permet de basculer sur l’onglet empreinte digitale et de lancer la numérisation', async () => {
    (api.biometrie.identifier as any).mockResolvedValue({
      patient_id: 'pat-2',
      score: 95,
    });

    render(<PatientsPage />);

    await waitFor(() => {
      expect(screen.getByText('Armand Codjo')).toBeInTheDocument();
    });

    const openBtn = screen.getByRole('button', { name: /ouvrir un dossier/i });
    fireEvent.click(openBtn);

    const tabFingerprint = screen.getByRole('button', { name: /empreinte digitale/i });
    fireEvent.click(tabFingerprint);

    expect(screen.getByText(/posez le doigt du patient sur le lecteur/i)).toBeInTheDocument();

    const scanBtn = screen.getByRole('button', { name: /lancer la numérisation/i });
    fireEvent.click(scanBtn);

    await waitFor(() => {
      expect(api.biometrie.identifier).toHaveBeenCalled();
      expect(screen.getByText(/autorisation accordée/i)).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: /Marcelle Lawson/i })).toBeInTheDocument();
    });
  });

  it('affiche un message explicatif et un bouton de repli vers Téléphone/NPI si Aratek renvoie 501', async () => {
    (api.biometrie.identifier as any).mockRejectedValue(new Error('501: Not implemented'));

    render(<PatientsPage />);

    const openBtn = screen.getByRole('button', { name: /ouvrir un dossier/i });
    fireEvent.click(openBtn);

    const tabFingerprint = screen.getByRole('button', { name: /empreinte digitale/i });
    fireEvent.click(tabFingerprint);

    const scanBtn = screen.getByRole('button', { name: /lancer la numérisation/i });
    fireEvent.click(scanBtn);

    await waitFor(() => {
      expect(screen.getByText(/Le moteur biométrique Aratek n’est pas encore branché/i)).toBeInTheDocument();
    });

    const fallbackBtn = screen.getByRole('button', { name: /utiliser la recherche téléphone \/ npi/i });
    fireEvent.click(fallbackBtn);

    expect(screen.getByPlaceholderText(/Ex: \+229 97 00 00 01 ou 1234 5678 90/i)).toBeInTheDocument();
  });

  it('affiche les colonnes essentielles du tableau', async () => {
    render(<PatientsPage />);

    await waitFor(() => {
      expect(screen.getByRole('columnheader', { name: /patient/i })).toBeInTheDocument();
    });
    expect(screen.getByRole('columnheader', { name: /âge & genre/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /groupe sanguin/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /alertes médicales/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /dernière visite/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /action/i })).toBeInTheDocument();
  });

  it('exclut de la liste les patients de la base nationale qui n’ont ni consultation ni accès approuvé pour l’établissement', async () => {
    const patientSansAcces = {
      id: 'pat-inconnu',
      utilisateur_id: 'u-99',
      nom: 'Dossou',
      prenom: 'Jean',
      date_naissance: '1990-01-01',
      sexe: 'M' as const,
      adresse: 'Cotonou',
      groupe_sanguin: 'O+' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    (api.patients.list as any).mockResolvedValue([...mockPatients, patientSansAcces]);

    render(<PatientsPage />);

    await waitFor(() => {
      expect(screen.getByText('Armand Codjo')).toBeInTheDocument();
    });

    // Armand Codjo et Marcelle Lawson sont présents car autorisés
    expect(screen.getByText('Armand Codjo')).toBeInTheDocument();
    expect(screen.getByText('Marcelle Lawson')).toBeInTheDocument();

    // Jean Dossou ne doit PAS être visible car sans consultation ni accès dans cet établissement
    expect(screen.queryByText('Jean Dossou')).not.toBeInTheDocument();
  });

  it('affiche l’état "patient sans dossier médical" si la recherche ne trouve aucun patient', async () => {
    (api.patients.recherche as any).mockRejectedValue(new Error('404: Not found'));
    (api.patients.list as any).mockImplementation((params?: any) => {
      if (params && (params.telephone || params.npi || params.nom)) {
        return Promise.resolve([]);
      }
      return Promise.resolve(mockPatients);
    });

    render(<PatientsPage />);

    await waitFor(() => {
      expect(screen.getByText('Armand Codjo')).toBeInTheDocument();
    });

    const openBtn = screen.getByRole('button', { name: /ouvrir un dossier/i });
    fireEvent.click(openBtn);

    const input = screen.getByPlaceholderText(/Ex: \+229 97 00 00 01 ou 1234 5678 90/i);
    fireEvent.change(input, { target: { value: '97999999' } });

    const searchBtn = screen.getByRole('button', { name: /rechercher le dossier/i });
    fireEvent.click(searchBtn);

    await waitFor(() => {
      expect(screen.getByText(/Le patient n'a pas de dossier médical/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /créer le patient et son dossier/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /réessayer une recherche/i })).toBeInTheDocument();
    });

    // Clic sur "Réessayer une recherche" ramène au formulaire de recherche
    const retryBtn = screen.getByRole('button', { name: /réessayer une recherche/i });
    fireEvent.click(retryBtn);

    expect(screen.getByPlaceholderText(/Ex: \+229 97 00 00 01 ou 1234 5678 90/i)).toBeInTheDocument();
  });

  it('permet de créer directement le patient et son dossier sans attente d’autorisation mobile', async () => {
    (api.patients.recherche as any).mockRejectedValue(new Error('404: Not found'));
    (api.patients.list as any).mockImplementation((params?: any) => {
      if (params && (params.telephone || params.npi || params.nom)) {
        return Promise.resolve([]);
      }
      return Promise.resolve(mockPatients);
    });

    const nouveauPatientCree = {
      id: 'pat-nouveau-99',
      utilisateur_id: 'u-nouveau-99',
      nom: 'Soglo',
      prenom: 'Gérard',
      date_naissance: '1985-06-15',
      sexe: 'M' as const,
      adresse: 'Cotonou, Cadjehoun',
      groupe_sanguin: 'O+' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    (api.patients.create as any).mockResolvedValue(nouveauPatientCree);

    render(<PatientsPage />);

    await waitFor(() => {
      expect(screen.getByText('Armand Codjo')).toBeInTheDocument();
    });

    const openBtn = screen.getByRole('button', { name: /ouvrir un dossier/i });
    fireEvent.click(openBtn);

    const input = screen.getByPlaceholderText(/Ex: \+229 97 00 00 01 ou 1234 5678 90/i);
    fireEvent.change(input, { target: { value: '97888888' } });

    const searchBtn = screen.getByRole('button', { name: /rechercher le dossier/i });
    fireEvent.click(searchBtn);

    await waitFor(() => {
      expect(screen.getByText(/Le patient n'a pas de dossier médical/i)).toBeInTheDocument();
    });

    const createBtn = screen.getByRole('button', { name: /créer le patient et son dossier/i });
    fireEvent.click(createBtn);

    // Vérifier l'apparition du formulaire de création et le pré-remplissage du téléphone
    expect(screen.getByRole('heading', { level: 2, name: /créer un dossier patient/i })).toBeInTheDocument();
    const telInput = screen.getByDisplayValue('+22997888888');
    expect(telInput).toBeInTheDocument();

    // Remplir les champs du formulaire
    const nomInput = screen.getByPlaceholderText(/Ex: Dossou/i);
    const prenomInput = screen.getByPlaceholderText(/Ex: Jean/i);
    fireEvent.change(nomInput, { target: { value: 'Soglo' } });
    fireEvent.change(prenomInput, { target: { value: 'Gérard' } });

    // Date de naissance
    const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: '1985-06-15' } });

    // Soumettre le formulaire
    const submitBtn = screen.getByRole('button', { name: /créer et ouvrir le dossier/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(api.patients.create).toHaveBeenCalledWith(
        expect.objectContaining({
          nom: 'Soglo',
          prenom: 'Gérard',
          date_naissance: '1985-06-15',
          sexe: 'M',
          telephone: '+22997888888',
        })
      );
      expect(mockPush).toHaveBeenCalledWith('/dossiers-medicaux/pat-nouveau-99');
    });
  });
});
