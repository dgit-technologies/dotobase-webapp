import { vi } from 'vitest';
import type { AuthContextValue } from '@/components/auth/AuthProvider';
import { mockEtablissement, mockMedecin } from '@/test/helpers/mock-api';

export { mockEtablissement, mockMedecin };

/**
 * Valeur de contexte prête à l'emploi pour les composants qui consomment
 * `useAuth()`.
 *
 * Exemple :
 *   vi.mock('@/lib/hooks/use-auth', async (importOriginal) => ({
 *     ...(await importOriginal<object>()),
 *     useAuth: () => mockAuthContext(),
 *   }));
 */
export function mockAuthContext(
  overrides: Partial<AuthContextValue> = {}
): AuthContextValue {
  return {
    user: mockMedecin,
    role: mockMedecin.type,
    specialiteId: 'specialite-uuid',
    etablissementActif: mockEtablissement,
    isLoading: false,
    isAuthenticated: true,
    login: vi.fn().mockResolvedValue(mockMedecin),
    signOut: vi.fn(),
    reload: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}
