'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Activity,
  AlertTriangle,
  ClipboardList,
  UserCircle2,
  FileText,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';
import Spinner from '@/components/ui/spinner';
import { api } from '@/lib/api';
import { useAuth, nomAffiche } from '@/lib/hooks/use-auth';
import type { Consultation, Patient } from '@/lib/api/types';

export default function DashboardPage() {
  const { user, etablissementActif } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setIsLoading(true);
      try {
        const [patientsRes, consultationsRes] = await Promise.allSettled([
          api.patients.list(),
          api.consultations.list(),
        ]);

        if (cancelled) return;

        if (patientsRes.status === 'fulfilled') {
          setPatients(patientsRes.value);
        }
        if (consultationsRes.status === 'fulfilled') {
          setConsultations(consultationsRes.value);
        }
      } catch {
        // En cas d'erreur de chargement réseau, on garde les états par défaut
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalPatients = patients.length;
  const consultationsEnCours = consultations.filter((c) => c.statut === 'en_cours').length;
  const consultationsTerminees = consultations.filter((c) => c.statut === 'terminee').length;
  const dernieresConsultations = [...consultations]
    .sort((a, b) => new Date(b.date_consultation).getTime() - new Date(a.date_consultation).getTime())
    .slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F5A9A] tracking-tight">Tableau de bord</h1>
          <p className="text-sm text-gray-500 mt-1">
            Bon retour, {nomAffiche(user) || 'Docteur'}. Voici le résumé de votre activité.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Card 1 : Patients */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#0F5A9A] flex items-center justify-center">
              <Users size={20} strokeWidth={2} />
            </div>
            <span className="text-xs font-semibold text-gray-500">Base</span>
          </div>
          <div className="mt-auto">
            {isLoading ? (
              <Spinner size="sm" />
            ) : (
              <h3 className="text-3xl font-bold text-gray-900 leading-none">{totalPatients}</h3>
            )}
            <p className="text-sm text-gray-500 mt-1">Patients enregistrés</p>
          </div>
        </div>

        {/* Card 2 : En cours */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Activity size={20} strokeWidth={2} />
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
              En cours
            </div>
          </div>
          <div className="mt-auto">
            {isLoading ? (
              <Spinner size="sm" />
            ) : (
              <h3 className="text-3xl font-bold text-gray-900 leading-none">
                {consultationsEnCours}
              </h3>
            )}
            <p className="text-sm text-gray-500 mt-1">Consultation(s) en cours</p>
          </div>
        </div>

        {/* Card 3 : Consultations totales */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ClipboardList size={20} strokeWidth={2} />
            </div>
            <span className="text-xs font-semibold text-gray-500">Total</span>
          </div>
          <div className="mt-auto">
            {isLoading ? (
              <Spinner size="sm" />
            ) : (
              <h3 className="text-3xl font-bold text-gray-900 leading-none">{consultations.length}</h3>
            )}
            <p className="text-sm text-gray-500 mt-1">Consultations effectuées</p>
          </div>
        </div>

        {/* Card 4 : Terminées */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck size={20} strokeWidth={2} />
            </div>
            <span className="text-xs font-semibold text-emerald-700">Validées</span>
          </div>
          <div className="mt-auto">
            {isLoading ? (
              <Spinner size="sm" />
            ) : (
              <h3 className="text-3xl font-bold text-gray-900 leading-none">
                {consultationsTerminees}
              </h3>
            )}
            <p className="text-sm text-gray-500 mt-1">Dossiers clôturés</p>
          </div>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Activité Récente */}
        <div className="flex-1 w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-[15px] font-bold text-gray-900">Activité Récente</h2>
            <Link href="/dossiers-medicaux" className="text-sm font-semibold text-[#0F5A9A] hover:underline">
              Voir les dossiers
            </Link>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="py-12 flex justify-center">
                <Spinner size="md" />
              </div>
            ) : dernieresConsultations.length === 0 ? (
              <div className="py-12 text-center text-gray-500 text-sm">
                Aucune consultation récente enregistrée.
              </div>
            ) : (
              <div className="relative border-l-2 border-gray-100 ml-3 space-y-6 pb-4">
                {dernieresConsultations.map((consultation) => {
                  const patient = patients.find((p) => p.id === consultation.patient_id);
                  const patientNom = patient
                    ? `${patient.prenom} ${patient.nom}`
                    : 'Patient #' + consultation.patient_id.slice(0, 8);
                  const dateStr = new Date(consultation.date_consultation).toLocaleDateString(
                    'fr-FR',
                    { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }
                  );

                  return (
                    <div key={consultation.id} className="relative pl-6">
                      <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-[#0F5A9A]">
                        <UserCircle2 size={16} />
                      </div>
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-sm font-bold text-gray-900">
                          {patientNom}
                        </h4>
                        <span className="text-xs text-gray-400 font-medium">{dateStr}</span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">
                        Motif : {consultation.motif || 'Consultation de routine'}
                      </p>
                      <span
                        className={`inline-flex px-2 py-0.5 text-xs font-bold rounded ${
                          consultation.statut === 'terminee'
                            ? 'bg-emerald-100 text-emerald-700'
                            : consultation.statut === 'en_cours'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {consultation.statut === 'terminee'
                          ? 'Terminée'
                          : consultation.statut === 'en_cours'
                          ? 'En cours'
                          : 'Planifiée'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
          {/* Calendar Widget */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-[15px] font-bold text-gray-900 mb-4">Date du jour</h2>
            <div className="bg-[#F8FAFC] rounded-lg p-4 border border-gray-100 text-center">
              <span className="text-xs font-bold text-[#0F5A9A] uppercase tracking-wider">
                Aujourd'hui
              </span>
              <p className="text-xl font-bold text-gray-900 mt-1 capitalize">
                {new Date().toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Security Banner */}
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl shadow-sm p-4 flex items-center gap-4 text-white">
            <div className="shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="font-bold text-[15px]">Système Sécurisé</h3>
              <p className="text-xs text-emerald-50/90 font-medium leading-tight">
                Authentification forte &amp; traçabilité des dossiers
              </p>
            </div>
          </div>

          {/* Établissement Actif */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Établissement actif
            </h3>
            <p className="font-bold text-gray-900 text-sm">
              {etablissementActif?.nom || 'Dotobase Médical'}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {etablissementActif?.ville || 'Bénin'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

