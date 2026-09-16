import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import InscrireHopitalPage from './page';

describe('InscrireHopitalPage (Informations nécessaires établissement)', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
  });

  it('renders header, title and the required hospital & representative fields', () => {
    render(<InscrireHopitalPage />);

    expect(
      screen.getByRole('heading', { level: 1, name: /Inscrire mon hôpital/i })
    ).toBeInTheDocument();

    // Champs établissement
    expect(screen.getByLabelText(/Nom de l'établissement/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Type de structure/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ville/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Adresse ou quartier physique/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Téléphone de l'établissement/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email officiel de l'établissement/i)).toBeInTheDocument();

    // Champs représentant légal
    expect(screen.getByLabelText(/^Nom du représentant/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Prénom du représentant/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Téléphone direct du représentant/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email professionnel du représentant/i)).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /Inscrire mon hôpital/i })
    ).toBeInTheDocument();
  });

  it('updates form fields on change', () => {
    render(<InscrireHopitalPage />);

    const nomInput = screen.getByLabelText(/Nom de l'établissement/i) as HTMLInputElement;
    fireEvent.change(nomInput, { target: { value: 'Clinique Pasteur' } });
    expect(nomInput.value).toBe('Clinique Pasteur');

    const repNomInput = screen.getByLabelText(/^Nom du représentant/i) as HTMLInputElement;
    fireEvent.change(repNomInput, { target: { value: 'Diallo' } });
    expect(repNomInput.value).toBe('Diallo');
  });

  it('verifies that all fields are marked as required', () => {
    render(<InscrireHopitalPage />);

    expect(screen.getByLabelText(/Nom de l'établissement/i)).toBeRequired();
    expect(screen.getByLabelText(/Type de structure/i)).toBeRequired();
    expect(screen.getByLabelText(/Ville/i)).toBeRequired();
    expect(screen.getByLabelText(/Adresse ou quartier physique/i)).toBeRequired();
    expect(screen.getByLabelText(/Téléphone de l'établissement/i)).toBeRequired();
    expect(screen.getByLabelText(/Email officiel de l'établissement/i)).toBeRequired();
    expect(screen.getByLabelText(/^Nom du représentant/i)).toBeRequired();
    expect(screen.getByLabelText(/Prénom du représentant/i)).toBeRequired();
    expect(screen.getByLabelText(/Téléphone direct du représentant/i)).toBeRequired();
    expect(screen.getByLabelText(/Email professionnel du représentant/i)).toBeRequired();
  });

  it('calls etablissements.demande with complete payload and displays confirmation', async () => {
    const { etablissements } = await import('@/lib/api/referentiels');
    const spy = vi.spyOn(etablissements, 'demande').mockResolvedValueOnce({
      id: 'etab-123',
      nom: 'Clinique Pasteur',
      type: 'clinique',
      ville: 'Cotonou',
      statut: 'en_attente',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      adresse: 'Quartier Haie Vive',
      telephone: '+2290161000000',
      email: 'contact@pasteur.bj',
      nom_representant: 'Diallo',
      prenom_representant: 'Awa',
      telephone_representant: '+2290161000000',
      email_representant: 'awa.diallo@example.com',
    });

    render(<InscrireHopitalPage />);

    // Champs établissement
    fireEvent.change(screen.getByLabelText(/Nom de l'établissement/i), {
      target: { value: 'Clinique Pasteur' },
    });
    fireEvent.change(screen.getByLabelText(/Type de structure/i), {
      target: { value: 'clinique' },
    });
    fireEvent.change(screen.getByLabelText(/Ville/i), {
      target: { value: 'Cotonou' },
    });
    fireEvent.change(screen.getByLabelText(/Adresse ou quartier physique/i), {
      target: { value: 'Quartier Haie Vive' },
    });
    fireEvent.change(screen.getByLabelText(/Téléphone de l'établissement/i), {
      target: { value: '01 61 00 00 00' },
    });
    fireEvent.change(screen.getByLabelText(/Email officiel de l'établissement/i), {
      target: { value: 'contact@pasteur.bj' },
    });

    // Champs représentant
    fireEvent.change(screen.getByLabelText(/^Nom du représentant/i), {
      target: { value: 'Diallo' },
    });
    fireEvent.change(screen.getByLabelText(/Prénom du représentant/i), {
      target: { value: 'Awa' },
    });
    fireEvent.change(screen.getByLabelText(/Téléphone direct du représentant/i), {
      target: { value: '01 61 00 00 00' },
    });
    fireEvent.change(screen.getByLabelText(/Email professionnel du représentant/i), {
      target: { value: 'awa.diallo@example.com' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Inscrire mon hôpital/i }));

    expect(
      await screen.findByText(/Demande d'inscription transmise/i)
    ).toBeInTheDocument();

    expect(spy).toHaveBeenCalledWith({
      nom: 'Clinique Pasteur',
      type: 'clinique',
      ville: 'Cotonou',
      adresse: 'Quartier Haie Vive',
      telephone: '+2290161000000',
      email: 'contact@pasteur.bj',
      nom_representant: 'Diallo',
      prenom_representant: 'Awa',
      telephone_representant: '+2290161000000',
      email_representant: 'awa.diallo@example.com',
    });
  });

  it('turns erroneous inputs red and displays problem messages when submitted empty or invalid', async () => {
    render(<InscrireHopitalPage />);

    // Click submit without filling fields
    fireEvent.click(screen.getByRole('button', { name: /Inscrire mon hôpital/i }));

    // Check that error message appears
    expect(screen.getByText(/Le nom de l'établissement est obligatoire/i)).toBeInTheDocument();
    expect(screen.getByText(/L'adresse ou le quartier est obligatoire/i)).toBeInTheDocument();
    expect(screen.getByText(/Le numéro de téléphone est obligatoire/i)).toBeInTheDocument();
    expect(screen.getByText(/L'email officiel est obligatoire/i)).toBeInTheDocument();
    expect(screen.getByText(/Le nom du représentant est obligatoire/i)).toBeInTheDocument();
    expect(screen.getByText(/Le prénom du représentant est obligatoire/i)).toBeInTheDocument();
    expect(screen.getByText(/Le téléphone direct du représentant est obligatoire/i)).toBeInTheDocument();
    expect(screen.getByText(/L'email professionnel est obligatoire/i)).toBeInTheDocument();

    // Check that the input has red error styling
    const nomInput = screen.getByLabelText(/Nom de l'établissement/i);
    expect(nomInput).toHaveClass('border-rose-400');
    expect(nomInput).toHaveClass('bg-rose-50/50');
    expect(nomInput).toHaveAttribute('aria-invalid', 'true');
  });

  it('clears red error state when user types into an erroneous input', () => {
    render(<InscrireHopitalPage />);

    // Trigger validation errors
    fireEvent.click(screen.getByRole('button', { name: /Inscrire mon hôpital/i }));

    const nomInput = screen.getByLabelText(/Nom de l'établissement/i);
    expect(nomInput).toHaveClass('border-rose-400');
    expect(screen.getByText(/Le nom de l'établissement est obligatoire/i)).toBeInTheDocument();

    // Type a valid value
    fireEvent.change(nomInput, { target: { value: 'Nouvel Hôpital' } });

    // The red class and error message should be removed
    expect(nomInput).not.toHaveClass('border-rose-400');
    expect(screen.queryByText(/Le nom de l'établissement est obligatoire/i)).not.toBeInTheDocument();
  });

  it('marks input as red with backend error message when API rejects a field', async () => {
    const { etablissements } = await import('@/lib/api/referentiels');
    const { ApiError } = await import('@/lib/api');

    vi.spyOn(etablissements, 'demande').mockRejectedValueOnce(
      new ApiError(400, 'Format de numéro invalide', {
        statusCode: 400,
        message: ['telephone must be a valid phone number'],
        error: 'Bad Request',
      })
    );

    render(<InscrireHopitalPage />);

    // Fill valid data for client-side
    fireEvent.change(screen.getByLabelText(/Nom de l'établissement/i), {
      target: { value: 'Clinique Test' },
    });
    fireEvent.change(screen.getByLabelText(/Adresse ou quartier physique/i), {
      target: { value: 'Cotonou Centre' },
    });
    fireEvent.change(screen.getByLabelText(/Téléphone de l'établissement/i), {
      target: { value: '01 61 00 00 00' },
    });
    fireEvent.change(screen.getByLabelText(/Email officiel de l'établissement/i), {
      target: { value: 'contact@test.bj' },
    });
    fireEvent.change(screen.getByLabelText(/^Nom du représentant/i), {
      target: { value: 'Dupont' },
    });
    fireEvent.change(screen.getByLabelText(/Prénom du représentant/i), {
      target: { value: 'Jean' },
    });
    fireEvent.change(screen.getByLabelText(/Téléphone direct du représentant/i), {
      target: { value: '01 61 00 00 00' },
    });
    fireEvent.change(screen.getByLabelText(/Email professionnel du représentant/i), {
      target: { value: 'jean.dupont@test.bj' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Inscrire mon hôpital/i }));

    const telephoneInput = screen.getByLabelText(/Téléphone de l'établissement/i);
    expect(await screen.findByText(/telephone must be a valid phone number/i)).toBeInTheDocument();
    expect(telephoneInput).toHaveClass('border-rose-400');
  });

  it('marks representative phone red (and NOT establishment phone) when representative phone has a typo', async () => {
    render(<InscrireHopitalPage />);

    // Remplir un téléphone établissement valide
    const telEtabInput = screen.getByLabelText(/Téléphone de l'établissement/i);
    fireEvent.change(telEtabInput, { target: { value: '01 61 00 00 00' } });
    fireEvent.blur(telEtabInput);

    // Remplir un téléphone représentant erroné (incomplet pour le Bénin)
    const telRepInput = screen.getByLabelText(/Téléphone direct du représentant/i);
    fireEvent.change(telRepInput, { target: { value: '01 61 00 00' } });
    fireEvent.blur(telRepInput);

    // Le champ représentant doit devenir rouge avec un message d'erreur
    expect(telRepInput).toHaveClass('border-rose-400');
    expect(telRepInput).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText(/Numéro invalide. Format attendu/i)).toBeInTheDocument();

    // Le champ établissement ne doit PAS devenir rouge
    expect(telEtabInput).not.toHaveClass('border-rose-400');
    expect(telEtabInput).toHaveAttribute('aria-invalid', 'false');
  });

  it('correctly attributes backend error to representative phone even with generic message', async () => {
    const { etablissements } = await import('@/lib/api/referentiels');
    const { ApiError } = await import('@/lib/api');

    vi.spyOn(etablissements, 'demande').mockRejectedValueOnce(
      new ApiError(400, 'Format de numéro invalide', {
        statusCode: 400,
        message: [
          'Le téléphone direct du représentant doit être un numéro béninois valide, au format international (ex: +2290161000000)',
        ],
        error: 'Bad Request',
      })
    );

    render(<InscrireHopitalPage />);

    // Remplir les champs
    fireEvent.change(screen.getByLabelText(/Nom de l'établissement/i), {
      target: { value: 'Clinique Test' },
    });
    fireEvent.change(screen.getByLabelText(/Adresse ou quartier physique/i), {
      target: { value: 'Cotonou Centre' },
    });
    fireEvent.change(screen.getByLabelText(/Téléphone de l'établissement/i), {
      target: { value: '01 61 00 00 00' },
    });
    fireEvent.change(screen.getByLabelText(/Email officiel de l'établissement/i), {
      target: { value: 'contact@test.bj' },
    });
    fireEvent.change(screen.getByLabelText(/^Nom du représentant/i), {
      target: { value: 'Dupont' },
    });
    fireEvent.change(screen.getByLabelText(/Prénom du représentant/i), {
      target: { value: 'Jean' },
    });
    fireEvent.change(screen.getByLabelText(/Téléphone direct du représentant/i), {
      target: { value: '01 61 00 00 00' },
    });
    fireEvent.change(screen.getByLabelText(/Email professionnel du représentant/i), {
      target: { value: 'jean.dupont@test.bj' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Inscrire mon hôpital/i }));

    const telEtabInput = screen.getByLabelText(/Téléphone de l'établissement/i);
    const telRepInput = screen.getByLabelText(/Téléphone direct du représentant/i);

    expect(
      await screen.findByText(/Le téléphone direct du représentant doit être un numéro béninois valide/i)
    ).toBeInTheDocument();

    // Seul le représentant doit être en rouge !
    expect(telRepInput).toHaveClass('border-rose-400');
    expect(telEtabInput).not.toHaveClass('border-rose-400');
  });

  it('routes completely generic backend phone message to representative when representative has the invalid number', async () => {
    const { etablissements } = await import('@/lib/api/referentiels');
    const { ApiError } = await import('@/lib/api');

    // Message réel tel que renvoyé par le backend sans mention de "représentant"
    vi.spyOn(etablissements, 'demande').mockRejectedValueOnce(
      new ApiError(400, 'Format de numéro invalide', {
        statusCode: 400,
        message: [
          'Le téléphone doit être un numéro béninois valide, au format international (ex: +2290161000000)',
        ],
        error: 'Bad Request',
      })
    );

    render(<InscrireHopitalPage />);

    // Établissement valide
    fireEvent.change(screen.getByLabelText(/Nom de l'établissement/i), {
      target: { value: 'Clinique Pasteur' },
    });
    fireEvent.change(screen.getByLabelText(/Adresse ou quartier physique/i), {
      target: { value: 'Cotonou Centre' },
    });
    fireEvent.change(screen.getByLabelText(/Téléphone de l'établissement/i), {
      target: { value: '01 61 00 00 00' },
    });
    fireEvent.change(screen.getByLabelText(/Email officiel de l'établissement/i), {
      target: { value: 'contact@pasteur.bj' },
    });

    // Représentant : numéro plausible au premier abord ou rejeté par le backend
    fireEvent.change(screen.getByLabelText(/^Nom du représentant/i), {
      target: { value: 'Diallo' },
    });
    fireEvent.change(screen.getByLabelText(/Prénom du représentant/i), {
      target: { value: 'Awa' },
    });
    fireEvent.change(screen.getByLabelText(/Téléphone direct du représentant/i), {
      target: { value: '01 00 00 00 00' },
    });
    fireEvent.change(screen.getByLabelText(/Email professionnel du représentant/i), {
      target: { value: 'awa.diallo@example.com' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Inscrire mon hôpital/i }));

    const telEtabInput = screen.getByLabelText(/Téléphone de l'établissement/i);
    const telRepInput = screen.getByLabelText(/Téléphone direct du représentant/i);

    expect(
      await screen.findByText(/Le téléphone doit être un numéro béninois valide/i)
    ).toBeInTheDocument();

    // Le champ représentant reçoit l'erreur, et le champ établissement reste sain
    expect(telRepInput).toHaveClass('border-rose-400');
    expect(telEtabInput).not.toHaveClass('border-rose-400');
  });
});

