'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Hospital,
  Building2,
  Phone,
  Mail,
  MapPin,
  User,
  Check,
  X,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
} from 'lucide-react';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Spinner from '@/components/ui/spinner';
import Modal from '@/components/ui/modal';
import { etablissements } from '@/lib/api/referentiels';
import { toDisplayMessage } from '@/lib/api';
import { toast } from '@/components/ui/toast';
import { useAuth } from '@/lib/hooks/use-auth';
import type { Etablissement, CreateEtablissementPayload } from '@/lib/api/types';

const TYPES_LABELS: Record<Etablissement['type'], string> = {
  hopital: 'Hôpital Public / CHU',
  clinique: 'Clinique Privée',
  dispensaire: 'Polyclinique / Dispensaire',
  cabinet: 'Cabinet Médical',
  autre: 'Autre structure de santé',
};

function extraireInfosEtablissement(etab: Etablissement) {
  let adresseAffichee = etab.adresse || '';
  let representant = {
    nom: etab.nom_representant || '',
    fonction: etab.fonction_representant || '',
    telephone: etab.telephone_representant || '',
    email: etab.email_representant || '',
  };

  // Si non renseigné directement dans les colonnes dédiées, vérifier si inclus dans l'adresse
  if (!representant.nom && etab.adresse) {
    const match = etab.adresse.match(/^(.*?)\s*\(Référent:\s*([^,]+),\s*([^-]+)\s*-\s*Tél:\s*([^-]+)\s*-\s*Email:\s*([^)]+)\)$/);
    if (match) {
      adresseAffichee = match[1]?.trim() || '';
      representant = {
        nom: match[2]?.trim() || '',
        fonction: match[3]?.trim() || '',
        telephone: match[4]?.trim() || '',
        email: match[5]?.trim() || '',
      };
    }
  }

  return { adresseAffichee, representant };
}

function formaterDate(dateStr?: string | null) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
}

