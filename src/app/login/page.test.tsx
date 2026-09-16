import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import LoginPage from './page';

const mockPush = vi.fn();
const mockReplace = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
}));

const mockLogin = vi.fn();
let mockAuthState = {
  isAuthenticated: false,
  isLoading: false,
  login: mockLogin,
};

vi.mock('@/lib/hooks/use-auth', () => ({
  useAuth: () => mockAuthState,
}));

vi.mock('@/components/ui/toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthState = {
      isAuthenticated: false,
      isLoading: false,
      login: mockLogin,
    };
  });

  it('redirection automatique vers /dashboard si l’utilisateur est déjà connecté', () => {
    mockAuthState = {
      isAuthenticated: true,
      isLoading: false,
      login: mockLogin,
    };

    render(<LoginPage />);

    // Doit appeler router.replace('/dashboard')
    expect(mockReplace).toHaveBeenCalledWith('/dashboard');
    // Le formulaire de connexion ne doit pas être affiché
    expect(screen.queryByRole('heading', { name: /Connexion Médecin/i })).not.toBeInTheDocument();
  });

  it('affiche un spinner et ne montre pas le formulaire tant que l’état d’auth est en chargement', () => {
    mockAuthState = {
      isAuthenticated: false,
      isLoading: true,
      login: mockLogin,
    };

    render(<LoginPage />);

    // Ne doit pas rediriger pendant le chargement
    expect(mockReplace).not.toHaveBeenCalled();
    // Le formulaire ne doit pas être affiché
    expect(screen.queryByRole('heading', { name: /Connexion Médecin/i })).not.toBeInTheDocument();
    // Le spinner doit être visible
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('affiche le formulaire de connexion lorsque l’utilisateur n’est pas connecté', () => {
    render(<LoginPage />);

    expect(mockReplace).not.toHaveBeenCalled();
    expect(screen.getByRole('heading', { name: /Connexion Médecin/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Téléphone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Se connecter/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Inscrire mon hôpital/i })).toHaveAttribute('href', '/inscrire-hopital');
  });

  it('affiche une erreur de validation pour un numéro ou mot de passe invalide', async () => {
    render(<LoginPage />);

    const submitBtn = screen.getByRole('button', { name: /Se connecter/i });

    // Remplissage avec des données invalides
    const telInput = screen.getByLabelText(/Téléphone/i);
    const pwdInput = screen.getByLabelText(/Mot de passe/i);

    fireEvent.change(telInput, { target: { value: '123' } });
    fireEvent.change(pwdInput, { target: { value: 'ab' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockLogin).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it('connecte l’utilisateur et redirige vers /dashboard lors d’une soumission valide', async () => {
    mockLogin.mockResolvedValueOnce({
      id: 'med-1',
      type: 'medecin',
      nom: 'Tidjani',
      prenom: 'Adam',
    });

    render(<LoginPage />);

    const telInput = screen.getByLabelText(/Téléphone/i);
    const pwdInput = screen.getByLabelText(/Mot de passe/i);
    const submitBtn = screen.getByRole('button', { name: /Se connecter/i });

    fireEvent.change(telInput, { target: { value: '+22997000000' } });
    fireEvent.change(pwdInput, { target: { value: 'MotDePasse123!' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        telephone: '+22997000000',
        password: 'MotDePasse123!',
      });
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('affiche un message d’erreur en cas d’échec API lors de la connexion', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Identifiants invalides'));

    render(<LoginPage />);

    const telInput = screen.getByLabelText(/Téléphone/i);
    const pwdInput = screen.getByLabelText(/Mot de passe/i);
    const submitBtn = screen.getByRole('button', { name: /Se connecter/i });

    fireEvent.change(telInput, { target: { value: '+22997000000' } });
    fireEvent.change(pwdInput, { target: { value: 'MotDePasse123!' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      expect(screen.getByText(/Identifiants invalides/i)).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
