import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import PersonnelPage from './page';

const mockPush = vi.fn();
const mockReplace = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
}));

const mockUseAuth = vi.fn();
vi.mock('@/lib/hooks/use-auth', () => ({
  useAuth: () => mockUseAuth(),
}));

const mockSpecialites = [
  { id: 'spec-1', code: 'CARDIO', nom: 'Cardiologie' },
  { id: 'spec-2', code: 'PED', nom: 'Pédiatrie' },
];

const mockMedecins = [
  {
    id: 'med-1',
    utilisateur_id: 'u-1',
    nom: 'Adanho',
    prenom: 'Boris',
    specialite_id: 'spec-1',
    created_at: '2026-01-01',
    updated_at: '2026-01-01',
  },
];

const mockInfirmiers = [
  {
    id: 'inf-1',
    utilisateur_id: 'u-2',
    nom: 'Zannou',
    prenom: 'Claire',
    service: 'Urgences',
    created_at: '2026-01-01',
    updated_at: '2026-01-01',
  },
];

const mockMedAffectations = [
  {
    id: 'aff-med-1',
    medecin_id: 'med-1',
    etablissement_id: 'etab-1',
    role: 'medecin',
    est_principal: true,
    created_at: '2026-01-01',
  },
];

const mockInfAffectations = [
  {
    id: 'aff-inf-1',
    infirmier_id: 'inf-1',
    etablissement_id: 'etab-1',
    role: 'admin',
    est_principal: false,
    created_at: '2026-01-01',
  },
];

vi.mock('@/lib/api', () => ({
  api: {
    specialites: {
      list: vi.fn(() => Promise.resolve(mockSpecialites)),
    },
    medecins: {
      list: vi.fn(() => Promise.resolve(mockMedecins)),
      create: vi.fn(),
    },
    infirmiers: {
      list: vi.fn(() => Promise.resolve(mockInfirmiers)),
      create: vi.fn(),
    },
    medecinEtablissements: {
      list: vi.fn(() => Promise.resolve(mockMedAffectations)),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    infirmierEtablissements: {
      list: vi.fn(() => Promise.resolve(mockInfAffectations)),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
  toDisplayMessage: (err: any) => err?.message || 'Erreur',
}));

describe('PersonnelPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects unauthorized users (e.g. medecin simple) to /dashboard', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'u-1', prenom: 'Boris', nom: 'Adanho', type: 'medecin' },
      role: 'medecin',
      etablissementActif: { id: 'etab-1', nom: 'Hôpital Central' },
      isLoading: false,
    });

    render(<PersonnelPage />);
    expect(mockReplace).toHaveBeenCalledWith('/dashboard');
  });

  it('renders correctly for hospital admin and loads staff members', async () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'u-admin', prenom: 'Admin', nom: 'Principal', type: 'admin' },
      role: 'admin',
      etablissementActif: { id: 'etab-1', nom: 'Hôpital Central' },
      isLoading: false,
    });

    render(<PersonnelPage />);

    expect(screen.getByText('Gestion du personnel')).toBeInTheDocument();
    expect(screen.getByText('Hôpital Central')).toBeInTheDocument();

    await waitFor(() => {
      // Vérifie l'affichage des 2 membres
      expect(screen.getByText(/Dr\. Boris Adanho/i)).toBeInTheDocument();
      expect(screen.getByText(/Claire Zannou/i)).toBeInTheDocument();
      expect(screen.getByText('Cardiologie')).toBeInTheDocument();
      expect(screen.getByText('Urgences')).toBeInTheDocument();
    });

    // KPI total
    expect(screen.getByText('Total Personnel')).toBeInTheDocument();
  });

  it('filters staff list when searching', async () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'u-admin', prenom: 'Admin', nom: 'Principal', type: 'admin' },
      role: 'admin',
      etablissementActif: { id: 'etab-1', nom: 'Hôpital Central' },
      isLoading: false,
    });

    render(<PersonnelPage />);

    await waitFor(() => {
      expect(screen.getByText(/Dr\. Boris Adanho/i)).toBeInTheDocument();
      expect(screen.getByText(/Claire Zannou/i)).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Rechercher par nom/i);
    fireEvent.change(searchInput, { target: { value: 'Zannou' } });

    expect(screen.queryByText(/Dr\. Boris Adanho/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Claire Zannou/i)).toBeInTheDocument();
  });

  it('opens add modal when clicking "Ajouter un collaborateur"', async () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'u-admin', prenom: 'Admin', nom: 'Principal', type: 'admin' },
      role: 'admin',
      etablissementActif: { id: 'etab-1', nom: 'Hôpital Central' },
      isLoading: false,
    });

    render(<PersonnelPage />);

    const addButton = screen.getByRole('button', { name: /Ajouter un collaborateur/i });
    fireEvent.click(addButton);

    expect(screen.getByText('Ajouter un membre du personnel')).toBeInTheDocument();
    expect(screen.getByLabelText(/^Prénom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Nom/i)).toBeInTheDocument();
  });

  it('allows access to a doctor who has local hospital admin rights (isEtablissementAdmin: true)', async () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'u-1', prenom: 'Boris', nom: 'Adanho', type: 'medecin' },
      role: 'medecin',
      isEtablissementAdmin: true,
      etablissementActif: { id: 'etab-1', nom: 'Hôpital Central' },
      isLoading: false,
    });

    render(<PersonnelPage />);

    expect(screen.getByText('Gestion du personnel')).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('filters staff by profession when clicking filter buttons', async () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'u-admin', prenom: 'Admin', nom: 'Principal', type: 'admin' },
      role: 'admin',
      isEtablissementAdmin: true,
      etablissementActif: { id: 'etab-1', nom: 'Hôpital Central' },
      isLoading: false,
    });

    render(<PersonnelPage />);

    await waitFor(() => {
      expect(screen.getByText(/Dr\. Boris Adanho/i)).toBeInTheDocument();
      expect(screen.getByText(/Claire Zannou/i)).toBeInTheDocument();
    });

    // Filtre sur "Médecins"
    fireEvent.click(screen.getByRole('button', { name: /^Médecins$/i }));
    expect(screen.getByText(/Dr\. Boris Adanho/i)).toBeInTheDocument();
    expect(screen.queryByText(/Claire Zannou/i)).not.toBeInTheDocument();

    // Filtre sur "Infirmiers"
    fireEvent.click(screen.getByRole('button', { name: /^Infirmiers$/i }));
    expect(screen.queryByText(/Dr\. Boris Adanho/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Claire Zannou/i)).toBeInTheDocument();
  });

  it('opens edit modal when clicking "Gérer"', async () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'u-admin', prenom: 'Admin', nom: 'Principal', type: 'admin' },
      role: 'admin',
      isEtablissementAdmin: true,
      etablissementActif: { id: 'etab-1', nom: 'Hôpital Central' },
      isLoading: false,
    });

    render(<PersonnelPage />);

    await waitFor(() => {
      expect(screen.getByText(/Dr\. Boris Adanho/i)).toBeInTheDocument();
    });

    const gererButtons = screen.getAllByRole('button', { name: /Gérer/i });
    fireEvent.click(gererButtons[0]);

    expect(screen.getByText(/Gérer le membre du personnel/i)).toBeInTheDocument();
  });
});
