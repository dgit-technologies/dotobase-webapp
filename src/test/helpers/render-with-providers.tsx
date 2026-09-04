import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement } from 'react';
import {
  AuthContext,
  type AuthContextValue,
} from '@/components/auth/AuthProvider';

/**
 * Wraps render() with all app-level providers.
 * Add providers here as the app grows (e.g. QueryClient, Theme).
 *
 * AuthProvider est remplacé par un contexte injecté : le vrai provider
 * appelle le backend Nest au montage, ce qu'on ne veut pas dans un test de
 * composant. Passer `authValue` (voir `mockAuthContext()`) pour simuler un
 * utilisateur connecté.
 */
const contexteAnonyme: AuthContextValue = {
  user: null,
  role: null,
  specialiteId: null,
  etablissementActif: null,
  isLoading: false,
  isAuthenticated: false,
  login: () => Promise.reject(new Error('login non mocké')),
  signOut: () => {},
  reload: () => Promise.resolve(),
};

interface Options extends Omit<RenderOptions, 'wrapper'> {
  authValue?: AuthContextValue;
}

function renderWithProviders(ui: ReactElement, options: Options = {}) {
  const { authValue = contexteAnonyme, ...renderOptions } = options;

  function AllProviders({ children }: { children: React.ReactNode }) {
    return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
  }

  return render(ui, { wrapper: AllProviders, ...renderOptions });
}

export { renderWithProviders, contexteAnonyme };
export { screen, fireEvent, waitFor, act } from '@testing-library/react';
