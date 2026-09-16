'use client';

import React, { useEffect, useState } from 'react';
import {
  Plus,
  User,
  MapPin,
  AlertTriangle,
  Lock,
  ShieldCheck,
  Stethoscope,
  FileText,
  Send,
  ExternalLink,
  ChevronRight,
  PlusCircle,
  Pill,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Spinner from '@/components/ui/spinner';
import { api, toDisplayMessage } from '@/lib/api';
import { toast } from '@/components/ui/toast';
import type { Consultation, Diagnostic, Patient, Traitement } from '@/lib/api/types';

export default function PatientMedicalFilePage() {
  const router = useRouter();
  const params = useParams();
  const patientId = params?.npi as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);
  const [traitements, setTraitements] = useState<Traitement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!patientId) return;

    let cancelled = false;

    async function loadPatientFile() {
      setIsLoading(true);
      try {
        const [pRes, cRes, dRes, tRes] = await Promise.allSettled([
          api.patients.get(patientId),
          api.consultations.list({ patient_id: patientId }),
          api.diagnostics.list({ patient_id: patientId }),
          api.traitements.list({ patient_id: patientId }),
        ]);

        if (cancelled) return;

        if (pRes.status === 'fulfilled') {
          setPatient(pRes.value);
        } else {
          toast.error('Patient introuvable', toDisplayMessage(pRes.reason));
        }

        if (cRes.status === 'fulfilled') setConsultations(cRes.value);
        if (dRes.status === 'fulfilled') setDiagnostics(dRes.value);
        if (tRes.status === 'fulfilled') setTraitements(tRes.value);
      } catch (err) {
        toast.error('Erreur de chargement', toDisplayMessage(err));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadPatientFile();
    return () => {
      cancelled = true;
    };
  }, [patientId]);

  const calculerAge = (dateNaissance?: string) => {
    if (!dateNaissance) return '-';
    const naissance = new Date(dateNaissance);
    const diff = Date.now() - naissance.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900">Dossier introuvable</h2>
        <p className="text-sm text-slate-500 mt-1 mb-6">
          Le patient demandé n'a pas été trouvé ou a été supprimé.
        </p>
        <button
          onClick={() => router.push('/patients')}
          className="px-4 py-2 bg-[#00A1C9] text-white rounded-lg text-sm font-semibold"
        >
          Retour à la liste des patients
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 pb-10">
      {/* Patient Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 bg-slate-100 rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex items-center justify-center shrink-0 text-slate-500 font-bold text-2xl">
            {patient.prenom[0]}
            {patient.nom[0]}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-slate-900">
                {patient.prenom} {patient.nom}
              </h1>
              <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-md border border-slate-200">
                ID: {patient.id.slice(0, 8)}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <span className="flex items-center gap-1.5 font-medium">
                <User size={14} className="text-slate-400" />
                {calculerAge(patient.date_naissance)} ans • {patient.sexe === 'M' ? 'Masculin' : 'Féminin'}
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <MapPin size={14} className="text-slate-400" />
                {patient.adresse || 'Bénin'}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => router.push(`/patients/${patient.id}/consultations/new`)}
          className="bg-[#00A1C9] hover:bg-[#008BB0] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm shrink-0 w-full sm:w-auto justify-center cursor-pointer"
        >
          <Plus size={18} />
          Nouvelle consultation
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Main Info) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Navigation Tabs */}
          <div className="border-b border-slate-200">
            <nav className="flex gap-8">
              <span className="border-b-2 border-[#00A1C9] text-[#00A1C9] font-bold pb-3 px-1 text-sm">
                Consultations ({consultations.length})
              </span>
            </nav>
          </div>

          {/* Alertes Médicales / Groupe Sanguin */}
          <div className="bg-[#FFF5F5] rounded-xl border border-[#FFE0E0] border-l-4 border-l-[#D14343] p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={18} className="text-[#D14343]" strokeWidth={2.5} />
              <h3 className="text-[15px] font-bold text-[#D14343]">Informations Cliniques</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="bg-[#FFEBEB] text-[#D14343] text-[11px] font-bold px-3 py-1.5 rounded-md border border-[#FFD6D6]">
                Groupe Sanguin : {patient.groupe_sanguin || 'Non renseigné'}
              </span>
              <span className="bg-slate-100 text-slate-600 text-[11px] font-bold px-3 py-1.5 rounded-md border border-slate-200">
                Statut : Dossier actif
              </span>
            </div>
          </div>

          {/* Diagnostics and Traitements Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Diagnostics */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h3 className="text-[15px] font-bold text-slate-900 mb-4">Diagnostics ({diagnostics.length})</h3>
              <div className="flex flex-col gap-4">
                {diagnostics.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Aucun diagnostic enregistré.</p>
                ) : (
                  diagnostics.map((diag) => (
                    <div key={diag.id} className="flex items-start gap-3">
                      <div className="bg-[#8BD2F2] text-[#0E1B2A] text-xs font-bold px-2 py-1 rounded-md shrink-0 mt-0.5">
                        {diag.type || 'Diag'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{diag.commentaire || 'Sans commentaire'}</p>
                        <p className="text-xs text-[#00A1C9] font-medium">Sévérité : {diag.severite || 'Standard'}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Traitements Actuels */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[15px] font-bold text-slate-900">Traitements ({traitements.length})</h3>
              </div>
              <div className="flex flex-col gap-4">
                {traitements.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Aucun traitement en cours.</p>
                ) : (
                  traitements.map((t) => (
                    <div key={t.id} className="flex justify-between items-start border-b border-slate-50 pb-2">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{t.medicament_libre || 'Médicament'}</p>
                        <p className="text-xs text-slate-500">{t.dosage} - {t.frequence}</p>
                      </div>
                      <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                        {t.statut || 'En cours'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Dernières Consultations */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h3 className="text-[15px] font-bold text-slate-900 mb-5">Historique des Consultations</h3>
            {consultations.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Aucune consultation pour ce patient.</p>
            ) : (
              <div className="relative border-l border-slate-200 ml-2 space-y-6 pb-2">
                {consultations.map((c) => {
                  const dateStr = new Date(c.date_consultation).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  });

                  return (
                    <div key={c.id} className="relative pl-6">
                      <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#00A1C9] border-2 border-white box-content"></div>
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{c.motif}</h4>
                          <p className="text-xs text-slate-500 font-medium">Type : {c.type}</p>
                        </div>
                        <span className="text-xs font-semibold text-slate-500">{dateStr}</span>
                      </div>
                      {c.notes && (
                        <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 mt-2">
                          <p className="text-[13px] text-slate-600 italic">"{c.notes}"</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Sidebar Widgets) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Résumé Médical */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h3 className="text-[15px] font-bold text-slate-900 mb-4">Résumé Dossier</h3>
            <div className="grid grid-cols-3 gap-2 mb-5">
              <div className="bg-[#F0F7FF] rounded-lg p-3 text-center border border-[#E6F0FF]">
                <p className="text-xl font-bold text-[#00A1C9]">{consultations.length}</p>
                <p className="text-[10px] font-bold text-[#00A1C9] uppercase">CONSULT.</p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3 text-center border border-emerald-100">
                <p className="text-xl font-bold text-emerald-600">{diagnostics.length}</p>
                <p className="text-[10px] font-bold text-emerald-600 uppercase">DIAGNOSTICS</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 text-center border border-purple-100">
                <p className="text-xl font-bold text-purple-600">{traitements.length}</p>
                <p className="text-[10px] font-bold text-purple-600 uppercase">TRAITEMENTS</p>
              </div>
            </div>
          </div>

          {/* Actions Rapides */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h3 className="text-[15px] font-bold text-slate-900 mb-4">Actions Rapides</h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => router.push(`/patients/${patient.id}/consultations/new`)}
                className="flex items-center gap-3 w-full p-3 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-[#00A1C9] transition-all group text-left cursor-pointer"
              >
                <Stethoscope size={18} className="text-[#00A1C9]" />
                <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">
                  Nouvelle consultation
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
