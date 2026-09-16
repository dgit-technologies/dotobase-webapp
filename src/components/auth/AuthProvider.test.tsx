import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthProvider from '@/components/auth/AuthProvider';
import { useAuth, nomAffiche } from '@/lib/hooks/use-auth';
import { clearSession } from '@/lib/api/token';
import { SESSION_HINT_COOKIE } from '@/lib/api/config';
import {
  mockEtablissement,
  mockFetchRoutes,
  mockMedecin,
} from '@/test/helpers/mock-api';

// vi.mock est hoisté au-dessus des imports : la fabrique doit passer par
// vi.hoisted pour que `replace` existe au moment où elle est évaluée.
const { replace } = vi.hoisted(() => ({ replace: vi.fn() }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace, push: vi.fn() }),
}));

const ROUTES_SESSION = {
  'POST /v1/auth/refresh': { access_token: 'access-token' },
  'POST /v1/auth/login': { access_token: 'access-token' },
  'GET /v1/auth/me': mockMedecin,
  'GET /v1/medecin-etablissements': [
    {
      id: 'affectation-uuid',
      medecin_id: mockMedecin.id,
      etablissement_id: mockEtablissement.id,
      role: 'medecin',
      est_principal: true,
      created_at: '2026-01-01T00:00:00.000Z',
    },
  ],
  [`GET /v1/etablissements/${mockEtablissement.id}`]: mockEtablissement,
};

function Consommateur() {
  const {
    user,
    etablissementActif,
    changerEtablissementActif,
    isLoading,
    isAuthenticated,
    login,
    signOut,
  } = useAuth();

  if (isLoading) return <p>Chargement…</p>;

  return (
    <div>
      <p>{isAuthenticated ? nomAffiche(user) : 'Déconnecté'}</p>
      <p>{etablissementActif?.nom ?? 'Aucun établissement'}</p>
      <button
        onClick={() =>
          changerEtablissementActif({
            id: 'etab-autre',
            nom: 'Clinique Bon Secours',
            type: 'clinique',
            adresse: 'Cotonou',
            ville: 'Cotonou',
            pays: 'Bénin',
            statut: 'actif',
            created_at: '2026-01-01',
            updated_at: '2026-01-01',
          })
        }
      >
        Changer établissement
      </button>
      <button
        onClick={() =>
          void login({ telephone: '+2290161000000', password: 'Admin@1234' })
        }
      >
        Se connecter
      </button>
      <button onClick={signOut}>Se déconnecter</button>
    </div>
  );
}

function afficher() {
  return render(
    <AuthProvider>
      <Consommateur />
    </AuthProvider>
  );
}

describe('AuthProvider', () => {
  beforeEach(() => {
    clearSession();
    replace.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('restaure la session au démarrage quand le cookie témoin est présent', async () => {
    document.cookie = `${SESSION_HINT_COOKIE}=1; path=/`;
    const fetchMock = mockFetchRoutes(ROUTES_SESSION);

    afficher();

    expect(await screen.findByText('Dr. Jean Hounkpatin')).toBeInTheDocument();
    expect(screen.getByText('Hôpital Central de Cotonou')).toBeInTheDocument();

    const routesAppelees = fetchMock.mock.calls.map(([url]) =>
      new URL(String(url)).pathname
    );
    expect(routesAppelees).toContain('/v1/auth/refresh');
    expect(routesAppelees).toContain('/v1/auth/me');
  });

  it('ne contacte pas l’API sans cookie témoin', async () => {
    const fetchMock = mockFetchRoutes(ROUTES_SESSION);

    afficher();

    expect(await screen.findByText('Déconnecté')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('charge le profil après un login réussi', async () => {
    mockFetchRoutes(ROUTES_SESSION);
    afficher();

    await screen.findByText('Déconnecté');
    await userEvent.click(screen.getByRole('button', { name: 'Se connecter' }));

    expect(await screen.findByText('Dr. Jean Hounkpatin')).toBeInTheDocument();
  });

  it('vide la session et renvoie vers /login à la déconnexion', async () => {
    document.cookie = `${SESSION_HINT_COOKIE}=1; path=/`;
    mockFetchRoutes(ROUTES_SESSION);

    afficher();
    await screen.findByText('Dr. Jean Hounkpatin');

    await userEvent.click(screen.getByRole('button', { name: 'Se déconnecter' }));

    await waitFor(() => expect(screen.getByText('Déconnecté')).toBeInTheDocument());
    expect(replace).toHaveBeenCalledWith('/login');
  });

  it('gère correctement une réponse multi-profil Nest pour un compte admin', async () => {
    document.cookie = `${SESSION_HINT_COOKIE}=1; path=/`;
    mockFetchRoutes({
      'POST /v1/auth/refresh': { access_token: 'access-token' },
      'GET /v1/auth/me': {
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
      },
    });

    afficher();

    expect(await screen.findByText('Compte Admin')).toBeInTheDocument();
    expect(screen.getByText('Aucun établissement')).toBeInTheDocument();
  });

  it('restaure la session au démarrage quand le cookie est absent mais que le localStorage contient le témoin valide', async () => {
    // Simule la situation Safari : cookie client supprimé après 7 jours, mais localStorage valide 30 jours
    document.cookie = `${SESSION_HINT_COOKIE}=; path=/; max-age=0`;
    localStorage.setItem(SESSION_HINT_COOKIE, '1');
    localStorage.setItem('dotobase_session_expires', String(Date.now() + 20 * 24 * 3600 * 1000));

    const fetchMock = mockFetchRoutes(ROUTES_SESSION);

    afficher();

    expect(await screen.findByText('Dr. Jean Hounkpatin')).toBeInTheDocument();
    expect(document.cookie).toContain(`${SESSION_HINT_COOKIE}=1`);

    const routesAppelees = fetchMock.mock.calls.map(([url]) =>
      new URL(String(url)).pathname
    );
    expect(routesAppelees).toContain('/v1/auth/refresh');
  });

  it('déclenche un refresh silencieux lors de la reprise de focus / visibilité de l’onglet', async () => {
    document.cookie = `${SESSION_HINT_COOKIE}=1; path=/`;
    const fetchMock = mockFetchRoutes(ROUTES_SESSION);

    afficher();
    await screen.findByText('Dr. Jean Hounkpatin');

    const refreshCallsBefore = fetchMock.mock.calls.filter(([url]) =>
      new URL(String(url)).pathname === '/v1/auth/refresh'
    ).length;

    // Simulation du retour de visibilité de l'onglet
    Object.defineProperty(document, 'visibilityState', {
      value: 'visible',
      configurable: true,
    });
    document.dispatchEvent(new Event('visibilitychange'));

    await waitFor(() => {
      const refreshCallsAfter = fetchMock.mock.calls.filter(([url]) =>
        new URL(String(url)).pathname === '/v1/auth/refresh'
      ).length;
      expect(refreshCallsAfter).toBeGreaterThan(refreshCallsBefore);
    });
  });

  it('permet au praticien de basculer d’un établissement à un autre via changerEtablissementActif', async () => {
    document.cookie = `${SESSION_HINT_COOKIE}=1; path=/`;
    mockFetchRoutes(ROUTES_SESSION);

    afficher();

    expect(await screen.findByText('Hôpital Central de Cotonou')).toBeInTheDocument();

    const btnChanger = screen.getByRole('button', { name: 'Changer établissement' });
    await userEvent.click(btnChanger);

    expect(screen.getByText('Clinique Bon Secours')).toBeInTheDocument();
    expect(localStorage.getItem('dotobase_etablissement_actif_id')).toBe('etab-autre');
  });
});
