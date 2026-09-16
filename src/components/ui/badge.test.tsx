import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Badge from './badge';

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>Actif</Badge>);
    expect(screen.getByText('Actif')).toBeInTheDocument();
  });

  it('applies default variant', () => {
    render(<Badge>Actif</Badge>);
    expect(screen.getByText('Actif')).toHaveClass('bg-[#8BD2F2]/20');
  });

  it('applies success variant', () => {
    render(<Badge variant="success">Terminé</Badge>);
    expect(screen.getByText('Terminé')).toHaveClass('text-[#22A06B]');
  });

  it('applies error variant', () => {
    render(<Badge variant="error">Urgent</Badge>);
    expect(screen.getByText('Urgent')).toHaveClass('text-[#D14343]');
  });
});
