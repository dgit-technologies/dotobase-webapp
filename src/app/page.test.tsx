import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AuthContext } from '@/components/auth/AuthProvider';
import { mockAuthContext } from '@/test/helpers/mock-auth';
import LandingPage from './page';

describe('LandingPage Dotobase (Revamped)', () => {
  it('renders navigation bar with brand, anchor links and action buttons', () => {
    render(<LandingPage />);

    expect(screen.getAllByText(/Dotobase/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('link', { name: /Avantages patients/i })).toHaveAttribute('href', '#avantages');
    expect(screen.getByRole('link', { name: /Pourquoi Dotobase \?/i })).toHaveAttribute('href', '#pourquoi');
    expect(screen.getByRole('link', { name: /Pour les cliniques/i })).toHaveAttribute('href', '#cliniques');
    expect(screen.getByRole('link', { name: /Partenaires/i })).toHaveAttribute('href', '#partenaires');

    expect(screen.getByRole('link', { name: /Se connecter/i })).toHaveAttribute('href', '/login');
    expect(screen.getAllByRole('button', { name: /Demander une démo/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole('link', { name: /Inscrire mon hôpital/i }).length).toBeGreaterThanOrEqual(1);
  });

  it('renders "Mon Espace" pointing to /dashboard when user is authenticated', () => {
    const mockAuthValue = mockAuthContext({
      isAuthenticated: true,
      isLoading: false,
    });

    render(
      <AuthContext.Provider value={mockAuthValue}>
        <LandingPage />
      </AuthContext.Provider>
    );

    expect(screen.getAllByRole('link', { name: /Mon Espace/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole('link', { name: /Mon Espace/i })[0]).toHaveAttribute('href', '/dashboard');
  });

  it('renders Hero section with exact requested title', () => {
    render(<LandingPage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Connecter pour mieux soigner/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /Découvrir pour les patients/i })).toHaveAttribute(
      'href',
      '#avantages'
    );
    expect(screen.getAllByRole('link', { name: /Inscrire mon hôpital/i }).length).toBeGreaterThanOrEqual(1);
  });

  it('renders the Apple-style patient advantage cards', () => {
    render(<LandingPage />);

    expect(screen.getByText(/On sait qui vous êtes\./i)).toBeInTheDocument();
    expect(screen.getByText(/Vos antécédents connus avant l'examen\./i)).toBeInTheDocument();
    expect(screen.getByText(/Tout votre suivi est enregistré\./i)).toBeInTheDocument();
    expect(screen.getByText(/Vous pouvez aller dans n'importe quel hôpital\./i)).toBeInTheDocument();
    expect(screen.getByText(/Vos données sont privées\./i)).toBeInTheDocument();
  });

  it('renders app store and google play install buttons', () => {
    render(<LandingPage />);

    expect(screen.getByText(/App Store/i)).toBeInTheDocument();
    expect(screen.getByText(/Google Play/i)).toBeInTheDocument();
  });

  it('renders the "Pourquoi Dotobase ?" section with real-world problems', () => {
    render(<LandingPage />);

    expect(screen.getByText(/Pourquoi Dotobase est devenu indispensable \?/i)).toBeInTheDocument();
    expect(screen.getByText(/La plupart des traitements sont inadaptés/i)).toBeInTheDocument();
    expect(screen.getByText(/Obligé de partager sur WhatsApp pour s'y retrouver/i)).toBeInTheDocument();
    expect(screen.getByText(/Chaque minute perdue pèse sur le pronostic/i)).toBeInTheDocument();
  });

  it('renders "Ils nous font confiance" with ACPB, Clinique Ste Famille, Clinique Mélodie', () => {
    render(<LandingPage />);

    expect(screen.getByText(/Ils nous font confiance/i)).toBeInTheDocument();
    expect(screen.getAllByText(/ACPB/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Clinique Ste Famille/i)).toBeInTheDocument();
    expect(screen.getByText(/Clinique Mélodie/i)).toBeInTheDocument();
  });

  it('opens and closes the demo modal', () => {
    render(<LandingPage />);

    const demoBtns = screen.getAllByRole('button', { name: /Demander une démo/i });
    fireEvent.click(demoBtns[0]);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/Demander une démo Dotobase/i)).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /Fermer/i });
    fireEvent.click(closeBtn);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('has links pointing to dedicated hospital registration page /inscrire-hopital', () => {
    render(<LandingPage />);

    const inscrireLinks = screen.getAllByRole('link', { name: /Inscrire mon hôpital/i });
    expect(inscrireLinks.length).toBeGreaterThanOrEqual(1);
    inscrireLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/inscrire-hopital');
    });
  });
});
