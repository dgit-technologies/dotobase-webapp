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
  it('renders Dotobase logo', () => {
    render(<Sidebar />);
    expect(screen.getByAltText('Dotobase')).toBeInTheDocument();
  });

  it('renders all standard nav items', () => {
    render(<Sidebar />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Consultations')).toBeInTheDocument();
    expect(screen.getByText('Dossiers médicaux')).toBeInTheDocument();
    expect(screen.queryByText('Patients')).not.toBeInTheDocument();
    // Par défaut sans rôle admin ou directeur, Hôpitaux et Personnel sont masqués
    expect(screen.queryByText('Hôpitaux')).not.toBeInTheDocument();
    expect(screen.queryByText('Personnel')).not.toBeInTheDocument();
  });

  it('renders "Hôpitaux" only for super admin (userRole="admin") and hides Consultations, Dossiers médicaux, Personnel', () => {
    const { rerender } = render(<Sidebar userRole="medecin" />);
    expect(screen.queryByText('Hôpitaux')).not.toBeInTheDocument();
    expect(screen.getByText('Consultations')).toBeInTheDocument();
    expect(screen.getByText('Dossiers médicaux')).toBeInTheDocument();
    expect(screen.queryByText('Personnel')).not.toBeInTheDocument();

    rerender(<Sidebar userRole="admin" />);
    expect(screen.getByText('Hôpitaux')).toBeInTheDocument();
    // Consultations, Dossiers médicaux et Personnel doivent être masqués pour le superadmin
    expect(screen.queryByText('Consultations')).not.toBeInTheDocument();
    expect(screen.queryByText('Dossiers médicaux')).not.toBeInTheDocument();
    expect(screen.queryByText('Personnel')).not.toBeInTheDocument();
  });

  it('renders "Personnel" only for directeur, but not for admin or other roles', () => {
    const { rerender } = render(<Sidebar userRole="medecin" />);
    expect(screen.queryByText('Personnel')).not.toBeInTheDocument();

    rerender(<Sidebar userRole="admin" />);
    expect(screen.queryByText('Personnel')).not.toBeInTheDocument();

    rerender(<Sidebar userRole="directeur" />);
    expect(screen.getByText('Personnel')).toBeInTheDocument();
    expect(screen.getByText('Consultations')).toBeInTheDocument();
    expect(screen.getByText('Dossiers médicaux')).toBeInTheDocument();

    rerender(<Sidebar userRole="medecin" isEtablissementAdmin={true} />);
    expect(screen.getByText('Personnel')).toBeInTheDocument();
  });

  it('renders "Dossiers médicaux" link with href /dossiers-medicaux', () => {
    render(<Sidebar />);
    const link = screen.getByRole('link', { name: /dossiers médicaux/i });
    expect(link).toHaveAttribute('href', '/dossiers-medicaux');
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
    expect(dashboardLink.className).toContain('bg-[#8BD2F2]');
  });

  it('calls onLogout when Déconnexion is clicked', () => {
    const onLogout = vi.fn();
    render(<Sidebar onLogout={onLogout} />);
    fireEvent.click(screen.getByText('Déconnexion'));
    expect(onLogout).toHaveBeenCalledOnce();
  });
});
