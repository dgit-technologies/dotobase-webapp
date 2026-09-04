import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Sidebar from './Sidebar';

vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
}));

vi.mock('next/link', () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}));

describe('Sidebar', () => {
  it('renders clinic name', () => {
    render(<Sidebar clinicName="Hôpital Central" clinicType="Médecine générale" />);
    expect(screen.getByText('Hôpital Central')).toBeInTheDocument();
    expect(screen.getByText('Médecine générale')).toBeInTheDocument();
  });

  it('renders all nav items', () => {
    render(<Sidebar />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Patients')).toBeInTheDocument();
    expect(screen.getByText('Consultations')).toBeInTheDocument();
    expect(screen.getByText('Dossiers')).toBeInTheDocument();
  });

  it('renders bottom nav items', () => {
    render(<Sidebar />);
    expect(screen.getByText('Parametre')).toBeInTheDocument();
    expect(screen.getByText('Aide')).toBeInTheDocument();
    expect(screen.getByText('Déconnexion')).toBeInTheDocument();
  });

  it('highlights active route', () => {
    render(<Sidebar />);
    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    expect(dashboardLink.className).toContain('bg-[#0053CD]');
  });

  it('calls onLogout when Déconnexion is clicked', () => {
    const onLogout = vi.fn();
    render(<Sidebar onLogout={onLogout} />);
    fireEvent.click(screen.getByText('Déconnexion'));
    expect(onLogout).toHaveBeenCalledOnce();
  });
});
