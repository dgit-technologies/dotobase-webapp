'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, Settings2, HelpCircle, Search, Hospital, ChevronDown, Check } from 'lucide-react';
import Avatar from '@/components/ui/avatar';
import { cn } from '@/lib/utils/cn';

export interface HospitalItem {
  id: string;
  nom: string;
  ville?: string;
}

interface HeaderProps {
  doctorName?: string;
  doctorRole?: string;
  doctorAvatar?: string;
  notificationCount?: number;
  onSearch?: (query: string) => void;
  className?: string;
  currentHospital?: string;
  currentHospitalId?: string;
  hospitals?: HospitalItem[];
  onSelectHospital?: (hospitalId: string) => void;
}

export default function Header({
  doctorName = 'Dr. Médecin',
  doctorRole = 'Médecin Principal',
  doctorAvatar,
  notificationCount = 0,
  onSearch,
  className,
  currentHospital,
  currentHospitalId,
  hospitals = [],
  onSelectHospital,
}: HeaderProps) {
  const [isHospitalDropdownOpen, setIsHospitalDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsHospitalDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header
      className={cn(
        'flex h-20 shrink-0 items-center gap-4 border-b border-[#E3EDF7] bg-white px-6',
        className
      )}
    >
      {/* Sélecteur d'établissement / clinique */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsHospitalDropdownOpen((prev) => !prev)}
          aria-expanded={isHospitalDropdownOpen}
          aria-label="Sélectionner l'établissement"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-[#E3EDF7] bg-[#FAFCFF] hover:bg-slate-50 hover:border-[#8BD2F2] transition-colors cursor-pointer text-left"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#8BD2F2]/20 text-[#0E1B2A] shrink-0">
            <Hospital size={16} />
          </div>
          <div className="min-w-0 pr-1">
            <span className="block text-[10px] uppercase font-bold text-[#6E7C91] leading-tight">
              Clinique / Hôpital
            </span>
            <span className="block text-xs sm:text-sm font-bold text-[#0E1B2A] leading-tight truncate max-w-[140px] sm:max-w-[200px]">
              {currentHospital || 'Sélectionner un hôpital'}
            </span>
          </div>
          <ChevronDown
            size={15}
            className={cn(
              "text-[#6E7C91] transition-transform duration-200 shrink-0",
              isHospitalDropdownOpen && "rotate-180 text-[#0E1B2A]"
            )}
          />
        </button>

        {isHospitalDropdownOpen && (
          <div
            data-testid="hospital-dropdown-menu"
            className="absolute left-0 mt-2 w-72 rounded-xl border border-[#E3EDF7] bg-white shadow-xl py-2 z-50"
          >
            <div className="px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#6E7C91] border-b border-[#E3EDF7]">
              Mes établissements ({hospitals.length > 0 ? hospitals.length : (currentHospital ? 1 : 0)})
            </div>
            <div className="max-h-64 overflow-y-auto py-1">
              {hospitals.length === 0 ? (
                <div className="px-3.5 py-2.5 text-xs text-slate-700 flex items-center justify-between bg-blue-50/50">
                  <div className="flex items-center gap-2.5 truncate">
                    <Hospital size={15} className="text-[#0E1B2A] shrink-0" />
                    <span className="font-semibold text-[#0E1B2A] truncate">
                      {currentHospital || 'Clinique par défaut'}
                    </span>
                  </div>
                  <Check size={14} className="text-[#0E1B2A] shrink-0 ml-2" />
                </div>
              ) : (
                hospitals.map((h) => {
                  const isSelected =
                    (currentHospitalId && h.id === currentHospitalId) ||
                    (!currentHospitalId && h.nom === currentHospital);
                  return (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => {
                        onSelectHospital?.(h.id);
                        setIsHospitalDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between transition-colors cursor-pointer",
                        isSelected
                          ? "bg-[#8BD2F2]/20 font-bold text-[#0E1B2A]"
                          : "hover:bg-slate-50 text-slate-700 hover:text-[#0E1B2A]"
                      )}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Hospital
                          size={15}
                          className={isSelected ? "text-[#0E1B2A]" : "text-[#6E7C91]"}
                        />
                        <div className="truncate">
                          <p className="font-semibold text-slate-900 truncate">{h.nom}</p>
                          {h.ville && (
                            <p className="text-[10px] text-[#6E7C91] truncate">{h.ville}</p>
                          )}
                        </div>
                      </div>
                      {isSelected && (
                        <Check size={14} className="text-[#0E1B2A] shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Barre de recherche */}
      <div className="relative flex-1 max-w-xl">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6E7C91]"
        />
        <input
          type="search"
          placeholder="Recherche rapide..."
          onChange={(e) => onSearch?.(e.target.value)}
          className="w-full rounded-lg border border-[#E3EDF7] bg-[#FAFCFF] py-2 pl-9 pr-4 text-sm text-[#0E1B2A] placeholder:text-[#6E7C91] focus:border-[#8BD2F2] focus:outline-none focus:ring-2 focus:ring-[#8BD2F2]/20 transition-colors"
        />
      </div>

      {/* Actions droite */}
      <div className="flex items-center gap-1 ml-auto">
        {/* Cloche notifications */}
        <button
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[#6E7C91] hover:bg-[#8BD2F2]/15 hover:text-[#0E1B2A] transition-colors cursor-pointer"
        >
          <Bell size={18} />
          {notificationCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2 items-center justify-center rounded-full bg-[#D14343]" />
          )}
        </button>

        {/* Paramètres */}
        <button
          aria-label="Paramètres"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#6E7C91] hover:bg-[#8BD2F2]/15 hover:text-[#0E1B2A] transition-colors cursor-pointer"
        >
          <Settings2 size={18} />
        </button>

        {/* Aide */}
        <button
          aria-label="Aide"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#6E7C91] hover:bg-[#8BD2F2]/15 hover:text-[#0E1B2A] transition-colors cursor-pointer"
        >
          <HelpCircle size={18} />
        </button>
      </div>

      {/* Séparateur */}
      <div className="h-7 w-px bg-[#E3EDF7]" />

      {/* Infos médecin */}
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-[#0E1B2A] leading-tight">{doctorName}</p>
          <p className="text-xs text-[#6E7C91]">{doctorRole}</p>
        </div>
        <Avatar name={doctorName} src={doctorAvatar} size="md" />
      </div>
    </header>
  );
}
