'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FolderHeart,
  ClipboardList,
  UserCog,
  Settings2,
  HelpCircle,
  LogOut,
  Plus,
  Hospital,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  /** Si défini, seuls ces rôles voient cet élément de menu. */
  roles?: string[];
  /** Si défini, ces rôles ne voient pas cet élément de menu. */
  excludeRoles?: string[];
}

const mainNav: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  {
    href: '/consultations',
    label: 'Consultations',
    icon: <ClipboardList size={18} />,
    excludeRoles: ['admin'],
  },
  {
    href: '/dossiers-medicaux',
    label: 'Dossiers médicaux',
    icon: <FolderHeart size={18} />,
    excludeRoles: ['admin'],
  },
  {
    href: '/personnel',
    label: 'Personnel',
    icon: <UserCog size={18} />,
    roles: ['directeur'],
  },
  {
    href: '/admin/demandes',
    label: 'Hôpitaux',
    icon: <Hospital size={18} />,
    roles: ['admin'], // Strictement réservé au Super Admin Dotobase
  },
];

const bottomNav: NavItem[] = [
  { href: '/parametres', label: 'Parametre', icon: <Settings2 size={18} /> },
  { href: '/aide', label: 'Aide', icon: <HelpCircle size={18} /> },
];

interface SidebarProps {
  clinicName?: string;
  clinicType?: string;
  userRole?: string | null;
  isEtablissementAdmin?: boolean;
  onLogout?: () => void;
}

export default function Sidebar({
  clinicName,
  clinicType,
  userRole,
  isEtablissementAdmin,
  onLogout,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-[#E3EDF7] bg-white">
      {/* Logo Dotobase */}
      <div className="flex items-center justify-center px-6 py-5 border-b border-[#E3EDF7]">
        <Link href="/dashboard" className="flex items-center justify-center w-full" aria-label="Accueil Dotobase">
          <Image
            src="/Logo_written.svg"
            alt="Dotobase"
            width={220}
            height={70}
            className="h-16 w-auto max-w-full object-contain"
            priority
          />
        </Link>
      </div>


      {/* Navigation principale */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <ul className="flex flex-col gap-1">
          {mainNav
            .filter((item) => {
              if (item.href === '/personnel') {
                if (userRole === 'admin') return false;
                return !!isEtablissementAdmin || userRole === 'directeur';
              }
              if (userRole && item.excludeRoles?.includes(userRole)) {
                return false;
              }
              if (item.roles) {
                return userRole ? item.roles.includes(userRole) : false;
              }
              return true;
            })
            .map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-[#8BD2F2] text-[#0E1B2A] font-semibold'
                      : 'text-[#6E7C91] hover:bg-[#8BD2F2]/15 hover:text-[#0E1B2A]'
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Navigation bas */}
      <div className="px-3 pb-4">
        <ul className="flex flex-col gap-1">
          {bottomNav.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-[#8BD2F2] text-[#0E1B2A] font-semibold'
                      : 'text-[#6E7C91] hover:bg-[#8BD2F2]/15 hover:text-[#0E1B2A]'
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="my-3 border-t border-[#E3EDF7]" />

        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#6E7C91] transition-colors hover:bg-[#FCEAEA] hover:text-[#D14343] cursor-pointer"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
