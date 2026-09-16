'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Filter,
  KeyRound,
  MapPin,
  MoreVertical,
  Plus,
  RefreshCw,
  Search,
  Send,
  ShieldAlert,
  Stethoscope,
  User,
  UserCheck,
  Users,
  X,
  Zap,
} from 'lucide-react';
import Spinner from '@/components/ui/spinner';
import { api, toDisplayMessage } from '@/lib/api';
import { useAuth, nomAffiche } from '@/lib/hooks/use-auth';
import type { Consultation, Medecin, Patient } from '@/lib/api/types';

export default function ConsultationsPage() {
  const router = useRouter();
  const { user, etablissementActif } = useAuth();

  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [medecins, setMedecins] = useState<Medecin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [derniereMiseAJour, setDerniereMiseAJour] = useState<string>('');

  // Filtres
  const [filtreStatut, setFiltreStatut] = useState<string>('tous');
  const [filtreType, setFiltreType] = useState<string>('tous');
  const [filtreMedecin, setFiltreMedecin] = useState<string>('tous');
  const [recherche, setRecherche] = useState<string>('');

  // Modale Nouvelle Consultation
  const [isModalNouvelleConsultationOpen, setIsModalNouvelleConsultationOpen] = useState(false);
  const [recherchePatientModal, setRecherchePatientModal] = useState('');

  const chargerDonnees = async () => {
    setIsLoading(true);
    try {
      const [consultationsRes, patientsRes, medecinsRes] = await Promise.allSettled([
        api.consultations.list(),
        api.patients.list(),
        api.medecins.list(),
      ]);

      if (consultationsRes.status === 'fulfilled') {
        setConsultations(consultationsRes.value);
      }
      if (patientsRes.status === 'fulfilled') {
        setPatients(patientsRes.value);
      }
      if (medecinsRes.status === 'fulfilled') {
        setMedecins(medecinsRes.value);
      }

      const maintenant = new Date();
      setDerniereMiseAJour(
        maintenant.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      );
    } catch {
      // Conservation des données en cas d'erreur de chargement
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    chargerDonnees();
  }, []);

  // Indicateurs statistiques
  const aujourdhuiStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const stats = useMemo(() => {
    const total = consultations.length;
    const aujourdhui = consultations.filter((c) =>
      c.date_consultation.startsWith(aujourdhuiStr)
    ).length;
    const enCours = consultations.filter((c) => c.statut === 'en_cours').length;
    const terminees = consultations.filter((c) => c.statut === 'terminee').length;
    const urgences = consultations.filter((c) => c.type === 'urgence').length;
    const annulees = consultations.filter((c) => c.statut === 'annulee').length;

    return { total, aujourdhui, enCours, terminees, urgences, annulees };
  }, [consultations, aujourdhuiStr]);

  // Consultation triées de la plus récente à la plus ancienne
  const consultationsTriees = useMemo(() => {
    return [...consultations].sort(
      (a, b) =>
        new Date(b.date_consultation).getTime() - new Date(a.date_consultation).getTime()
    );
  }, [consultations]);

  // Consultations filtrées selon les critères de l'utilisateur
  const consultationsFiltrees = useMemo(() => {
    return consultationsTriees.filter((c) => {
      // Filtre statut
      if (filtreStatut !== 'tous' && c.statut !== filtreStatut) {
        return false;
      }

      // Filtre type
      if (filtreType !== 'tous' && c.type !== filtreType) {
        return false;
      }

      // Filtre médecin
      if (filtreMedecin === 'moi' && user?.id) {
        if (c.medecin_id !== user.id) return false;
      } else if (filtreMedecin !== 'tous' && filtreMedecin !== 'moi') {
        if (c.medecin_id !== filtreMedecin) return false;
      }

      // Recherche par texte (nom du patient, motif, nom du médecin)
      if (recherche.trim().length > 0) {
        const query = recherche.toLowerCase();
        const patient = patients.find((p) => p.id === c.patient_id);
        const medecin = medecins.find((m) => m.id === c.medecin_id);
        const patientNomComplet = patient
          ? `${patient.nom} ${patient.prenom}`.toLowerCase()
          : '';
        const medecinNomComplet = medecin
          ? `${medecin.nom} ${medecin.prenom}`.toLowerCase()
          : '';
        const motif = (c.motif || '').toLowerCase();

        return (
          patientNomComplet.includes(query) ||
          medecinNomComplet.includes(query) ||
          motif.includes(query)
        );
      }

      return true;
    });
  }, [consultationsTriees, filtreStatut, filtreType, filtreMedecin, recherche, patients, medecins, user]);

  // Trouver un patient par son ID
  const getPatient = (patientId: string) => {
    return patients.find((p) => p.id === patientId);
  };

  // Trouver un médecin par son ID
  const getMedecin = (medecinId: string) => {
    return medecins.find((m) => m.id === medecinId);
  };

  // Nom d'affichage du médecin
  const formatNomMedecin = (medecinId: string) => {
    if (user && user.id === medecinId) {
      return nomAffiche(user) || 'Vous';
    }
    const medecin = getMedecin(medecinId);
    return medecin ? `Dr. ${medecin.nom}` : 'Dr. Inconnu';
  };

  // Formatage du type de consultation
  const formatType = (type: string) => {
    switch (type) {
      case 'urgence':
        return {
          libelle: 'Urgence',
          icon: <Zap size={14} className="text-rose-600 fill-rose-600" />,
          classe: 'bg-rose-50 text-rose-700 border-rose-200 font-bold',
        };
      case 'walk_in':
        return {
          libelle: 'Walk-in',
          icon: null,
          classe: 'bg-slate-100 text-slate-700 border-slate-200',
        };
      case 'telemedicine':
        return {
          libelle: 'Téléconsultation',
          icon: null,
          classe: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        };
      case 'rdv':
      default:
        return {
          libelle: 'RDV',
          icon: null,
          classe: 'bg-blue-50 text-[#0F5A9A] border-blue-200 font-medium',
        };
    }
  };

  // Formatage du statut
  const formatStatut = (statut: string) => {
    switch (statut) {
      case 'terminee':
        return {
          libelle: 'Terminée',
          classe: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
        };
      case 'annulee':
        return {
          libelle: 'Annulée',
          classe: 'bg-gray-100 text-gray-600 border-gray-200',
          dot: 'bg-gray-400',
        };
      case 'en_cours':
      default:
        return {
          libelle: 'En cours',
          classe: 'bg-blue-50 text-blue-700 border-blue-200',
          dot: 'bg-blue-500 animate-pulse',
        };
    }
  };

  // Formatage de la date
  const formatDateConsultation = (dateStr: string) => {
    const date = new Date(dateStr);
    const aujourdhui = new Date();
    const estAujourdhui = date.toDateString() === aujourdhui.toDateString();

    const heureStr = date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    if (estAujourdhui) {
      return `Aujourd'hui à ${heureStr}`;
    }

    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Export CSV
  const exporterConsultationsCSV = () => {
    const lignes = [
      ['Date & Heure', 'Patient', 'Médecin', 'Type', 'Statut', 'Motif'].join(';'),
      ...consultationsFiltrees.map((c) => {
        const p = getPatient(c.patient_id);
        const m = getMedecin(c.medecin_id);
        const patientNom = p ? `${p.nom} ${p.prenom}` : c.patient_id;
        const medecinNom = m ? `Dr. ${m.nom} ${m.prenom}` : c.medecin_id;
        const dateFormatted = new Date(c.date_consultation).toLocaleString('fr-FR');
        const motifClean = (c.motif || '').replace(/;/g, ',');
        return [
          `"${dateFormatted}"`,
          `"${patientNom}"`,
          `"${medecinNom}"`,
          `"${c.type}"`,
          `"${c.statut}"`,
          `"${motifClean}"`,
        ].join(';');
      }),
    ];

    const blob = new Blob([lignes.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `consultations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Patients filtrés pour la modale de nouvelle consultation
  const patientsPourModal = useMemo(() => {
    if (!recherchePatientModal.trim()) return patients.slice(0, 6);
    const q = recherchePatientModal.toLowerCase();
    return patients.filter(
      (p) =>
        p.nom.toLowerCase().includes(q) ||
        p.prenom.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
    );
  }, [patients, recherchePatientModal]);

  // Urgences & Priorités
  const prioritesEtAlertes = useMemo(() => {
    return consultationsTriees.filter((c) => c.type === 'urgence').slice(0, 3);
  }, [consultationsTriees]);

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 pb-12">
      {/* En-tête de la page */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Gestion des Consultations
          </h1>
          <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar size={14} className="text-slate-400" />
              {new Date().toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <span className="flex items-center gap-1.5 font-medium">
              <MapPin size={14} className="text-slate-400" />
              {etablissementActif?.ville || 'Cotonou, Bénin'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exporterConsultationsCSV}
            className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <Download size={16} />
            <span>Exporter la liste</span>
          </button>
          <button
            onClick={() => setIsModalNouvelleConsultationOpen(true)}
            className="px-4 py-2.5 bg-[#8BD2F2] hover:bg-[#74C5E9] text-[#0E1B2A] text-sm font-bold rounded-xl flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <Plus size={18} />
            <span>Nouvelle consultation</span>
          </button>
        </div>
      </div>

      {/* Cartes statistiques (KPIs) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Consultations */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-semibold text-slate-500">Total Consultations</span>
            {stats.aujourdhui > 0 ? (
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                +{stats.aujourdhui} auj.
              </span>
            ) : (
              <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                0 auj.
              </span>
            )}
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {isLoading ? <Spinner size="sm" /> : stats.total}
          </h3>
        </div>

        {/* Aujourd'hui */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col justify-between">
          <div className="mb-2">
            <span className="text-[11px] font-semibold text-slate-500">Aujourd'hui</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {isLoading ? <Spinner size="sm" /> : stats.aujourdhui}
          </h3>
        </div>

        {/* En cours */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-semibold text-slate-500">En cours</span>
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#0F5A9A]">
            {isLoading ? <Spinner size="sm" /> : stats.enCours}
          </h3>
        </div>

        {/* Terminées */}
        <div className="bg-[#F0FDF4] rounded-xl shadow-sm border border-[#DCFCE7] p-4 flex flex-col justify-between">
          <div className="mb-2">
            <span className="text-[11px] font-semibold text-emerald-800">Terminées</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-emerald-700">
            {isLoading ? <Spinner size="sm" /> : stats.terminees}
          </h3>
        </div>

        {/* Urgences */}
        <div className="bg-[#FFF5F5] rounded-xl shadow-sm border border-[#FFE0E0] p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-semibold text-rose-800">Urgences</span>
            <Zap size={14} className="text-rose-600 fill-rose-600" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-rose-600">
            {isLoading ? <Spinner size="sm" /> : stats.urgences}
          </h3>
        </div>

        {/* Annulées */}
        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col justify-between">
          <div className="mb-2">
            <span className="text-[11px] font-semibold text-slate-500">Annulées</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-600">
            {isLoading ? <Spinner size="sm" /> : stats.annulees}
          </h3>
        </div>
      </div>

      {/* Barre de filtres et recherche */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Filtre Statut */}
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-slate-400" />
            <select
              value={filtreStatut}
              onChange={(e) => setFiltreStatut(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-white focus:outline-none focus:border-[#0F5A9A]"
            >
              <option value="tous">Filtrer par Statut</option>
              <option value="en_cours">En cours</option>
              <option value="terminee">Terminée</option>
              <option value="annulee">Annulée</option>
            </select>
          </div>

          {/* Filtre Type d'acte */}
          <select
            value={filtreType}
            onChange={(e) => setFiltreType(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-white focus:outline-none focus:border-[#0F5A9A]"
          >
            <option value="tous">Type d'acte (Tous)</option>
            <option value="rdv">RDV</option>
            <option value="urgence">Urgence</option>
            <option value="walk_in">Walk-in</option>
            <option value="telemedicine">Téléconsultation</option>
          </select>

          {/* Filtre Médecin */}
          <select
            value={filtreMedecin}
            onChange={(e) => setFiltreMedecin(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-white focus:outline-none focus:border-[#0F5A9A]"
          >
            <option value="tous">Tous les médecins</option>
            {user && <option value="moi">Mes consultations ({nomAffiche(user)})</option>}
            {medecins
              .filter((m) => !user || m.id !== user.id)
              .map((m) => (
                <option key={m.id} value={m.id}>
                  Dr. {m.nom} {m.prenom}
                </option>
              ))}
          </select>
        </div>

        {/* Champ de recherche */}
        <div className="relative w-full md:w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Recherche rapide (patient, médecin, motif)..."
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0F5A9A]"
          />
          {recherche && (
            <button
              onClick={() => setRecherche('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Grille principale : Consultations récentes (gauche) & Panneaux latéraux (droite) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Colonne gauche (2/3) : Consultations Récentes & Dernière Activité */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Tableau Consultations Récentes */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Consultations Récentes</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Effectuées et suivies par les praticiens de l'établissement
                </p>
              </div>
              <div className="flex items-center gap-3">
                {derniereMiseAJour && (
                  <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                    Mis à jour à {derniereMiseAJour}
                  </span>
                )}
                <button
                  onClick={chargerDonnees}
                  title="Actualiser la liste"
                  className="p-1.5 text-slate-400 hover:text-[#0F5A9A] hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                >
                  <RefreshCw size={15} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100">
                    <th className="py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      PATIENT
                    </th>
                    <th className="py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      MÉDECIN
                    </th>
                    <th className="py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      TYPE
                    </th>
                    <th className="py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      DATE &amp; HEURE
                    </th>
                    <th className="py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      STATUT
                    </th>
                    <th className="py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">
                      ACTION
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        <Spinner size="md" className="mx-auto" />
                        <p className="text-xs mt-2">Chargement des consultations...</p>
                      </td>
                    </tr>
                  ) : consultationsFiltrees.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500 text-sm">
                        Aucune consultation trouvée avec ces critères.
                      </td>
                    </tr>
                  ) : (
                    consultationsFiltrees.map((consultation) => {
                      const patient = getPatient(consultation.patient_id);
                      const patientNom = patient
                        ? `${patient.nom} ${patient.prenom}`
                        : `Patient #${consultation.patient_id.slice(0, 8)}`;
                      const initiales = patient
                        ? `${patient.prenom[0] || ''}${patient.nom[0] || ''}`.toUpperCase()
                        : 'PT';
                      const medecinNom = formatNomMedecin(consultation.medecin_id);
                      const typeBadge = formatType(consultation.type);
                      const statutBadge = formatStatut(consultation.statut);
                      const estMonActe = user && user.id === consultation.medecin_id;

                      return (
                        <tr
                          key={consultation.id}
                          className="hover:bg-slate-50/60 transition-colors group cursor-pointer"
                          onClick={() => router.push(`/patients/${consultation.patient_id}`)}
                        >
                          {/* Patient */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 border border-blue-200">
                                {initiales}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-900 group-hover:text-[#0F5A9A] transition-colors">
                                  {patientNom}
                                </p>
                                <p className="text-[11px] text-slate-400">
                                  {consultation.motif || 'Consultation générale'}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Médecin */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              <p
                                className={`text-xs font-semibold ${
                                  consultation.type === 'urgence'
                                    ? 'text-rose-700 font-bold'
                                    : 'text-slate-800'
                                }`}
                              >
                                {medecinNom}
                              </p>
                              {estMonActe && (
                                <span className="text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-bold">
                                  Vous
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Type */}
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs border ${typeBadge.classe}`}
                            >
                              {typeBadge.icon}
                              <span>{typeBadge.libelle}</span>
                            </span>
                          </td>

                          {/* Date & Heure */}
                          <td className="py-3.5 px-4">
                            <span className="text-xs text-slate-600 font-medium">
                              {formatDateConsultation(consultation.date_consultation)}
                            </span>
                          </td>

                          {/* Statut */}
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold border ${statutBadge.classe}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${statutBadge.dot}`}></span>
                              <span>{statutBadge.libelle}</span>
                            </span>
                          </td>

                          {/* Action */}
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/patients/${consultation.patient_id}`);
                              }}
                              className="text-slate-400 hover:text-[#0F5A9A] p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                              title="Voir le dossier patient"
                            >
                              <Eye size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section Dernière Activité */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h2 className="text-base font-bold text-slate-900 mb-4">Dernière Activité</h2>
            {consultationsTriees.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Aucune activité récente enregistrée.</p>
            ) : (
              <div className="relative border-l-2 border-slate-100 ml-3 space-y-5 pb-1">
                {consultationsTriees.slice(0, 4).map((c, index) => {
                  const patient = getPatient(c.patient_id);
                  const medecin = getMedecin(c.medecin_id);
                  const patientNom = patient ? `${patient.prenom} ${patient.nom}` : 'le patient';
                  const medecinNom = medecin ? `Dr. ${medecin.nom}` : 'le praticien';
                  const dateStr = formatDateConsultation(c.date_consultation);

                  return (
                    <div key={c.id || index} className="relative pl-6">
                      <div className="absolute -left-[17px] top-0.5 w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-[#0F5A9A]">
                        {c.statut === 'terminee' ? (
                          <CheckCircle2 size={16} className="text-emerald-600" />
                        ) : c.type === 'urgence' ? (
                          <Zap size={16} className="text-rose-600" />
                        ) : (
                          <Stethoscope size={16} className="text-[#0F5A9A]" />
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <p className="text-xs font-bold text-slate-900">
                          Consultation {c.statut === 'terminee' ? 'terminée' : 'effectuée'} par{' '}
                          {medecinNom} pour {patientNom}
                        </p>
                        <span className="text-[11px] text-slate-400">{dateStr}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Motif : {c.motif || 'Suivi clinique régulier'}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Colonne droite (1/3) : Priorités & Alertes + Actions Rapides */}
        <div className="w-full flex flex-col gap-6">
          {/* Priorités & Alertes */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center gap-2">
              <ShieldAlert size={18} className="text-rose-600" />
              <h2 className="text-sm font-bold text-slate-900">Priorités &amp; Alertes</h2>
            </div>

            <div className="p-4 flex flex-col gap-3">
              {/* Carte alerte urgence */}
              {prioritesEtAlertes.length > 0 ? (
                <div className="border-l-4 border-l-rose-600 bg-rose-50/50 p-3 rounded-r-lg border border-rose-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">
                      ALERTE URGENCE
                    </span>
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-1.5 py-0.2 rounded">
                      IMMÉDIAT
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Dossier - {getPatient(prioritesEtAlertes[0].patient_id)?.nom ? `${getPatient(prioritesEtAlertes[0].patient_id)?.prenom} ${getPatient(prioritesEtAlertes[0].patient_id)?.nom}` : 'Patient'}
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                    {prioritesEtAlertes[0].motif || 'Consultation urgente'}
                  </p>
                </div>
              ) : (
                <div className="border border-slate-100 bg-slate-50/50 p-3 rounded-lg text-center">
                  <p className="text-xs text-slate-500">Aucune alerte d&apos;urgence en cours.</p>
                </div>
              )}

              {/* Carte suivi critique */}
              {consultationsTriees.some((c) => c.statut === 'en_cours') ? (
                (() => {
                  const enCours = consultationsTriees.find((c) => c.statut === 'en_cours')!;
                  const p = getPatient(enCours.patient_id);
                  return (
                    <div className="border-l-4 border-l-blue-600 bg-blue-50/50 p-3 rounded-r-lg border border-blue-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">
                          EN COURS
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {p ? `${p.prenom} ${p.nom}` : 'Patient'} - {enCours.motif || 'Consultation'}
                      </h4>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                        Prise en charge active dans l&apos;établissement.
                      </p>
                    </div>
                  );
                })()
              ) : (
                <div className="border border-slate-100 bg-slate-50/50 p-3 rounded-lg text-center">
                  <p className="text-xs text-slate-500">Aucun patient en cours de consultation.</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions Rapides */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h2 className="text-sm font-bold text-slate-900 mb-3">Actions Rapides</h2>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => setIsModalNouvelleConsultationOpen(true)}
                className="w-full bg-[#8BD2F2] hover:bg-[#74C5E9] text-[#0E1B2A] py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                <Plus size={16} />
                <span>Nouvelle consultation</span>
              </button>

              <button
                onClick={() => router.push('/patients')}
                className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-slate-200 transition-colors cursor-pointer"
              >
                <Eye size={15} />
                <span>Voir la liste des patients</span>
              </button>

              <button
                onClick={exporterConsultationsCSV}
                className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-slate-200 transition-colors cursor-pointer"
              >
                <FileSpreadsheet size={15} />
                <span>Générer rapport export (CSV)</span>
              </button>

              <button
                onClick={() => router.push('/acces')}
                className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-slate-200 transition-colors cursor-pointer"
              >
                <KeyRound size={15} />
                <span>Demander accès dossier</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modale Nouvelle consultation : Sélection rapide du patient */}
      {isModalNouvelleConsultationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Nouvelle Consultation</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sélectionnez le patient pour démarrer la consultation
                </p>
              </div>
              <button
                onClick={() => setIsModalNouvelleConsultationOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4">
              {/* Barre de recherche patient */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={recherchePatientModal}
                  onChange={(e) => setRecherchePatientModal(e.target.value)}
                  placeholder="Rechercher par nom, prénom ou ID..."
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0F5A9A]"
                  autoFocus
                />
              </div>

              {/* Liste des patients */}
              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                {patientsPourModal.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    Aucun patient trouvé.
                  </div>
                ) : (
                  patientsPourModal.map((patient) => (
                    <button
                      key={patient.id}
                      onClick={() => {
                        setIsModalNouvelleConsultationOpen(false);
                        router.push(`/patients/${patient.id}/consultations/new`);
                      }}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-[#0F5A9A] hover:bg-blue-50/50 transition-all text-left cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {`${patient.prenom[0] || ''}${patient.nom[0] || ''}`.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 group-hover:text-[#0F5A9A]">
                            {patient.nom} {patient.prenom}
                          </p>
                          <p className="text-xs text-slate-400">
                            {patient.sexe === 'M' ? 'Masculin' : 'Féminin'} • ID: {patient.id.slice(0, 8)}
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-slate-400 group-hover:text-[#0F5A9A]" />
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setIsModalNouvelleConsultationOpen(false);
                  router.push('/patients');
                }}
                className="text-xs font-semibold text-[#0F5A9A] hover:underline cursor-pointer"
              >
                + Ajouter un nouveau patient
              </button>
              <button
                onClick={() => setIsModalNouvelleConsultationOpen(false)}
                className="px-4 py-2 bg-white border border-slate-200 text-xs font-bold rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
