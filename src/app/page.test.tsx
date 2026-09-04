import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HomePage from './page';

describe('HomePage', () => {
  it('renders Dotobase description and branding', () => {
    render(<HomePage />);
    expect(screen.getByText(/Votre santé,/i)).toBeInTheDocument();
    expect(screen.getByText(/est la plateforme moderne de dossiers médicaux/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Dotobase/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders the "Quelque chose de grand est en train d\'être construit" message', () => {
    render(<HomePage />);
    const elements = screen.getAllByText(/Quelque chose de grand est en train d'être construit/i);
    expect(elements.length).toBeGreaterThanOrEqual(1);
  });

  it('renders powered by DGIT-TECHNOLOGIES with correct redirect link', () => {
    render(<HomePage />);
    const dgitLinks = screen.getAllByRole('link', { name: /dgit-technologies/i });
    expect(dgitLinks.length).toBeGreaterThanOrEqual(1);

    dgitLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', 'https://dgit-technologies.com');
      expect(link).toHaveAttribute('target', '_blank');
    });
  });

  it('hides login buttons while APIs are being connected', () => {
    render(<HomePage />);
    const loginLinks = screen.queryAllByRole('link', { name: /connexion|espace praticien/i });
    expect(loginLinks.length).toBe(0);
  });
});
