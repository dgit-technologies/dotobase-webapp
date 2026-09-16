'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  UserPlus,
  Search,
  Stethoscope,
  ShieldCheck,
  Building2,
  RefreshCw,
  Edit,
  HeartPulse,
  Filter,
} from 'lucide-react';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Spinner from '@/components/ui/spinner';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import { toast } from '@/components/ui/toast';
import { useAuth } from '@/lib/hooks/use-auth';
import { api, toDisplayMessage } from '@/lib/api';
import type { Specialite } from '@/lib/api/types';
import AjouterPersonnelModal from '@/components/personnel/AjouterPersonnelModal';
import ModifierPersonnelModal, {
  StaffMemberItem,
} from '@/components/personnel/ModifierPersonnelModal';

export default function PersonnelPage() {
  const router = useRouter();
  const {
    user,
    role,
    isEtablissementAdmin,
    etablissementActif,
    isLoading: authLoading,
  } = useAuth();

  const [members, setMembers] = useState<StaffMemberItem[]>([]);
  const [specialites, setSpecialites] = useState<Specialite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtres & Recherche
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'medecin' | 'infirmier'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'medecin' | 'infirmier' | 'admin' | 'directeur'>('all');

  // Modales
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<StaffMemberItem | null>(null);

  // Vérification des droits : réservé aux administrateurs et directeurs de l'hôpital ou admin global
  useEffect(() => {
    if (!authLoading && !isEtablissementAdmin && role !== 'admin' && role !== 'directeur') {
      toast.error(
        'Accès refusé',
        'Cette page est réservée aux administrateurs et directeurs d’établissement.'
      );
      router.replace('/dashboard');
    }
  }, [authLoading, isEtablissementAdmin, role, router]);

  const loadData = async () => {
    if (!etablissementActif?.id) return;
    setIsLoading(true);
    setError(null);

    try {
      // Charger en parallèle les spécialités, affectations et listes de personnel
      const [
        specialitesData,
        medAffectations,
        infAffectations,
        medecinsList,
        infirmiersList,
      ] = await Promise.all([
        api.specialites.list().catch(() => [] as Specialite[]),
        api.medecinEtablissements.list({ etablissement_id: etablissementActif.id }).catch(() => []),
        api.infirmierEtablissements.list({ etablissement_id: etablissementActif.id }).catch(() => []),
        api.medecins.list().catch(() => []),
        api.infirmiers.list().catch(() => []),
      ]);

      setSpecialites(specialitesData);

      const specMap = new Map(specialitesData.map((s) => [s.id, s.nom]));
      const medMap = new Map(medecinsList.map((m) => [m.id, m]));
      const infMap = new Map(infirmiersList.map((i) => [i.id, i]));

      const staffList: StaffMemberItem[] = [];

      for (const aff of medAffectations) {
        const m = medMap.get(aff.medecin_id);
        staffList.push({
          id: aff.medecin_id,
          affectationId: aff.id,
          type: 'medecin',
          nom: m?.nom ?? 'Inconnu',
          prenom: m?.prenom ?? '',
          specialite: m?.specialite_id ? specMap.get(m.specialite_id) : undefined,
          role: aff.role,
          estPrincipal: aff.est_principal,
          createdAt: aff.created_at,
        });
      }

      for (const aff of infAffectations) {
        const inf = infMap.get(aff.infirmier_id);
        staffList.push({
          id: aff.infirmier_id,
          affectationId: aff.id,
          type: 'infirmier',
          nom: inf?.nom ?? 'Inconnu',
          prenom: inf?.prenom ?? '',
          service: inf?.service ?? undefined,
          role: aff.role,
          estPrincipal: aff.est_principal,
          createdAt: aff.created_at,
        });
      }

      // Tri alphabétique par nom
      staffList.sort((a, b) => a.nom.localeCompare(b.nom));
      setMembers(staffList);
    } catch (err) {
      setError(toDisplayMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (etablissementActif?.id) {
      loadData();
    }
  }, [etablissementActif?.id]);

  // Filtrage
  const filteredMembers = useMemo(() => {
    return members.filter((item) => {
      // Filtre profession
      if (typeFilter !== 'all' && item.type !== typeFilter) return false;

      // Filtre rôle
      if (roleFilter !== 'all' && item.role !== roleFilter) return false;

      // Recherche textuelle
      if (search.trim()) {
        const query = search.toLowerCase();
        const fullName = `${item.prenom} ${item.nom}`.toLowerCase();
        const specOrService = (item.specialite || item.service || '').toLowerCase();
        return fullName.includes(query) || specOrService.includes(query);
      }

      return true;
    });
  }, [members, search, typeFilter, roleFilter]);

  // Statistiques
  const stats = useMemo(() => {
    const total = members.length;
    const medecinsCount = members.filter((m) => m.type === 'medecin').length;
    const infirmiersCount = members.filter((m) => m.type === 'infirmier').length;
    const adminsCount = members.filter((m) => m.role === 'admin' || m.role === 'directeur').length;
    return { total, medecinsCount, infirmiersCount, adminsCount };
  }, [members]);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#0E1B2A]">
              Gestion du personnel
            </h1>
            {etablissementActif && (
              <span className="rounded-full bg-[#8BD2F2]/20 px-3 py-0.5 text-xs font-semibold text-[#0E1B2A]">
                {etablissementActif.nom}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-[#6E7C91]">
            Gérez les praticiens, soignants et administrateurs rattachés à votre établissement.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={loadData}
            disabled={isLoading}
            className="gap-2 text-[#0E1B2A]"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            Actualiser
          </Button>
          <Button
            onClick={() => setIsAddOpen(true)}
            disabled={!etablissementActif}
            className="gap-2"
          >
            <UserPlus size={16} />
            Ajouter un collaborateur
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex items-center gap-4 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#8BD2F2]/20 text-[#0E1B2A]">
            <Users size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#6E7C91]">
              Total Personnel
            </p>
            <p className="text-2xl font-bold text-[#0E1B2A]">{stats.total}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Stethoscope size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#6E7C91]">
              Médecins
            </p>
            <p className="text-2xl font-bold text-[#0E1B2A]">{stats.medecinsCount}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <HeartPulse size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#6E7C91]">
              Infirmiers
            </p>
            <p className="text-2xl font-bold text-[#0E1B2A]">{stats.infirmiersCount}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <ShieldCheck size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#6E7C91]">
              Admin / Direction
            </p>
            <p className="text-2xl font-bold text-[#0E1B2A]">{stats.adminsCount}</p>
          </div>
        </Card>
      </div>

      {/* Filtres & Recherche */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6E7C91]"
            />
            <input
              type="text"
              placeholder="Rechercher par nom, prénom, spécialité ou service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-[#E3EDF7] bg-white py-2 pl-9 pr-3 text-sm text-[#0E1B2A] placeholder-[#6E7C91] focus:border-[#8BD2F2] focus:outline-none focus:ring-2 focus:ring-[#8BD2F2]/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filtre Profession */}
            <div className="flex items-center rounded-lg border border-[#E3EDF7] bg-[#FAFCFF] p-1 text-xs font-medium">
              <button
                type="button"
                onClick={() => setTypeFilter('all')}
                className={`rounded-md px-3 py-1.5 transition-colors ${
                  typeFilter === 'all'
                    ? 'bg-white font-semibold text-[#0E1B2A] shadow-sm'
                    : 'text-[#6E7C91] hover:text-[#0E1B2A]'
                }`}
              >
                Tous
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('medecin')}
                className={`rounded-md px-3 py-1.5 transition-colors ${
                  typeFilter === 'medecin'
                    ? 'bg-white font-semibold text-[#0E1B2A] shadow-sm'
                    : 'text-[#6E7C91] hover:text-[#0E1B2A]'
                }`}
              >
                Médecins
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('infirmier')}
                className={`rounded-md px-3 py-1.5 transition-colors ${
                  typeFilter === 'infirmier'
                    ? 'bg-white font-semibold text-[#0E1B2A] shadow-sm'
                    : 'text-[#6E7C91] hover:text-[#0E1B2A]'
                }`}
              >
                Infirmiers
              </button>
            </div>

            {/* Filtre Rôle */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="rounded-lg border border-[#E3EDF7] bg-white px-3 py-2 text-xs font-medium text-[#0E1B2A] focus:border-[#8BD2F2] focus:outline-none"
            >
              <option value="all">Tous les rôles</option>
              <option value="medecin">Soignants</option>
              <option value="admin">Administrateurs</option>
              <option value="directeur">Directeurs</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Tableau du personnel */}
      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <p className="text-sm font-semibold text-[#D14343]">{error}</p>
            <Button variant="secondary" size="sm" onClick={loadData} className="mt-3">
              Réessayer
            </Button>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-[#6E7C91]">
              <Users size={28} />
            </div>
            <h3 className="mt-3 text-base font-semibold text-[#0E1B2A]">
              Aucun membre trouvé
            </h3>
            <p className="mt-1 text-sm text-[#6E7C91]">
              {search || typeFilter !== 'all' || roleFilter !== 'all'
                ? 'Aucun collaborateur ne correspond à vos critères de recherche.'
                : 'Commencez par ajouter votre premier médecin ou infirmier.'}
            </p>
            {(!search && typeFilter === 'all' && roleFilter === 'all') && (
              <Button
                onClick={() => setIsAddOpen(true)}
                className="mt-4 gap-2"
                size="sm"
              >
                <UserPlus size={16} />
                Ajouter un collaborateur
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E3EDF7] bg-[#FAFCFF] text-xs font-semibold uppercase tracking-wider text-[#6E7C91]">
                  <th className="px-6 py-3.5">Collaborateur</th>
                  <th className="px-6 py-3.5">Profession</th>
                  <th className="px-6 py-3.5">Spécialité / Service</th>
                  <th className="px-6 py-3.5">Rôle hôpital</th>
                  <th className="px-6 py-3.5">Rattachement</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3EDF7] text-sm">
                {filteredMembers.map((member) => (
                  <tr
                    key={member.affectationId}
                    className="hover:bg-[#FAFCFF] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8BD2F2]/30 text-xs font-bold text-[#0E1B2A]">
                          {member.prenom[0]}
                          {member.nom[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-[#0E1B2A]">
                            {member.type === 'medecin' ? 'Dr. ' : ''}
                            {member.prenom} {member.nom}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0E1B2A]">
                        {member.type === 'medecin' ? (
                          <>
                            <Stethoscope size={14} className="text-blue-500" />
                            Médecin
                          </>
                        ) : (
                          <>
                            <HeartPulse size={14} className="text-emerald-500" />
                            Infirmier
                          </>
                        )}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs text-[#6E7C91]">
                      {member.specialite || member.service || '—'}
                    </td>

                    <td className="px-6 py-4">
                      {member.role === 'admin' ? (
                        <Badge variant="warning">Admin Hôpital</Badge>
                      ) : member.role === 'directeur' ? (
                        <Badge variant="info">Directeur</Badge>
                      ) : (
                        <Badge variant="default">Soignant</Badge>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {member.estPrincipal ? (
                        <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          Principal
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                          Secondaire
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedMember(member)}
                        className="gap-1.5 text-xs font-semibold text-[#0E1B2A] hover:bg-[#8BD2F2]/20"
                      >
                        <Edit size={14} />
                        Gérer
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal d'ajout */}
      {etablissementActif && (
        <AjouterPersonnelModal
          open={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          etablissementId={etablissementActif.id}
          specialites={specialites}
          onSuccess={loadData}
        />
      )}

      {/* Modal de modification */}
      <ModifierPersonnelModal
        open={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        member={selectedMember}
        onSuccess={loadData}
      />
    </div>
  );
}