export default function AdminDemandesPage() {
  const router = useRouter();
  const { role, isLoading: authLoading } = useAuth();
  const [demandes, setDemandes] = useState<Etablissement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Filtres
  const [filtreStatut, setFiltreStatut] = useState<'tous' | Etablissement['statut']>('tous');
  const [recherche, setRecherche] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Modale de confirmation d'approbation
  const [approbationModalOpen, setApprobationModalOpen] = useState(false);
  const [approbationCible, setApprobationCible] = useState<{ id: string; nom: string; ville?: string } | null>(null);

  // Modale de motif de refus
  const [refusModalOpen, setRefusModalOpen] = useState(false);
  const [refusCible, setRefusCible] = useState<{ id: string; nom: string } | null>(null);
  const [motifRefus, setMotifRefus] = useState('');

  // Modale d'ajout d'hôpital
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [isSubmittingNew, setIsSubmittingNew] = useState(false);
  const [newEtab, setNewEtab] = useState<CreateEtablissementPayload>({
    nom: '',
    type: 'hopital',
    ville: '',
    adresse: '',
    telephone: '',
    email: '',
    nom_representant: '',
    prenom_representant: '',
    fonction_representant: '',
    telephone_representant: '',
    email_representant: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Vérification de rôle : Strictly réservé au Super Admin (role === 'admin')
  useEffect(() => {
    if (!authLoading && role && role !== 'admin') {
      toast.error('Accès refusé', 'Cet espace est réservé au Super Admin Dotobase.');
      router.replace('/dashboard');
    }
  }, [authLoading, role, router]);

  const chargerDemandes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await etablissements.list();
      setDemandes(data);
    } catch (err) {
      const msg = toDisplayMessage(err);
      if (
        msg.toLowerCase().includes('token') ||
        msg.toLowerCase().includes('authentification') ||
        msg.toLowerCase().includes('non autorisé')
      ) {
        toast.error('Session expirée', 'Veuillez vous reconnecter.');
        router.push('/login');
        return;
      }
      setError(msg);
      toast.error('Erreur de chargement', msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && role === 'admin') {
      chargerDemandes();
    }
  }, [authLoading, role]);

  // Actions Accepter / Refuser
  const ouvrirModalApprobation = (id: string, nom: string, ville?: string) => {
    setApprobationCible({ id, nom, ville });
    setApprobationModalOpen(true);
  };

  const confirmerApprobation = async () => {
    if (!approbationCible) return;

    const { id, nom } = approbationCible;
    setActionLoadingId(id);
    setActionSuccess(null);
    try {
      await etablissements.approuver(id);
      setDemandes((prev) =>
        prev.map((e) => (e.id === id ? { ...e, statut: 'valide' } : e))
      );
      const msg = `L'établissement « ${nom} » a été approuvé avec succès.`;
      setActionSuccess(msg);
      toast.success('Demande approuvée', msg);
      setApprobationModalOpen(false);
      setApprobationCible(null);
    } catch (err) {
      const msg = toDisplayMessage(err);
      setError(msg);
      toast.error("Erreur d'approbation", msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  const ouvrirModalRefus = (id: string, nom: string) => {
    setRefusCible({ id, nom });
    setMotifRefus('');
    setRefusModalOpen(true);
  };

  const confirmerRefus = async () => {
    if (!refusCible) return;

    const { id, nom } = refusCible;
    setActionLoadingId(id);
    setActionSuccess(null);
    try {
      const payload = motifRefus.trim() ? { motif: motifRefus.trim() } : {};
      await etablissements.refuser(id, payload);
      setDemandes((prev) =>
        prev.map((e) =>
          e.id === id
            ? {
                ...e,
                statut: 'refuse',
                motif_refus: motifRefus.trim() || null,
              }
            : e
        )
      );
      const msg = `La demande de l'établissement « ${nom} » a été rejetée.`;
      setActionSuccess(msg);
      toast.info('Demande rejetée', msg);
      setRefusModalOpen(false);
      setRefusCible(null);
      setMotifRefus('');
    } catch (err) {
      const msg = toDisplayMessage(err);
      setError(msg);
      toast.error('Erreur lors du rejet', msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Création d'un nouvel hôpital
  const handleCreerEtablissement = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!newEtab.nom.trim()) {
      errors.nom = "Le nom de l'établissement est requis.";
    }
    if (!newEtab.ville.trim()) {
      errors.ville = 'La ville est requise.';
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmittingNew(true);
    setFormErrors({});
    try {
      const payload: CreateEtablissementPayload = {
        nom: newEtab.nom.trim(),
        type: newEtab.type,
        ville: newEtab.ville.trim(),
        ...(newEtab.adresse?.trim() ? { adresse: newEtab.adresse.trim() } : {}),
        ...(newEtab.telephone?.trim() ? { telephone: newEtab.telephone.trim() } : {}),
        ...(newEtab.email?.trim() ? { email: newEtab.email.trim() } : {}),
        ...(newEtab.nom_representant?.trim() ? { nom_representant: newEtab.nom_representant.trim() } : {}),
        ...(newEtab.prenom_representant?.trim() ? { prenom_representant: newEtab.prenom_representant.trim() } : {}),
        ...(newEtab.fonction_representant?.trim() ? { fonction_representant: newEtab.fonction_representant.trim() } : {}),
        ...(newEtab.telephone_representant?.trim() ? { telephone_representant: newEtab.telephone_representant.trim() } : {}),
        ...(newEtab.email_representant?.trim() ? { email_representant: newEtab.email_representant.trim() } : {}),
      };

      const created = await etablissements.create(payload);
      setDemandes((prev) => [created, ...prev]);
      toast.success('Hôpital ajouté', `L'établissement « ${created.nom} » a été ajouté avec succès.`);
      setAddModalOpen(false);
      setNewEtab({
        nom: '',
        type: 'hopital',
        ville: '',
        adresse: '',
        telephone: '',
        email: '',
        nom_representant: '',
        prenom_representant: '',
        fonction_representant: '',
        telephone_representant: '',
        email_representant: '',
      });
    } catch (err) {
      const msg = toDisplayMessage(err);
      toast.error("Erreur lors de l'ajout", msg);
    } finally {
      setIsSubmittingNew(false);
    }
  };

  // Statistiques calculées
  const stats = useMemo(() => {
    const enAttente = demandes.filter((d) => d.statut === 'en_attente').length;
    const valides = demandes.filter((d) => d.statut === 'valide').length;
    const refuses = demandes.filter((d) => d.statut === 'refuse').length;
    return {
      total: demandes.length,
      enAttente,
      valides,
      refuses,
    };
  }, [demandes]);

  // Données filtrées
  const demandesFiltrees = useMemo(() => {
    return demandes
      .filter((item) => {
        if (filtreStatut !== 'tous' && item.statut !== filtreStatut) {
          return false;
        }
        if (recherche.trim()) {
          const q = recherche.toLowerCase();
          const { representant } = extraireInfosEtablissement(item);
          const matchNom = item.nom?.toLowerCase().includes(q);
          const matchVille = item.ville?.toLowerCase().includes(q);
          const matchEmail = item.email?.toLowerCase().includes(q);
          const matchTel = item.telephone?.toLowerCase().includes(q);
          const matchRep = representant.nom?.toLowerCase().includes(q);
          return matchNom || matchVille || matchEmail || matchTel || matchRep;
        }
        return true;
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [demandes, filtreStatut, recherche]);

  return (
    <div className="space-y-6">
      {/* En-tête Page Super Admin */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8BD2F2]/20 text-[#0E1B2A] text-xs font-bold mb-2">
            <Hospital className="w-3.5 h-3.5" />
            <span>Administration Centrale Dotobase</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0E1B2A]">
            Hôpitaux
          </h1>
          <p className="text-sm text-[#6E7C91] mt-1">
            Gérez les structures de santé et validez l&apos;adhésion au réseau Dotobase.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un hôpital</span>
          </Button>
        </div>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div
          onClick={() => setFiltreStatut('en_attente')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filtreStatut === 'en_attente'
              ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-300/40'
              : 'bg-white border-[#E3EDF7] hover:border-amber-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              En attente
            </span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-[#0E1B2A] mt-2">{stats.enAttente}</p>
          <span className="text-[11px] text-[#6E7C91]">Nécessite une validation</span>
        </div>

        <div
          onClick={() => setFiltreStatut('valide')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filtreStatut === 'valide'
              ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-300/40'
              : 'bg-white border-[#E3EDF7] hover:border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Validés
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-[#0E1B2A] mt-2">{stats.valides}</p>
          <span className="text-[11px] text-[#6E7C91]">Établissements actifs</span>
        </div>

        <div
          onClick={() => setFiltreStatut('refuse')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filtreStatut === 'refuse'
              ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-300/40'
              : 'bg-white border-[#E3EDF7] hover:border-rose-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
              Refusés
            </span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-extrabold text-[#0E1B2A] mt-2">{stats.refuses}</p>
          <span className="text-[11px] text-[#6E7C91]">Dossiers non retenus</span>
        </div>

        <div
          onClick={() => setFiltreStatut('tous')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filtreStatut === 'tous'
              ? 'bg-slate-100 border-slate-300 ring-2 ring-slate-300/40'
              : 'bg-white border-[#E3EDF7] hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Total
            </span>
            <Building2 className="w-4 h-4 text-slate-600" />
          </div>
          <p className="text-2xl font-extrabold text-[#0E1B2A] mt-2">{stats.total}</p>
          <span className="text-[11px] text-[#6E7C91]">Toutes les demandes</span>
        </div>
      </div>

      {/* Messages d'alerte et de succès */}
      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-emerald-800 text-sm">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button
            onClick={() => setActionSuccess(null)}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-rose-800 text-sm">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-rose-700 hover:text-rose-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Barre de recherche et onglets de filtres */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E3EDF7]">
        {/* Recherche */}
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6E7C91]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Rechercher hôpital, ville, contact..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-[#E3EDF7] bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8BD2F2]"
          />
        </div>

        {/* Filtres statuts */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setFiltreStatut('en_attente')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              filtreStatut === 'en_attente'
                ? 'bg-amber-100 text-amber-900'
                : 'text-[#6E7C91] hover:bg-slate-100'
            }`}
          >
            En attente ({stats.enAttente})
          </button>
          <button
            onClick={() => setFiltreStatut('valide')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              filtreStatut === 'valide'
                ? 'bg-emerald-100 text-emerald-900'
                : 'text-[#6E7C91] hover:bg-slate-100'
            }`}
          >
            Validés ({stats.valides})
          </button>
          <button
            onClick={() => setFiltreStatut('refuse')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              filtreStatut === 'refuse'
                ? 'bg-rose-100 text-rose-900'
                : 'text-[#6E7C91] hover:bg-slate-100'
            }`}
          >
            Refusés ({stats.refuses})
          </button>
          <button
            onClick={() => setFiltreStatut('tous')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              filtreStatut === 'tous'
                ? 'bg-slate-200 text-slate-900'
                : 'text-[#6E7C91] hover:bg-slate-100'
            }`}
          >
            Tous ({stats.total})
          </button>
        </div>
      </div>

      {/* Tableau des hôpitaux */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Spinner size="lg" />
          <p className="text-sm text-[#6E7C91]">Chargement des hôpitaux...</p>
        </div>
      ) : demandesFiltrees.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-[#E3EDF7] p-8">
          <Hospital className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#0E1B2A]">Aucun hôpital trouvé</h3>
          <p className="text-xs text-[#6E7C91] mt-1 max-w-sm mx-auto">
            {recherche
              ? 'Aucun établissement ne correspond à votre recherche.'
              : filtreStatut === 'en_attente'
                ? 'Aucun établissement en attente de validation.'
                : filtreStatut === 'valide'
                  ? 'Aucun établissement validé pour le moment.'
                  : filtreStatut === 'refuse'
                    ? 'Aucun établissement refusé.'
                    : 'Aucun établissement enregistré pour le moment.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E3EDF7] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-[#E3EDF7]">
                  <th className="py-3.5 px-4 text-[11px] font-bold tracking-wider text-[#6E7C91] uppercase">
                    RÉFÉRENCE
                  </th>
                  <th className="py-3.5 px-4 text-[11px] font-bold tracking-wider text-[#6E7C91] uppercase">
                    ÉTABLISSEMENT / VILLE
                  </th>
                  <th className="py-3.5 px-4 text-[11px] font-bold tracking-wider text-[#6E7C91] uppercase">
                    COORDONNÉES
                  </th>
                  <th className="py-3.5 px-4 text-[11px] font-bold tracking-wider text-[#6E7C91] uppercase">
                    RÉFÉRENT
                  </th>
                  <th className="py-3.5 px-4 text-[11px] font-bold tracking-wider text-[#6E7C91] uppercase">
                    STATUT
                  </th>
                  <th className="py-3.5 px-4 text-[11px] font-bold tracking-wider text-[#6E7C91] uppercase">
                    DATE D&apos;ADHÉSION
                  </th>
                  <th className="py-3.5 px-4 text-[11px] font-bold tracking-wider text-[#6E7C91] uppercase text-right">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {demandesFiltrees.map((etab) => {
                  const isEnAttente = etab.statut === 'en_attente';
                  const isValide = etab.statut === 'valide';
                  const isRefuse = etab.statut === 'refuse';
                  const isActing = actionLoadingId === etab.id;
                  const { adresseAffichee, representant } = extraireInfosEtablissement(etab);
                  const refCode = etab.id ? etab.id.replace(/-/g, '').slice(0, 8).toUpperCase() : 'REF';

                  return (
                    <tr
                      key={etab.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      {/* Référence */}
                      <td className="py-3.5 px-4 whitespace-nowrap align-middle">
                        <span className="font-mono font-bold text-xs text-[#D14343] tracking-wider">
                          {refCode}
                        </span>
                      </td>

                      {/* Établissement / Ville */}
                      <td className="py-3.5 px-4 align-middle">
                        <div className="font-bold text-sm text-[#0E1B2A]">
                          {etab.nom}
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#6E7C91] mt-0.5">
                          <span className="font-medium text-[#0E1B2A]/80">
                            {TYPES_LABELS[etab.type] || etab.type}
                          </span>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            {etab.ville} {adresseAffichee ? `(${adresseAffichee})` : ''}
                          </span>
                        </div>
                      </td>

                      {/* Coordonnées */}
                      <td className="py-3.5 px-4 align-middle">
                        {etab.telephone ? (
                          <div className="flex items-center gap-1 text-xs text-[#0E1B2A] font-mono">
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{etab.telephone}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                        {etab.email && (
                          <div className="flex items-center gap-1 text-xs text-[#6E7C91] mt-0.5 truncate max-w-[180px]">
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{etab.email}</span>
                          </div>
                        )}
                      </td>

                      {/* Référent */}
                      <td className="py-3.5 px-4 align-middle">
                        {representant.nom ? (
                          <>
                            <div className="font-semibold text-xs text-[#0E1B2A] flex items-center gap-1">
                              <User className="w-3 h-3 text-[#8BD2F2] shrink-0" />
                              <span>{representant.nom}</span>
                            </div>
                            <div className="text-[11px] text-[#6E7C91] mt-0.5">
                              {representant.fonction || representant.telephone || 'Référent'}
                            </div>
                          </>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>

                      {/* Statut */}
                      <td className="py-3.5 px-4 whitespace-nowrap align-middle">
                        {isEnAttente && (
                          <Badge variant="warning" className="inline-flex items-center gap-1 text-[11px] font-bold">
                            <Clock className="w-3 h-3" />
                            <span>En attente</span>
                          </Badge>
                        )}
                        {isValide && (
                          <Badge variant="success" className="inline-flex items-center gap-1 text-[11px] font-bold">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Validé</span>
                          </Badge>
                        )}
                        {isRefuse && (
                          <div>
                            <Badge variant="error" className="inline-flex items-center gap-1 text-[11px] font-bold">
                              <XCircle className="w-3 h-3" />
                              <span>Refusé</span>
                            </Badge>
                            {etab.motif_refus && (
                              <div className="text-[10px] text-rose-600 mt-1 max-w-[140px] truncate" title={etab.motif_refus}>
                                {etab.motif_refus}
                              </div>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Date d'adhésion */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-xs text-[#0E1B2A] align-middle">
                        {formaterDate(etab.created_at)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-right align-middle">
                        <div className="flex items-center justify-end gap-2">
                          {isEnAttente ? (
                            <>
                              <button
                                onClick={() => ouvrirModalRefus(etab.id, etab.nom)}
                                disabled={isActing}
                                className="px-2.5 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                title="Refuser la demande"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Refuser</span>
                              </button>
                              <button
                                onClick={() => ouvrirModalApprobation(etab.id, etab.nom, etab.ville)}
                                disabled={isActing}
                                className="px-2.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all shadow-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                title="Accepter la demande"
                              >
                                {isActing ? (
                                  <Spinner size="sm" className="border-white border-t-transparent" />
                                ) : (
                                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                                )}
                                <span>Accepter</span>
                              </button>
                            </>
                          ) : isRefuse ? (
                            <button
                              onClick={() => ouvrirModalApprobation(etab.id, etab.nom, etab.ville)}
                              disabled={isActing}
                              className="px-2.5 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Réactiver</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => ouvrirModalRefus(etab.id, etab.nom)}
                              disabled={isActing}
                              className="px-2.5 py-1.5 text-xs font-semibold text-[#6E7C91] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            >
                              Suspendre
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modale d'ajout d'hôpital */}
      <Modal
        open={addModalOpen}
        onClose={() => {
          if (!isSubmittingNew) {
            setAddModalOpen(false);
            setFormErrors({});
          }
        }}
        title="Ajouter un hôpital"
        size="lg"
      >
        <form onSubmit={handleCreerEtablissement} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nom */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-[#0E1B2A] mb-1">
                Nom de l&apos;établissement <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ex: Centre Hospitalier Universitaire Hubert Koutoukou Maga"
                value={newEtab.nom}
                onChange={(e) => setNewEtab({ ...newEtab, nom: e.target.value })}
                className={`w-full rounded-lg border p-2.5 text-xs text-[#0E1B2A] placeholder-[#6E7C91] focus:outline-none focus:ring-1 focus:ring-[#8BD2F2] ${
                  formErrors.nom ? 'border-rose-400 bg-rose-50/20' : 'border-[#E3EDF7]'
                }`}
              />
              {formErrors.nom && (
                <p className="text-[11px] text-rose-500 mt-1">{formErrors.nom}</p>
              )}
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-medium text-[#0E1B2A] mb-1">
                Type d&apos;établissement <span className="text-rose-500">*</span>
              </label>
              <select
                value={newEtab.type}
                onChange={(e) => setNewEtab({ ...newEtab, type: e.target.value as Etablissement['type'] })}
                className="w-full rounded-lg border border-[#E3EDF7] p-2.5 text-xs text-[#0E1B2A] bg-white focus:outline-none focus:ring-1 focus:ring-[#8BD2F2]"
              >
                <option value="hopital">Hôpital Public / CHU</option>
                <option value="clinique">Clinique Privée</option>
                <option value="dispensaire">Polyclinique / Dispensaire</option>
                <option value="cabinet">Cabinet Médical</option>
                <option value="autre">Autre structure de santé</option>
              </select>
            </div>

            {/* Ville */}
            <div>
              <label className="block text-xs font-medium text-[#0E1B2A] mb-1">
                Ville <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ex: Cotonou, Porto-Novo, Parakou..."
                value={newEtab.ville}
                onChange={(e) => setNewEtab({ ...newEtab, ville: e.target.value })}
                className={`w-full rounded-lg border p-2.5 text-xs text-[#0E1B2A] placeholder-[#6E7C91] focus:outline-none focus:ring-1 focus:ring-[#8BD2F2] ${
                  formErrors.ville ? 'border-rose-400 bg-rose-50/20' : 'border-[#E3EDF7]'
                }`}
              />
              {formErrors.ville && (
                <p className="text-[11px] text-rose-500 mt-1">{formErrors.ville}</p>
              )}
            </div>

            {/* Adresse */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-[#0E1B2A] mb-1">
                Adresse complète
              </label>
              <input
                type="text"
                placeholder="Ex: Quartier Cadjèhoun, Avenue Jean-Paul II"
                value={newEtab.adresse || ''}
                onChange={(e) => setNewEtab({ ...newEtab, adresse: e.target.value })}
                className="w-full rounded-lg border border-[#E3EDF7] p-2.5 text-xs text-[#0E1B2A] placeholder-[#6E7C91] focus:outline-none focus:ring-1 focus:ring-[#8BD2F2]"
              />
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-xs font-medium text-[#0E1B2A] mb-1">
                Téléphone de l&apos;établissement
              </label>
              <input
                type="tel"
                placeholder="Ex: +229 01 23 45 67"
                value={newEtab.telephone || ''}
                onChange={(e) => setNewEtab({ ...newEtab, telephone: e.target.value })}
                className="w-full rounded-lg border border-[#E3EDF7] p-2.5 text-xs text-[#0E1B2A] placeholder-[#6E7C91] focus:outline-none focus:ring-1 focus:ring-[#8BD2F2]"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-[#0E1B2A] mb-1">
                Email de contact
              </label>
              <input
                type="email"
                placeholder="Ex: contact@chu-mel.bj"
                value={newEtab.email || ''}
                onChange={(e) => setNewEtab({ ...newEtab, email: e.target.value })}
                className="w-full rounded-lg border border-[#E3EDF7] p-2.5 text-xs text-[#0E1B2A] placeholder-[#6E7C91] focus:outline-none focus:ring-1 focus:ring-[#8BD2F2]"
              />
            </div>
          </div>

          {/* Section Référent */}
          <div className="pt-3 border-t border-[#E3EDF7]">
            <h4 className="text-xs font-bold text-[#0E1B2A] mb-2.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#8BD2F2]" />
              <span>Référent / Directeur de l&apos;établissement (optionnel)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-[#6E7C91] mb-1">
                  Nom du référent
                </label>
                <input
                  type="text"
                  placeholder="Ex: Mensah"
                  value={newEtab.nom_representant || ''}
                  onChange={(e) => setNewEtab({ ...newEtab, nom_representant: e.target.value })}
                  className="w-full rounded-lg border border-[#E3EDF7] p-2 text-xs text-[#0E1B2A] focus:outline-none focus:ring-1 focus:ring-[#8BD2F2]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#6E7C91] mb-1">
                  Prénom
                </label>
                <input
                  type="text"
                  placeholder="Ex: Jean"
                  value={newEtab.prenom_representant || ''}
                  onChange={(e) => setNewEtab({ ...newEtab, prenom_representant: e.target.value })}
                  className="w-full rounded-lg border border-[#E3EDF7] p-2 text-xs text-[#0E1B2A] focus:outline-none focus:ring-1 focus:ring-[#8BD2F2]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#6E7C91] mb-1">
                  Fonction
                </label>
                <input
                  type="text"
                  placeholder="Ex: Directeur Général"
                  value={newEtab.fonction_representant || ''}
                  onChange={(e) => setNewEtab({ ...newEtab, fonction_representant: e.target.value })}
                  className="w-full rounded-lg border border-[#E3EDF7] p-2 text-xs text-[#0E1B2A] focus:outline-none focus:ring-1 focus:ring-[#8BD2F2]"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E3EDF7]">
            <button
              type="button"
              onClick={() => {
                setAddModalOpen(false);
                setFormErrors({});
              }}
              disabled={isSubmittingNew}
              className="px-4 py-2 text-xs font-semibold text-[#6E7C91] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmittingNew}
              className="px-4 py-2 text-xs font-bold text-[#0E1B2A] bg-[#8BD2F2] hover:bg-[#74C5E9] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
            >
              {isSubmittingNew ? (
                <Spinner size="sm" className="border-[#0E1B2A] border-t-transparent" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )}
              <span>Ajouter l&apos;établissement</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Modale de confirmation d'approbation */}
      <Modal
        open={approbationModalOpen}
        onClose={() => {
          if (!actionLoadingId) {
            setApprobationModalOpen(false);
            setApprobationCible(null);
          }
        }}
        title="Accepter la demande d'adhésion"
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-xl bg-emerald-50 border border-emerald-200/60 p-3.5 text-emerald-900 text-xs">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-emerald-950">
                Validation de l&apos;établissement de santé
              </p>
              <p className="text-emerald-800 leading-relaxed">
                Vous êtes sur le point de valider l&apos;adhésion de{' '}
                <strong className="font-bold text-emerald-950">
                  « {approbationCible?.nom} »
                </strong>
                {approbationCible?.ville ? ` situé à ${approbationCible.ville}` : ''} au réseau Dotobase.
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-200/70 p-3.5 space-y-2 text-xs text-slate-600">
            <p className="font-semibold text-slate-800">Effets immédiats de la validation :</p>
            <ul className="list-disc list-inside space-y-1 pl-1 text-slate-600">
              <li>L&apos;établissement passera au statut <span className="font-bold text-emerald-700">Validé</span>.</li>
              <li>La structure pourra enregistrer et administrer ses praticiens.</li>
              <li>L&apos;accès à la gestion des patients et aux dossiers médicaux partagés sera activé.</li>
            </ul>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E3EDF7]">
            <button
              type="button"
              onClick={() => {
                setApprobationModalOpen(false);
                setApprobationCible(null);
              }}
              disabled={Boolean(actionLoadingId)}
              className="px-4 py-2 text-xs font-semibold text-[#6E7C91] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={confirmerApprobation}
              disabled={Boolean(actionLoadingId)}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-sm"
            >
              {actionLoadingId ? (
                <Spinner size="sm" className="border-white border-t-transparent" />
              ) : (
                <Check className="w-3.5 h-3.5" strokeWidth={3} />
              )}
              <span>Confirmer l&apos;acceptation</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* Modale de motif de refus */}
      <Modal
        open={refusModalOpen}
        onClose={() => {
          if (!actionLoadingId) {
            setRefusModalOpen(false);
            setRefusCible(null);
          }
        }}
        title="Refuser la demande d'adhésion"
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg bg-amber-50 p-3 text-amber-800 text-xs">
            <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
            <p>
              Vous vous apprêtez à rejeter la demande pour l&apos;établissement{' '}
              <strong className="font-semibold">{refusCible?.nom}</strong>.
              Vous pouvez préciser le motif du refus ci-dessous.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#0E1B2A] mb-1.5">
              Raison / Motif du refus (optionnel)
            </label>
            <textarea
              value={motifRefus}
              onChange={(e) => setMotifRefus(e.target.value)}
              placeholder="Ex: Pièces justificatives incomplètes, établissement non joignable..."
              rows={4}
              className="w-full rounded-lg border border-[#E3EDF7] p-3 text-xs text-[#0E1B2A] placeholder-[#6E7C91] focus:border-[#8BD2F2] focus:outline-none focus:ring-1 focus:ring-[#8BD2F2]"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#E3EDF7]">
            <button
              type="button"
              onClick={() => {
                setRefusModalOpen(false);
                setRefusCible(null);
              }}
              disabled={Boolean(actionLoadingId)}
              className="px-4 py-2 text-xs font-semibold text-[#6E7C91] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={confirmerRefus}
              disabled={Boolean(actionLoadingId)}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {actionLoadingId ? (
                <Spinner size="sm" className="border-white border-t-transparent" />
              ) : (
                <X className="w-3.5 h-3.5" />
              )}
              <span>Confirmer le refus</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
