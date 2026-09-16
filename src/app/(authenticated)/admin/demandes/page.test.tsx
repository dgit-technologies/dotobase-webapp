import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import AdminDemandesPage from './page';
import { etablissements } from '@/lib/api/referentiels';
import type { Etablissement } from '@/lib/api/types';

const mockPush = vi.fn();
const mockReplace = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
}));

let mockUserRole: string | null = 'admin';

vi.mock('@/lib/hooks/use-auth', () => ({
  useAuth: () => ({
    user: { id: 'admin-1', nom: 'Super', prenom: 'Admin' },
    role: mockUserRole,
    isLoading: false,
  }),
}));

vi.mock('@/components/ui/toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

const mockDemandes: Etablissement[] = [
  {
    id: 'etab-1',
    nom: 'Clinique Bon Secours',
    type: 'clinique',
    ville: 'Cotonou',
    adresse: 'Rue 123 (Référent: Dr. Houessou, Directeur - Tél: +22901010101 - Email: dir@bonsecours.bj)',
    telephone: '+22901010101',
    email: 'contact@bonsecours.bj',
    nom_representant: 'Houessou',
    prenom_representant: 'Paul',
    fonction_representant: 'Directeur',
    telephone_representant: '+22901010101',
    email_representant: 'dir@bonsecours.bj',
    statut: 'en_attente',
    motif_refus: null,
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-03-01T10:00:00Z',
  },
  {
    id: 'etab-2',
    nom: 'Hôpital de la Paix',
    type: 'hopital',
    ville: 'Parakou',
    adresse: 'Avenue de la Paix',
    telephone: '+22901020202',
    email: 'info@paix.bj',
    statut: 'en_attente',
    motif_refus: null,
    created_at: '2026-02-15T08:00:00Z',
    updated_at: '2026-02-15T08:00:00Z',
  },
];

describe('AdminDemandesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUserRole = 'admin';
    vi.spyOn(etablissements, 'list').mockResolvedValue([...mockDemandes]);
    vi.spyOn(etablissements, 'refuser').mockResolvedValue({
      ...mockDemandes[0],
      statut: 'refuse',
    });
    vi.spyOn(etablissements, 'approuver').mockResolvedValue({
      ...mockDemandes[0],
      statut: 'valide',
    });
    vi.spyOn(etablissements, 'create').mockImplementation(async (payload) => ({
      id: 'etab-new-1234',
      nom: payload.nom,
      type: payload.type,
      ville: payload.ville,
      adresse: payload.adresse || null,
      telephone: payload.telephone || null,
      email: payload.email || null,
      nom_representant: payload.nom_representant || null,
      prenom_representant: payload.prenom_representant || null,
      fonction_representant: payload.fonction_representant || null,
      telephone_representant: payload.telephone_representant || null,
      email_representant: payload.email_representant || null,
      statut: 'valide',
      motif_refus: null,
      created_at: '2026-09-11T12:00:00Z',
      updated_at: '2026-09-11T12:00:00Z',
    }));
  });

  it('affiche le titre Hôpitaux et le tableau avec ses colonnes', async () => {
    render(<AdminDemandesPage />);

    expect(
      screen.getByRole('heading', { name: /^Hôpitaux$/i })
    ).toBeInTheDocument();

    // Le bouton actualiser a été retiré
    expect(screen.queryByText(/Actualiser/i)).not.toBeInTheDocument();

    // Le bouton ajouter un hôpital est présent
    expect(
      screen.getByRole('button', { name: /Ajouter un hôpital/i })
    ).toBeInTheDocument();

    // Les colonnes du tableau sont bien rendues
    await waitFor(() => {
      expect(screen.getByText('RÉFÉRENCE')).toBeInTheDocument();
      expect(screen.getByText('ÉTABLISSEMENT / VILLE')).toBeInTheDocument();
      expect(screen.getByText('COORDONNÉES')).toBeInTheDocument();
      expect(screen.getByText('RÉFÉRENT')).toBeInTheDocument();
      expect(screen.getByText('STATUT')).toBeInTheDocument();
      expect(screen.getByText("DATE D'ADHÉSION")).toBeInTheDocument();
      expect(screen.getByText('Clinique Bon Secours')).toBeInTheDocument();
      expect(screen.getByText('Hôpital de la Paix')).toBeInTheDocument();
    });
  });

  it('ouvre la modale d ajout d hôpital et permet la création via etablissements.create', async () => {
    render(<AdminDemandesPage />);

    const ajouterBtn = screen.getByRole('button', { name: /Ajouter un hôpital/i });
    fireEvent.click(ajouterBtn);

    // La modale doit être ouverte
    expect(
      screen.getByRole('heading', { name: /Ajouter un hôpital/i })
    ).toBeInTheDocument();

    // Remplissage du formulaire
    const nomInput = screen.getByPlaceholderText(/Centre Hospitalier Universitaire/i);
    const villeInput = screen.getByPlaceholderText(/Cotonou, Porto-Novo/i);

    fireEvent.change(nomInput, { target: { value: 'CHU Hubert Maga' } });
    fireEvent.change(villeInput, { target: { value: 'Cotonou' } });

    const submitBtn = screen.getByRole('button', { name: /Ajouter l'établissement/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(etablissements.create).toHaveBeenCalledWith(
        expect.objectContaining({
          nom: 'CHU Hubert Maga',
          ville: 'Cotonou',
          type: 'hopital',
        })
      );
    });
  });

  it('ouvre la modale de refus, transmet le motif à etablissements.refuser et met à jour le statut', async () => {
    render(<AdminDemandesPage />);

    await waitFor(() => {
      expect(screen.getByText('Clinique Bon Secours')).toBeInTheDocument();
    });

    const refuserButtons = screen.getAllByRole('button', { name: /Refuser/i });
    fireEvent.click(refuserButtons[0]);

    // Modale ouverte
    expect(
      screen.getByRole('heading', { name: /Refuser la demande d'adhésion/i })
    ).toBeInTheDocument();

    // Saisie du motif
    const textarea = screen.getByPlaceholderText(/Pièces justificatives incomplètes/i);
    fireEvent.change(textarea, {
      target: { value: 'Documents d enregistrement non fournis' },
    });

    // Confirmation
    const confirmButton = screen.getByRole('button', { name: /Confirmer le refus/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(etablissements.refuser).toHaveBeenCalledWith('etab-1', {
        motif: 'Documents d enregistrement non fournis',
      });
    });

    // Filtre sur les refusés pour voir le statut mis à jour
    const refuseTab = screen.getByRole('button', { name: /Refusés/i });
    fireEvent.click(refuseTab);

    await waitFor(() => {
      expect(screen.getByText('Refusé')).toBeInTheDocument();
      expect(screen.getByText('Documents d enregistrement non fournis')).toBeInTheDocument();
    });
  });

  it('appelle etablissements.refuser avec un objet vide si le motif n est pas renseigné', async () => {
    render(<AdminDemandesPage />);

    await waitFor(() => {
      expect(screen.getByText('Clinique Bon Secours')).toBeInTheDocument();
    });

    const refuserButtons = screen.getAllByRole('button', { name: /Refuser/i });
    fireEvent.click(refuserButtons[0]);

    const confirmButton = screen.getByRole('button', { name: /Confirmer le refus/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(etablissements.refuser).toHaveBeenCalledWith('etab-1', {});
    });
  });

  it('ouvre la modale d acceptation et appelle etablissements.approuver', async () => {
    render(<AdminDemandesPage />);

    await waitFor(() => {
      expect(screen.getByText('Clinique Bon Secours')).toBeInTheDocument();
    });

    const acceptButton = screen.getAllByRole('button', { name: /Accepter/i })[0];
    fireEvent.click(acceptButton);

    expect(
      screen.getByRole('heading', { name: /Accepter la demande d'adhésion/i })
    ).toBeInTheDocument();

    const confirmAccept = screen.getByRole('button', { name: /Confirmer l'acceptation/i });
    fireEvent.click(confirmAccept);

    await waitFor(() => {
      expect(etablissements.approuver).toHaveBeenCalledWith('etab-1');
    });
  });

  it('redirige vers /dashboard si l utilisateur n est pas admin', async () => {
    mockUserRole = 'medecin';
    render(<AdminDemandesPage />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/dashboard');
    });
  });
});
