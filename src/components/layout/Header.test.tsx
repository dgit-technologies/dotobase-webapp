import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from './Header';

describe('Header', () => {
  it('renders search input and actions', () => {
    render(<Header />);
    expect(screen.getByPlaceholderText('Recherche rapide...')).toBeInTheDocument();
    expect(screen.getByLabelText('Notifications')).toBeInTheDocument();
  });

  it('renders doctor name and role', () => {
    render(<Header doctorName="Dr. Hounkpatin" doctorRole="Médecin Principal" />);
    expect(screen.getByText('Dr. Hounkpatin')).toBeInTheDocument();
    expect(screen.getByText('Médecin Principal')).toBeInTheDocument();
  });

  it('renders search input', () => {
    render(<Header />);
    expect(screen.getByPlaceholderText('Recherche rapide...')).toBeInTheDocument();
  });

  it('calls onSearch when typing', () => {
    const onSearch = vi.fn();
    render(<Header onSearch={onSearch} />);
    fireEvent.change(screen.getByPlaceholderText('Recherche rapide...'), {
      target: { value: 'Jean' },
    });
    expect(onSearch).toHaveBeenCalledWith('Jean');
  });

  it('renders notification button', () => {
    render(<Header />);
    expect(screen.getByLabelText('Notifications')).toBeInTheDocument();
  });

  it('shows notification dot when count > 0', () => {
    const { container } = render(<Header notificationCount={3} />);
    const dot = container.querySelector('.bg-\\[\\#D14343\\]');
    expect(dot).toBeInTheDocument();
  });

  it('renders settings and help buttons', () => {
    render(<Header />);
    expect(screen.getByLabelText('Paramètres')).toBeInTheDocument();
    expect(screen.getByLabelText('Aide')).toBeInTheDocument();
  });

  it('affiche le nom de la clinique à côté de la recherche rapide', () => {
    render(<Header currentHospital="Clinique Saint Luc" />);
    expect(screen.getByText('Clinique Saint Luc')).toBeInTheDocument();
    expect(screen.getByLabelText("Sélectionner l'établissement")).toBeInTheDocument();
  });

  it("ouvre le menu et permet au praticien de passer d'un hôpital à un autre", () => {
    const onSelectHospital = vi.fn();
    const hospitals = [
      { id: 'etab-1', nom: 'Clinique Saint Luc', ville: 'Cotonou' },
      { id: 'etab-2', nom: 'Hôpital Mère-Enfant', ville: 'Porto-Novo' },
    ];

    render(
      <Header
        currentHospital="Clinique Saint Luc"
        currentHospitalId="etab-1"
        hospitals={hospitals}
        onSelectHospital={onSelectHospital}
      />
    );

    const selectBtn = screen.getByLabelText("Sélectionner l'établissement");
    fireEvent.click(selectBtn);

    expect(screen.getByTestId('hospital-dropdown-menu')).toBeInTheDocument();
    expect(screen.getByText('Hôpital Mère-Enfant')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Hôpital Mère-Enfant'));
    expect(onSelectHospital).toHaveBeenCalledWith('etab-2');
    expect(screen.queryByTestId('hospital-dropdown-menu')).not.toBeInTheDocument();
  });

  it('ferme le menu lorsqu’on clique en dehors', () => {
    render(
      <Header
        currentHospital="Clinique Saint Luc"
        hospitals={[{ id: 'etab-1', nom: 'Clinique Saint Luc' }]}
      />
    );

    fireEvent.click(screen.getByLabelText("Sélectionner l'établissement"));
    expect(screen.getByTestId('hospital-dropdown-menu')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    expect(screen.queryByTestId('hospital-dropdown-menu')).not.toBeInTheDocument();
  });
});
