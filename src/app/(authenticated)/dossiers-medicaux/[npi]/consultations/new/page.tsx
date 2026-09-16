'use client';

import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  MoreVertical, 
  Search, 
  X, 
  Edit3, 
  Activity, 
  Droplet, 
  Pill, 
  FileText, 
  FileDown, 
  CheckCircle2, 
  Clock, 
  Circle,
  Plus,
  ShieldCheck,
  Folder,
  RefreshCw,
  FlaskConical,
  CheckSquare,
  Square,
  ArrowLeft,
  HeartPulse,
  TrendingUp,
  AlertCircle,
  Stethoscope,
  Save,
  Microscope,
  ChevronRight,
  FileUp,
  Paperclip,
  ChevronDown,
  Link2,
  Calendar,
  Printer,
  Trash2,
  Pen,
  Download,
  Send
} from 'lucide-react';
import Link from 'next/link';

export default function NewConsultationPage() {
  const [isStepModalOpen, setIsStepModalOpen] = useState(false);
  const [isDiagnosticModalOpen, setIsDiagnosticModalOpen] = useState(false);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [isTraitementModalOpen, setIsTraitementModalOpen] = useState(false);
  const [isOrdonnanceModalOpen, setIsOrdonnanceModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 pb-24">
      
      {/* Top Patient Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-[#8BD2F2] rounded-xl flex items-center justify-center shrink-0">
            <User size={24} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-slate-900">M. A. Codjo</h2>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
              <span>32 ans, Masculin</span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span>NPI: 329875421</span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span className="bg-[#FFEBEB] text-[#D14343] text-[10px] font-bold px-2 py-0.5 rounded border border-[#FFD6D6]">
                HTN
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#F0FDF4] border border-[#DCFCE7] text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold">
            <Lock size={14} />
            Statut : Autorisé
          </div>
          <button className="text-slate-400 hover:text-slate-600 transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Consultation Flow) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Step 1: Anamnèse & Motif */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#8BD2F2] text-[#0E1B2A] flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h3 className="text-base font-bold text-slate-900">Anamnèse & Motif</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Édition Active</span>
            </div>
            
            <div className="p-6 flex flex-col gap-5">
              {/* Motif Principal */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Motif Principal</label>
                <input 
                  type="text" 
                  defaultValue="Douleur thoracique"
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#8BD2F2] focus:ring-1 focus:ring-[#8BD2F2]"
                />
              </div>

              {/* Symptômes Identifiés */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Symptômes identifiés</label>
                <div className="relative mb-3">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Ajouter un symptôme..."
                    className="w-full border border-slate-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#8BD2F2] focus:ring-1 focus:ring-[#8BD2F2]"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="flex items-center gap-1.5 bg-[#F0F7FF] text-[#8BD2F2] border border-[#E6F0FF] px-3 py-1.5 rounded-lg text-xs font-medium">
                    Douleur thoracique
                    <button className="text-[#8BD2F2] hover:text-[#5EB8DD]"><X size={12} /></button>
                  </span>
                  <span className="flex items-center gap-1.5 bg-[#F0F7FF] text-[#8BD2F2] border border-[#E6F0FF] px-3 py-1.5 rounded-lg text-xs font-medium">
                    Essoufflement
                    <button className="text-[#8BD2F2] hover:text-[#5EB8DD]"><X size={12} /></button>
                  </span>
                  <span className="flex items-center gap-1.5 bg-[#F0F7FF] text-[#8BD2F2] border border-[#E6F0FF] px-3 py-1.5 rounded-lg text-xs font-medium">
                    Fatigue
                    <button className="text-[#8BD2F2] hover:text-[#5EB8DD]"><X size={12} /></button>
                  </span>
                </div>
              </div>

              {/* Description Clinique */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Description Clinique</label>
                <textarea 
                  rows={4}
                  defaultValue="Le patient présente une douleur thoracique progressive accompagnée d'un essoufflement depuis 3 jours avec fatigue persistante"
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#8BD2F2] focus:ring-1 focus:ring-[#8BD2F2] resize-none leading-relaxed"
                />
              </div>

              {/* Bottom Split: Niveau d'urgence & Note du praticien */}
              <div className="grid grid-cols-2 gap-6 mt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Niveau d'urgence</label>
                  <div className="flex p-1 bg-slate-50 rounded-lg border border-slate-100">
                    <button className="flex-1 text-xs font-semibold text-slate-500 py-2 rounded-md hover:text-slate-700 transition-colors">Léger</button>
                    <button className="flex-1 text-xs font-bold text-[#8BD2F2] bg-white py-2 rounded-md shadow-sm border border-slate-200 transition-all">Modéré</button>
                    <button className="flex-1 text-xs font-semibold text-slate-500 py-2 rounded-md hover:text-slate-700 transition-colors">Grave</button>
                    <button className="flex-1 text-xs font-semibold text-slate-500 py-2 rounded-md hover:text-slate-700 transition-colors">Critique</button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Note du praticien</label>
                  <textarea 
                    rows={2}
                    defaultValue="Suspicion hypertension non contrôlée avec risque cardiovasculaire"
                    className="w-full bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-slate-300 resize-none italic"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Step 2: Diagnostic CIM-10 */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h3 className="text-base font-bold text-slate-900">Diagnostic CIM-10</h3>
              </div>
              <span className="bg-[#E6F4EA] text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-md border border-[#CEEAD6]">
                Principal
              </span>
            </div>
            <div className="p-5 flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900 mb-1">I10 - Hypertension essentielle (primaire)</p>
                <p className="text-xs text-slate-500 font-medium">Gravité : Modéré</p>
              </div>
              <button className="text-slate-400 hover:text-[#8BD2F2] transition-colors p-2 hover:bg-slate-50 rounded-lg">
                <Edit3 size={18} />
              </button>
            </div>
          </div>

          {/* Step 3: Examens Complémentaires */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-500 text-white flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h3 className="text-base font-bold text-slate-900">Examens Complémentaires</h3>
              </div>
              <span className="bg-[#E6F0FF] text-[#8BD2F2] text-[10px] font-bold px-2 py-1 rounded-md border border-[#CCE0FF]">
                En attente
              </span>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl bg-slate-50/50">
                  <div className="w-8 h-8 rounded-lg bg-[#E6F0FF] text-[#8BD2F2] flex items-center justify-center shrink-0">
                    <Activity size={16} />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Électrocardiogramme (ECG)</span>
                </div>
                <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl bg-slate-50/50">
                  <div className="w-8 h-8 rounded-lg bg-[#FFEBEB] text-[#D14343] flex items-center justify-center shrink-0">
                    <Droplet size={16} />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Analyse sanguine</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4: Traitement */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#8BD2F2] text-[#0E1B2A] flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h3 className="text-base font-bold text-slate-900">Traitement</h3>
            </div>
            <div className="p-5">
              <div className="border border-slate-200 rounded-xl p-4 mb-3 bg-white shadow-sm flex items-start gap-3">
                <div className="mt-0.5 text-emerald-500">
                  <Pill size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Amlodipine 5mg</p>
                  <p className="text-xs text-slate-500 mt-1">1 comprimé par jour - 30 jours</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold border border-slate-200">
                  <Activity size={12} /> Contrôle tension
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold border border-slate-200">
                  <FileText size={12} /> Régime faible en sel
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (Sidebar) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* Ordonnance Médicale */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[15px] font-bold text-slate-900 flex items-center gap-2">
                <FileText size={18} className="text-[#8BD2F2]" />
                Ordonnance Médicale
              </h3>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono text-slate-400">ID: #ORD-2026-000045</span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                <CheckCircle2 size={12} /> Signée
              </span>
            </div>

            <div className="flex flex-col gap-3 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-slate-700">Amlodipine 5mg</span>
                <span className="font-bold text-slate-900">x30</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-slate-700">Aspirine 100mg</span>
                <span className="font-bold text-slate-900">x14</span>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-lg text-xs font-bold transition-colors">
              <FileDown size={16} />
              Télécharger PDF
            </button>
          </div>

          {/* Documents joints */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-bold text-slate-900">Documents joints</h3>
              <span className="bg-[#8BD2F2] text-[#0E1B2A] text-[10px] font-bold px-2 py-0.5 rounded-full">
                2 fichiers
              </span>
            </div>
            
            <div className="flex flex-col gap-3 mb-4">
              <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText size={16} className="text-[#D14343]" />
                  <span className="text-xs font-semibold text-slate-700">ECG.pdf</span>
                </div>
                <button className="text-slate-400 hover:text-slate-700">
                  <FileDown size={14} />
                </button>
              </div>
              <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText size={16} className="text-[#D14343]" />
                  <span className="text-xs font-semibold text-slate-700">Analyse_sang.pdf</span>
                </div>
                <button className="text-slate-400 hover:text-slate-700">
                  <FileDown size={14} />
                </button>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 border border-dashed border-slate-300 hover:border-slate-400 text-slate-500 hover:text-slate-700 py-3 rounded-lg text-xs font-semibold transition-colors bg-slate-50">
              <Plus size={14} />
              Ajouter un document
            </button>
          </div>

          {/* Parcours de soin */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[15px] font-bold text-slate-900">Parcours de soin</h3>
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            </div>
            
            <div className="relative border-l border-slate-200 ml-3 space-y-6 pb-2">
              
              {/* Terminée */}
              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-emerald-100 border-2 border-white text-emerald-600 flex items-center justify-center box-content">
                  <CheckCircle2 size={12} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-0.5">Terminée</p>
                  <h4 className="text-sm font-bold text-slate-900">Diagnostic CIM-10</h4>
                  <p className="text-xs text-slate-500 mt-1">I10 - Hypertension essentielle</p>
                </div>
              </div>

              {/* En attente */}
              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-[#E6F0FF] border-2 border-white text-[#8BD2F2] flex items-center justify-center box-content">
                  <Clock size={12} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#8BD2F2] uppercase tracking-wider mb-0.5">En attente</p>
                  <h4 className="text-sm font-bold text-slate-900">Examens demandés</h4>
                  <p className="text-xs text-slate-500 mt-1">ECG & Bilan sanguin</p>
                </div>
              </div>

              {/* A venir */}
              <div className="relative pl-6">
                <div className="absolute -left-[7px] top-0.5 w-3 h-3 rounded-full bg-slate-200 border-2 border-white box-content"></div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">A venir</p>
                  <h4 className="text-sm font-bold text-slate-500">Validation Traitement</h4>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-slate-200 p-4 px-8 flex items-center justify-between z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <span className="text-xs font-semibold text-slate-500">
          Données sauvegardées il y a 2 heures
        </span>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsStepModalOpen(true)}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-[#8BD2F2] text-sm font-bold hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            Ajouter une étape
          </button>
          <button className="px-5 py-2.5 rounded-xl bg-[#E6F0FF] text-[#8BD2F2] text-sm font-bold hover:bg-[#CCE0FF] transition-colors">
            Sauvegarder
          </button>
          <button className="px-5 py-2.5 rounded-xl bg-[#8BD2F2] text-[#0E1B2A] text-sm font-bold hover:bg-[#74C5E9] transition-colors">
            Terminer consultation
          </button>
        </div>
      </div>

      {/* Ajouter une étape Modal */}
      {isStepModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl relative overflow-hidden flex flex-col p-6">
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-bold text-[#8BD2F2] uppercase tracking-wider">AJOUTER UNE ÉTAPE</h2>
              <button 
                onClick={() => setIsStepModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Stethoscope, label: 'Diagnostic', onClick: () => { setIsStepModalOpen(false); setIsDiagnosticModalOpen(true); } },
                { icon: FlaskConical, label: 'Examens', onClick: () => { setIsStepModalOpen(false); setIsExamModalOpen(true); } },
                { icon: Pill, label: 'Traitement', onClick: () => { setIsStepModalOpen(false); setIsTraitementModalOpen(true); } },
                { icon: FileText, label: 'Ordonnance', onClick: () => { setIsStepModalOpen(false); setIsOrdonnanceModalOpen(true); } },
                { icon: Folder, label: 'Documents' },
                { icon: RefreshCw, label: 'Suivi' },
                { icon: Activity, label: 'Examen Clinique' },
                { icon: ShieldCheck, label: 'Audit' },
              ].map((item, index) => (
                <button 
                  key={index}
                  onClick={item.onClick}
                  className="flex flex-col items-center justify-center gap-3 p-6 border border-slate-200 rounded-xl hover:border-[#8BD2F2] hover:bg-[#F0F7FF] transition-all group"
                >
                  <div className="text-slate-400 group-hover:text-[#8BD2F2]">
                    <item.icon size={24} strokeWidth={1.5} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 group-hover:text-[#8BD2F2]">{item.label}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-end mt-auto border-t border-slate-100 pt-4">
              <button 
                onClick={() => setIsStepModalOpen(false)}
                className="px-6 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Fermer
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Diagnostic Form Modal */}
      {isDiagnosticModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-[#F8FAFC] rounded-xl w-full max-w-5xl h-[90vh] shadow-2xl relative flex flex-col overflow-hidden border border-slate-200">
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
              
              {/* Header Blocks */}
              <div className="flex flex-col md:flex-row gap-4">
                {/* Patient Info */}
                <div className="bg-white rounded-xl border border-slate-200 p-3 flex-1 flex items-center gap-3 shadow-sm">
                  <div className="w-10 h-10 bg-blue-50 text-[#8BD2F2] rounded-lg flex items-center justify-center shrink-0">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">A. Codjo</h3>
                    <p className="text-xs text-slate-500">ID: C-001 | 32 ans | Homme</p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="bg-white rounded-xl border border-slate-200 p-3 flex-1 flex flex-col items-center justify-center shadow-sm">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">GROUPE SANGUIN</span>
                  <span className="text-sm font-bold text-[#8BD2F2]">O+</span>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-3 flex-1 flex flex-col items-center justify-center shadow-sm">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">TENSION ART.</span>
                  <span className="text-sm font-bold text-[#D14343]">145/95</span>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-3 flex-1 flex flex-col items-center justify-center shadow-sm">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">FRÉQ. CARD.</span>
                  <span className="text-sm font-bold text-[#8BD2F2]">78 bpm</span>
                </div>

                {/* Status */}
                <div className="bg-white rounded-xl border border-slate-200 p-3 flex-[1.5] flex flex-col items-center justify-center shadow-sm relative">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">STATUT</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    <span className="text-sm font-bold text-slate-700">Sous surveillance</span>
                  </div>
                </div>
              </div>

              {/* Alert */}
              <div className="bg-white rounded-xl border border-slate-200 border-l-4 border-l-[#D14343] p-4 shadow-sm flex items-start gap-3">
                <AlertCircle size={18} className="text-[#D14343] mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-[#D14343]">Pathologie Cardiovasculaire Détectée</h4>
                  <p className="text-xs text-[#D14343]/80 font-medium mt-0.5">Risque modéré identifié. Un contrôle complet est requis dans les 7 jours suivant cette consultation.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column (Main Form) */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  
                  {/* Recherche CIM-10 */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <Search size={16} className="text-[#8BD2F2]" strokeWidth={2.5} />
                      <h3 className="text-[15px] font-bold text-slate-900">Recherche CIM-10</h3>
                    </div>
                    
                    <div className="relative mb-4">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        defaultValue="Hypertension"
                        className="w-full border border-slate-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-slate-900 bg-slate-50 focus:outline-none focus:border-[#8BD2F2] focus:ring-1 focus:ring-[#8BD2F2]"
                      />
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider w-20">CODE</th>
                            <th className="pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">DESCRIPTION</th>
                            <th className="pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">ACTION</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr>
                            <td className="py-3 text-sm font-bold text-slate-900">I10</td>
                            <td className="py-3 text-sm text-slate-700">Hypertension essentielle (primaire)</td>
                            <td className="py-3 text-right">
                              <button className="text-sm font-bold text-[#8BD2F2] hover:underline">Ajouter</button>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 text-sm font-bold text-slate-900">I20</td>
                            <td className="py-3 text-sm text-slate-700">Angine de poitrine</td>
                            <td className="py-3 text-right">
                              <button className="text-sm font-bold text-[#8BD2F2] hover:underline">Ajouter</button>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 text-sm font-bold text-slate-900">E11</td>
                            <td className="py-3 text-sm text-slate-700">Diabète de type 2</td>
                            <td className="py-3 text-right">
                              <button className="text-sm font-bold text-[#8BD2F2] hover:underline">Ajouter</button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Diagnostic Actuel */}
                  <div className="bg-white rounded-xl border border-[#8BD2F2]/20 p-5 shadow-sm relative overflow-hidden">
                    {/* Tiny blue bar on top for emphasis */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-[#8BD2F2]"></div>
                    
                    <div className="flex items-center gap-2 mb-5 mt-1">
                      <CheckSquare size={16} className="text-[#8BD2F2]" strokeWidth={2.5} />
                      <h3 className="text-[15px] font-bold text-slate-900">Diagnostic Actuel</h3>
                    </div>

                    <div className="flex flex-col gap-5">
                      {/* Diagnostic Principal */}
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2">Diagnostic Principal</label>
                        <div className="flex items-center justify-between border border-[#8BD2F2]/30 bg-[#F0F7FF] rounded-lg p-2 pr-3">
                          <div className="flex items-center gap-3">
                            <div className="bg-[#8BD2F2] text-[#0E1B2A] text-xs font-bold px-2 py-1.5 rounded-md">
                              I10
                            </div>
                            <span className="text-sm font-bold text-slate-900">Hypertension essentielle</span>
                          </div>
                          <button className="text-slate-400 hover:text-slate-600">
                            <X size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Diagnostics Secondaires */}
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2">Diagnostics Secondaires</label>
                        <div className="flex flex-wrap gap-2 items-center">
                          <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-lg px-2 py-1.5">
                            <span className="text-xs font-bold text-slate-900">E66</span>
                            <span className="text-xs font-medium text-slate-700">Surpoids</span>
                            <button className="text-slate-400 hover:text-slate-600 ml-1"><X size={12} /></button>
                          </div>
                          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-slate-300 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors">
                            <Plus size={12} />
                            Ajouter secondaire
                          </button>
                        </div>
                      </div>

                      {/* Diagnostic Différentiel */}
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2">Diagnostic Différentiel</label>
                        <textarea 
                          placeholder="Saisir les diagnostics alternatifs..."
                          rows={3}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#8BD2F2] resize-none"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Column (Sidebar) */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                  
                  {/* Évaluation Clinique */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                    <h3 className="text-[15px] font-bold text-slate-900 mb-4">Évaluation Clinique</h3>
                    
                    <div className="mb-5">
                      <label className="block text-xs font-bold text-slate-500 mb-2">Gravité</label>
                      <div className="flex p-1 bg-slate-50 rounded-lg border border-slate-100">
                        <button className="flex-1 text-[11px] font-semibold text-slate-500 py-1.5 rounded hover:text-slate-700 transition-colors">Légère</button>
                        <button className="flex-1 text-[11px] font-bold text-[#8BD2F2] bg-[#E6F0FF] border border-[#CCE0FF] py-1.5 rounded transition-all">Modérée</button>
                        <button className="flex-1 text-[11px] font-semibold text-slate-500 py-1.5 rounded hover:text-slate-700 transition-colors">Sévère</button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2">Risque Cardiovasculaire</label>
                      <div className="w-full border border-amber-200 bg-amber-50/50 rounded-lg p-2.5 flex items-center justify-between cursor-pointer">
                        <span className="text-sm font-bold text-amber-700">Moyen</span>
                        <TrendingUp size={16} className="text-amber-500" />
                      </div>
                    </div>
                  </div>

                  {/* Observations */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                    <h3 className="text-[15px] font-bold text-slate-900 mb-4">Observations</h3>
                    
                    <div className="flex flex-col gap-3 mb-5">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="text-[#8BD2F2]">
                          <CheckSquare size={18} className="fill-[#8BD2F2] text-white" />
                        </div>
                        <span className="text-sm font-medium text-slate-900 group-hover:text-[#8BD2F2] transition-colors">Douleur thoracique légère</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="text-[#8BD2F2]">
                          <CheckSquare size={18} className="fill-[#8BD2F2] text-white" />
                        </div>
                        <span className="text-sm font-medium text-slate-900 group-hover:text-[#8BD2F2] transition-colors">Fatigue persistante</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="text-slate-300">
                          <Square size={18} />
                        </div>
                        <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Céphalées</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2">Analyse Clinique</label>
                      <textarea 
                        defaultValue="Tension légèrement élevée, surveillance recommandée. Patient à revoir rapidement."
                        rows={4}
                        className="w-full bg-slate-50 border border-slate-100 rounded-lg p-3 text-xs text-slate-700 focus:outline-none focus:border-slate-300 resize-none italic leading-relaxed"
                      ></textarea>
                    </div>
                  </div>

                  {/* Plan Diagnostic */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                    <h3 className="text-[15px] font-bold text-slate-900 mb-4">Plan Diagnostic</h3>
                    
                    <div className="flex flex-wrap gap-2 mb-5">
                      <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-xs font-bold">
                        <HeartPulse size={12} /> ECG
                      </span>
                      <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-xs font-bold">
                        <Activity size={12} /> Analyse Sanguine
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2">Objectif Thérapeutique</label>
                      <p className="text-sm text-slate-800 font-medium leading-snug">
                        Réduire tension artérielle et stabiliser patient
                      </p>
                    </div>
                  </div>

                </div>

              </div>

            </div>

            {/* Footer */}
            <div className="bg-slate-100 border-t border-slate-200 p-4 flex items-center justify-between shrink-0">
              <button 
                onClick={() => setIsDiagnosticModalOpen(false)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft size={16} />
                Retour consultation
              </button>
              
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-500 hover:bg-slate-600 text-white rounded-lg text-sm font-bold transition-colors shadow-sm">
                  <FileText size={16} />
                  Générer rapport
                </button>
                <button 
                  onClick={() => setIsDiagnosticModalOpen(false)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#8BD2F2] hover:bg-[#74C5E9] text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
                >
                  <CheckSquare size={16} />
                  Enregistrer Diagnostic
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Exam Form Modal */}
      {isExamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-[#F8FAFC] rounded-xl w-full max-w-5xl h-[90vh] shadow-2xl relative flex flex-col overflow-hidden border border-slate-200">
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 lg:p-8 flex flex-col gap-6">
              
              {/* Header */}
              <div className="flex flex-col gap-4 mb-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <span className="hover:text-slate-700 cursor-pointer">Patients</span>
                  <ChevronRight size={12} />
                  <span className="hover:text-slate-700 cursor-pointer">A. Codjo</span>
                  <ChevronRight size={12} />
                  <span className="text-slate-900">Ajouter un Examen</span>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Nouvel Examen Médical</h2>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="font-bold text-slate-900">A. Codjo</span>
                      <span className="text-slate-400">|</span>
                      <span className="text-slate-500">NPI: 229875421</span>
                      <span className="bg-[#E6F4EA] text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-md border border-[#CEEAD6]">
                        Dossier Actif
                      </span>
                    </div>
                  </div>
                  
                  <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 bg-white hover:bg-slate-50 transition-colors shadow-sm">
                    <Save size={16} />
                    Enregistrer Brouillon
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column (Main Form) */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  
                  {/* Informations Générales */}
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                      <FlaskConical size={18} className="text-[#8BD2F2]" strokeWidth={2.5} />
                      <h3 className="text-[15px] font-bold text-slate-900">Informations Générales</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6 mb-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2">Type d'examen</label>
                        <div className="relative">
                          <select className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-4 pr-10 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#8BD2F2] focus:ring-1 focus:ring-[#8BD2F2] cursor-pointer">
                            <option>Analyse biologique</option>
                            <option>Imagerie médicale</option>
                            <option>Exploration fonctionnelle</option>
                          </select>
                          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2">Priorité</label>
                        <div className="flex p-1 bg-white rounded-lg border border-slate-200 gap-1">
                          <button className="flex-1 text-xs font-semibold text-slate-500 py-2 rounded-md hover:bg-slate-50 transition-colors border border-transparent">Faible</button>
                          <button className="flex-1 text-xs font-semibold text-slate-500 py-2 rounded-md hover:bg-slate-50 transition-colors border border-transparent">Normale</button>
                          <button className="flex-1 text-xs font-bold text-[#D14343] bg-[#FFF5F5] py-2 rounded-md border border-[#FFD6D6] transition-all shadow-sm">Urgente</button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2">Nom précis de l'examen</label>
                      <input 
                        type="text" 
                        placeholder="Ex: NFS, Créatinémie, Scanner Thoracique..."
                        className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#8BD2F2] focus:ring-1 focus:ring-[#8BD2F2]"
                      />
                    </div>
                  </div>

                  {/* Contexte Clinique */}
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                      <FileText size={18} className="text-[#8BD2F2]" strokeWidth={2.5} />
                      <h3 className="text-[15px] font-bold text-slate-900">Contexte Clinique</h3>
                    </div>

                    <div className="flex flex-col gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2">Motif de la demande</label>
                        <textarea 
                          placeholder="Décrivez les symptômes ou la raison de l'examen..."
                          rows={3}
                          className="w-full bg-slate-50/50 border border-slate-200 rounded-lg p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#8BD2F2] focus:ring-1 focus:ring-[#8BD2F2] resize-none"
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2">Suspicion clinique / Diagnostic provisoire</label>
                        <textarea 
                          placeholder="Orientation diagnostique..."
                          rows={2}
                          className="w-full bg-slate-50/50 border border-slate-200 rounded-lg p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#8BD2F2] focus:ring-1 focus:ring-[#8BD2F2] resize-none"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Instructions spécifiques */}
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                      <FileText size={18} className="text-[#8BD2F2]" strokeWidth={2.5} />
                      <h3 className="text-[15px] font-bold text-slate-900">Instructions spécifiques</h3>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2">Consignes pour le laboratoire / plateau technique</label>
                      <textarea 
                        placeholder="Précisez les conditions (à jeun, injection produit contraste...)"
                        rows={3}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-lg p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#8BD2F2] focus:ring-1 focus:ring-[#8BD2F2] resize-none"
                      ></textarea>
                    </div>
                  </div>

                </div>

                {/* Right Column (Sidebar) */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                  
                  {/* Acheminement */}
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-[15px] font-bold text-slate-900 mb-5">Acheminement</h3>
                    
                    <div className="mb-6">
                      <label className="block text-xs font-bold text-slate-500 mb-2">Service de destination</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8BD2F2]">
                          <Microscope size={18} />
                        </div>
                        <select className="w-full appearance-none bg-slate-50/50 border border-slate-200 rounded-lg pl-10 pr-10 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#8BD2F2] cursor-pointer">
                          <option>BIO LAB</option>
                          <option>RADIOLOGIE</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2">Médecin demandeur</label>
                      <div className="flex items-center justify-between border border-slate-200 bg-slate-50 rounded-lg p-2 pr-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                            <User size={16} className="text-slate-500" />
                          </div>
                          <span className="text-sm font-bold text-slate-700">Dr. Hounkpatin</span>
                        </div>
                        <CheckCircle2 size={16} className="text-slate-400" />
                      </div>
                    </div>
                  </div>

                  {/* Pièces Jointes */}
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-[15px] font-bold text-slate-900 mb-5">Pièces Jointes</h3>
                    
                    <div className="flex flex-col gap-3">
                      <button className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 hover:border-[#8BD2F2] rounded-xl p-5 transition-colors group cursor-pointer bg-slate-50/50 hover:bg-[#F0F7FF]">
                        <FileUp size={24} className="text-slate-400 group-hover:text-[#8BD2F2]" />
                        <div className="text-center">
                          <p className="text-xs font-bold text-slate-700 group-hover:text-[#8BD2F2]">Joindre Ordonnance</p>
                          <p className="text-[10px] text-slate-500 mt-1">PDF, JPG (Max 5Mo)</p>
                        </div>
                      </button>
                      
                      <button className="flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                        <Paperclip size={14} />
                        Autres documents
                      </button>
                    </div>
                  </div>

                  {/* Metadata Info */}
                  <div className="flex flex-col gap-2 mt-2 px-2">
                    <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
                      <Clock size={12} />
                      Dernière modification : Aujourd'hui, 09:42
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
                      <Lock size={12} />
                      Données sécurisées (HDS/HIPAA)
                    </div>
                  </div>

                </div>

              </div>

            </div>

            {/* Footer */}
            <div className="bg-slate-100 border-t border-slate-200 p-4 flex items-center justify-between shrink-0">
              <button 
                onClick={() => setIsExamModalOpen(false)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft size={16} />
                Retour consultation
              </button>
              
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-500 hover:bg-slate-600 text-white rounded-lg text-sm font-bold transition-colors shadow-sm">
                  <FileText size={16} />
                  Générer rapport
                </button>
                <button 
                  onClick={() => setIsExamModalOpen(false)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#8BD2F2] hover:bg-[#74C5E9] text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
                >
                  <FlaskConical size={16} />
                  Enregistrer l'examen
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Traitement Form Modal */}
      {isTraitementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-[#F8FAFC] rounded-xl w-full max-w-5xl h-[90vh] shadow-2xl relative flex flex-col overflow-hidden border border-slate-200">
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 lg:p-8 flex flex-col gap-6">
              
              {/* Header */}
              <div className="flex flex-col gap-4 mb-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <span className="hover:text-slate-700 cursor-pointer">Patients</span>
                  <ChevronRight size={12} />
                  <span className="hover:text-slate-700 cursor-pointer">Dossier NPI: 229875421</span>
                  <ChevronRight size={12} />
                  <span className="text-slate-900">Traitement</span>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h2 className="text-2xl font-black text-slate-900">Ajouter un traitement</h2>
                  
                  <button 
                    onClick={() => setIsTraitementModalOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 bg-white hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <ArrowLeft size={16} />
                    Retour dossier patient
                  </button>
                </div>
              </div>

              {/* Top Patient Block */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-[#8BD2F2] font-bold text-lg rounded-xl flex items-center justify-center shrink-0">
                    AC
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">A. Codjo</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                      <span className="font-semibold text-slate-400">NPI:</span>
                      <span className="font-bold text-slate-700">229875421</span>
                      <span className="text-slate-300">|</span>
                      <span className="font-semibold text-slate-400">Âge:</span>
                      <span className="font-bold text-slate-700">32 ans</span>
                      <span className="text-slate-300">|</span>
                      <span className="font-semibold text-slate-400">Sexe:</span>
                      <span className="font-bold text-slate-700">Homme</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-right">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">DIAGNOSTIC PRINCIPAL</p>
                    <p className="text-sm font-bold text-[#8BD2F2]">I10 - Hypertension</p>
                  </div>
                  <div className="w-px h-8 bg-slate-200"></div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">CONSULTATION</p>
                    <p className="text-sm font-bold text-slate-900">C-001</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column (Main Form) */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  
                  {/* Sélection du Traitement */}
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-[15px] font-bold text-slate-900 mb-4">Sélection du Traitement</h3>
                    
                    <div className="relative mb-5">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        defaultValue="Amlodipine"
                        className="w-full border border-slate-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:border-[#8BD2F2] focus:ring-1 focus:ring-[#8BD2F2]"
                      />
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                          <tr>
                            <th className="py-2.5 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Molécule / Médicament</th>
                            <th className="py-2.5 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Classe</th>
                            <th className="py-2.5 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Dosages disp.</th>
                            <th className="py-2.5 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Statut</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr className="bg-[#F0F7FF]">
                            <td className="py-3 px-4 text-xs font-bold text-[#8BD2F2]">Amlodipine</td>
                            <td className="py-3 px-4 text-xs text-slate-600">Antihypertenseur</td>
                            <td className="py-3 px-4 text-xs text-slate-600">5mg, 10mg</td>
                            <td className="py-3 px-4 text-right">
                              <span className="inline-block bg-[#8BD2F2] text-[#0E1B2A] text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider">
                                Sélectionné
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Posologie & Durée */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* Posologie */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <Pill size={16} className="text-[#8BD2F2]" strokeWidth={2.5} />
                        <h3 className="text-sm font-bold text-slate-900">Posologie</h3>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Dosage</label>
                        <div className="relative">
                          <select className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:border-[#8BD2F2] cursor-pointer">
                            <option>5mg</option>
                            <option>10mg</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Voie</label>
                          <div className="relative">
                            <select className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#8BD2F2] cursor-pointer">
                              <option>Orale</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Fréquence</label>
                          <div className="relative">
                            <select className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#8BD2F2] cursor-pointer">
                              <option>1 fois/jour</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <div className="text-[#8BD2F2]">
                            <CheckSquare size={16} className="fill-[#8BD2F2] text-white" />
                          </div>
                          <span className="text-xs font-semibold text-slate-900 group-hover:text-[#8BD2F2] transition-colors">Matin</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <div className="text-[#8BD2F2]">
                            <CheckSquare size={16} className="fill-[#8BD2F2] text-white" />
                          </div>
                          <span className="text-xs font-semibold text-slate-900 group-hover:text-[#8BD2F2] transition-colors">Avec nourriture</span>
                        </label>
                      </div>
                    </div>

                    {/* Durée */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <Calendar size={16} className="text-[#8BD2F2]" strokeWidth={2.5} />
                        <h3 className="text-sm font-bold text-slate-900">Durée</h3>
                      </div>

                      <div className="flex gap-2 mb-5">
                        <button className="flex-1 bg-[#8BD2F2] text-[#0E1B2A] py-1.5 rounded-full text-[11px] font-bold border border-[#8BD2F2] transition-all">30 Jours</button>
                        <button className="flex-1 bg-white text-slate-600 py-1.5 rounded-full text-[11px] font-bold border border-slate-200 hover:bg-slate-50 transition-all">60 Jours</button>
                        <button className="flex-1 bg-white text-slate-600 py-1.5 rounded-full text-[11px] font-bold border border-slate-200 hover:bg-slate-50 transition-all">90 Jours</button>
                      </div>

                      <div className="mb-4">
                        <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Date début</label>
                        <input 
                          type="text" 
                          defaultValue="05/15/2026"
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#8BD2F2]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Date fin estimée</label>
                        <input 
                          type="text" 
                          defaultValue="06/15/2026"
                          disabled
                          className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-500 font-medium cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Instructions & Précautions */}
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-[15px] font-bold text-slate-900 mb-4">Instructions & Précautions</h3>
                    
                    <div className="mb-5">
                      <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Instructions détaillées</label>
                      <textarea 
                        defaultValue="Prendre 1 comprimé chaque matin après le petit déjeuner"
                        rows={2}
                        className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm text-slate-900 focus:outline-none focus:border-[#8BD2F2] resize-none"
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 p-2.5 border border-slate-200 rounded-lg hover:border-[#8BD2F2]/50 transition-colors group cursor-pointer">
                        <CheckSquare size={16} className="text-[#8BD2F2] fill-[#8BD2F2] text-white" />
                        <span className="text-xs font-semibold text-slate-700 group-hover:text-[#8BD2F2]">Ne pas dépasser la dose</span>
                      </div>
                      <div className="flex items-center gap-2 p-2.5 border border-slate-200 rounded-lg hover:border-[#8BD2F2]/50 transition-colors group cursor-pointer">
                        <CheckSquare size={16} className="text-[#8BD2F2] fill-[#8BD2F2] text-white" />
                        <span className="text-xs font-semibold text-slate-700 group-hover:text-[#8BD2F2]">Éviter alcool</span>
                      </div>
                      <div className="flex items-center gap-2 p-2.5 border border-slate-200 rounded-lg hover:border-[#8BD2F2]/50 transition-colors group cursor-pointer">
                        <CheckSquare size={16} className="text-[#8BD2F2] fill-[#8BD2F2] text-white" />
                        <span className="text-xs font-semibold text-slate-700 group-hover:text-[#8BD2F2]">Surveiller tension artérielle</span>
                      </div>
                      <div className="flex items-center gap-2 p-2.5 border border-slate-200 rounded-lg hover:border-[#8BD2F2]/50 transition-colors group cursor-pointer">
                        <CheckSquare size={16} className="text-[#8BD2F2] fill-[#8BD2F2] text-white" />
                        <span className="text-xs font-semibold text-slate-700 group-hover:text-[#8BD2F2]">Signaler effets indésirables</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Column (Sidebar) */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                  
                  {/* Contrôles de Sécurité */}
                  <div className="bg-[#F8FAFC] rounded-xl border border-slate-200 p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <ShieldCheck size={16} className="text-[#8BD2F2]" strokeWidth={2.5} />
                      <h3 className="text-[11px] font-bold text-[#8BD2F2] uppercase tracking-wider">CONTRÔLES DE SÉCURITÉ</h3>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-200">
                        <span className="text-xs font-bold text-slate-700">Interactions</span>
                        <span className="bg-[#E6F4EA] text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-[#CEEAD6]">
                          OK
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-200">
                        <span className="text-xs font-bold text-slate-700">Allergies</span>
                        <span className="text-xs font-medium text-slate-400">Aucune</span>
                      </div>
                      <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-200">
                        <span className="text-xs font-bold text-slate-700">Risque patient</span>
                        <span className="bg-[#F0F7FF] text-[#8BD2F2] text-[10px] font-bold px-2 py-0.5 rounded-md border border-[#CCE0FF]">
                          FAIBLE
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Suivi Médical */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                    <h3 className="text-[15px] font-bold text-slate-900 mb-4">Suivi Médical</h3>
                    
                    <div className="mb-4">
                      <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Fréquence de contrôle</label>
                      <div className="relative">
                        <select className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#8BD2F2] cursor-pointer">
                          <option>Quotidien</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Suivi par</label>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <CheckSquare size={16} className="text-[#8BD2F2] fill-[#8BD2F2] text-white" />
                          <span className="text-xs font-semibold text-slate-900 group-hover:text-[#8BD2F2]">Médecin</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <CheckSquare size={16} className="text-[#8BD2F2] fill-[#8BD2F2] text-white" />
                          <span className="text-xs font-semibold text-slate-900 group-hover:text-[#8BD2F2]">Infirmier</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Indicateurs clés</label>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-600 rounded-md text-[10px] font-bold uppercase tracking-wider">Tension</span>
                        <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-600 rounded-md text-[10px] font-bold uppercase tracking-wider">Effets</span>
                        <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-600 rounded-md text-[10px] font-bold uppercase tracking-wider">Observance</span>
                      </div>
                    </div>
                  </div>

                  {/* Lier le traitement */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                    <h3 className="text-[15px] font-bold text-slate-900 mb-4">Lier le traitement</h3>
                    
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between bg-[#F0F7FF] border border-[#CCE0FF] p-3 rounded-lg">
                        <div className="flex items-start gap-3">
                          <CheckSquare size={16} className="text-[#8BD2F2] fill-[#8BD2F2] text-white mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-slate-900">Consultation C-001</p>
                            <p className="text-[10px] text-slate-500">15/05/2026</p>
                          </div>
                        </div>
                        <Link2 size={16} className="text-[#8BD2F2]" />
                      </div>
                      
                      <div className="flex items-center justify-between bg-[#F0F7FF] border border-[#CCE0FF] p-3 rounded-lg">
                        <div className="flex items-start gap-3">
                          <CheckSquare size={16} className="text-[#8BD2F2] fill-[#8BD2F2] text-white mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-slate-900">Diag: Hypertension</p>
                            <p className="text-[10px] text-slate-500">Code I10</p>
                          </div>
                        </div>
                        <Link2 size={16} className="text-slate-400" />
                      </div>
                    </div>
                  </div>

                  {/* Aperçu Ordonnance */}
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col items-center justify-center p-8 relative">
                    {/* Faint background pattern for document */}
                    <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' }}></div>
                    
                    <FileText size={40} className="text-[#8BD2F2] mb-3" strokeWidth={1.5} />
                    <h4 className="text-sm font-bold text-slate-900 text-center mb-1 relative z-10">Aperçu Ordonnance</h4>
                    <p className="text-xs text-slate-500 text-center relative z-10">Génération automatique après validation</p>
                  </div>

                </div>

              </div>

            </div>

            {/* Footer */}
            <div className="bg-slate-100 border-t border-slate-200 p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsTraitementModalOpen(false)}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-[#D14343] hover:bg-[#D14343]/10 rounded-lg transition-colors"
                >
                  <X size={16} />
                  Annuler
                </button>
                <button className="px-5 py-2.5 bg-slate-200/50 border border-slate-300 rounded-lg text-sm font-bold text-[#8BD2F2] hover:bg-slate-200 transition-colors">
                  Ajouter autre médicament
                </button>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    setIsTraitementModalOpen(false);
                    setIsOrdonnanceModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-500 hover:bg-slate-600 text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
                >
                  <Printer size={16} />
                  Générer ordonnance
                </button>
                <button 
                  onClick={() => setIsTraitementModalOpen(false)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#8BD2F2] hover:bg-[#74C5E9] text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
                >
                  <Save size={16} />
                  Enregistrer traitement
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Ordonnance Modal */}
      {isOrdonnanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-[#F8FAFC] rounded-xl w-full max-w-4xl shadow-2xl relative flex flex-col overflow-hidden border border-slate-200">
            
            {/* Scrollable Content */}
            <div className="flex-1 p-8 flex flex-col gap-6">
              
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-[28px] font-black text-[#8BD2F2] mb-1">Génération d'Ordonnance</h2>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-500">
                    <span>Dossier Patient</span>
                    <ChevronRight size={14} />
                    <span className="text-slate-700">Patient A. Codjo</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 px-4 py-2 border border-slate-200 bg-white rounded-xl shadow-sm">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Praticien</p>
                    <p className="text-sm font-bold text-[#8BD2F2]">Dr. Hounkpatin</p>
                    <p className="text-[10px] text-[#8BD2F2]/70">Cardiologue</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* Left Column (Patient & Security) */}
                <div className="md:col-span-5 flex flex-col gap-6">
                  
                  {/* Patient Info */}
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-[#E6F0FF] text-[#8BD2F2] font-bold text-lg rounded-xl flex items-center justify-center shrink-0">
                        AC
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">A. Codjo</h3>
                        <p className="text-xs font-semibold text-slate-500">Identifiant: #PAT-88219</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <span className="text-xs font-bold text-slate-500">Âge / Sexe</span>
                        <span className="text-sm font-bold text-slate-900">54 ans / M</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <span className="text-xs font-bold text-slate-500">Pathologie</span>
                        <span className="text-sm font-bold text-slate-900 text-right">Hypertension<br/>Artérielle</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-500">Dernière visite</span>
                        <span className="text-sm font-bold text-slate-900">12/05/2024</span>
                      </div>
                    </div>
                  </div>

                  {/* Sécurité & Validation */}
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-5">
                      <ShieldCheck size={18} className="text-[#8BD2F2]" strokeWidth={2.5} />
                      <h3 className="text-sm font-bold text-slate-900">Sécurité & Validation</h3>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 size={16} className="text-[#10B981]" />
                          <span className="text-xs font-semibold text-slate-700">Signature<br/>électronique active</span>
                        </div>
                        <span className="bg-[#10B981] text-white text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wider">
                          CERTIFIÉ
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 size={16} className="text-[#10B981]" />
                          <span className="text-xs font-semibold text-slate-700">Tampon<br/>clinique validé</span>
                        </div>
                        <span className="bg-[#10B981] text-white text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wider">
                          APPOSÉ
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 size={16} className="text-[#10B981]" />
                          <span className="text-xs font-semibold text-slate-700">QR Code de<br/>vérification</span>
                        </div>
                        <span className="bg-[#10B981] text-white text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wider">
                          GÉNÉRÉ
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Column (Treatment & Export) */}
                <div className="md:col-span-7 flex flex-col gap-6">
                  
                  {/* Détails du Traitement */}
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-sm font-bold text-[#8BD2F2]">Détails du Traitement</h3>
                      <button className="text-xs font-bold text-[#8BD2F2] hover:underline flex items-center gap-1">
                        <Plus size={14} /> Ajouter un médicament
                      </button>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                      {/* Med 1 */}
                      <div className="border border-slate-200 rounded-xl p-4 flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-[#8BD2F2] text-[#0E1B2A] flex items-center justify-center shrink-0">
                          <Pill size={20} />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-slate-900 mb-1">Amlodipine 5mg</h4>
                          <p className="text-xs text-slate-500 mb-3">Posologie: 1 comprimé le matin</p>
                          <div className="flex gap-2">
                            <span className="flex items-center gap-1.5 bg-[#F0F7FF] text-[#8BD2F2] px-2.5 py-1 rounded-md text-[11px] font-bold">
                              <Calendar size={12} /> Durée: 30 jours
                            </span>
                            <span className="flex items-center gap-1.5 bg-[#E6F4EA] text-[#10B981] px-2.5 py-1 rounded-md text-[11px] font-bold border border-[#CEEAD6]">
                              Voie orale
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-center justify-between">
                          <button className="text-slate-400 hover:text-red-500 transition-colors">
                            <Trash2 size={16} />
                          </button>
                          <button className="text-slate-400 hover:text-[#8BD2F2] transition-colors">
                            <Pen size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Med 2 */}
                      <div className="border border-slate-200 rounded-xl p-4 flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-[#8BD2F2] text-[#0E1B2A] flex items-center justify-center shrink-0">
                          <Pill size={20} />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-slate-900 mb-1">Aspirine 100mg</h4>
                          <p className="text-xs text-slate-500 mb-3">Posologie: 1 comprimé le soir</p>
                          <div className="flex gap-2">
                            <span className="flex items-center gap-1.5 bg-[#F0F7FF] text-[#8BD2F2] px-2.5 py-1 rounded-md text-[11px] font-bold">
                              <Calendar size={12} /> Durée: 15 jours
                            </span>
                            <span className="flex items-center gap-1.5 bg-[#E6F4EA] text-[#10B981] px-2.5 py-1 rounded-md text-[11px] font-bold border border-[#CEEAD6]">
                              Voie orale
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-center justify-between">
                          <button className="text-slate-400 hover:text-red-500 transition-colors">
                            <Trash2 size={16} />
                          </button>
                          <button className="text-slate-400 hover:text-[#8BD2F2] transition-colors">
                            <Pen size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Options d'exportation */}
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">OPTIONS D'EXPORTATION</h3>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer group hover:border-[#8BD2F2]/50">
                        <CheckSquare size={18} className="text-[#8BD2F2] fill-[#8BD2F2] text-white shrink-0" />
                        <span className="text-xs font-bold text-slate-700 group-hover:text-[#8BD2F2]">Générer PDF</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer group hover:border-[#8BD2F2]/50">
                        <CheckSquare size={18} className="text-[#8BD2F2] fill-[#8BD2F2] text-white shrink-0" />
                        <span className="text-xs font-bold text-slate-700 group-hover:text-[#8BD2F2]">Envoyer au<br/>patient</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer group hover:border-[#8BD2F2]/50">
                        <CheckSquare size={18} className="text-[#8BD2F2] fill-[#8BD2F2] text-white shrink-0" />
                        <span className="text-xs font-bold text-slate-700 group-hover:text-[#8BD2F2]">Archiver au<br/>dossier</span>
                      </label>
                    </div>
                  </div>

                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-200">
                <button 
                  onClick={() => setIsOrdonnanceModalOpen(false)}
                  className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Fermer
                </button>
                <div className="flex items-center gap-3">
                  <button className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-[#8BD2F2] rounded-lg text-sm font-bold transition-colors shadow-sm">
                    <Download size={16} />
                    Télécharger PDF
                  </button>
                  <button className="flex items-center justify-center gap-2 px-6 py-3 bg-[#E6F0FF] hover:bg-[#CCE0FF] text-[#8BD2F2] rounded-lg text-sm font-bold transition-colors shadow-sm">
                    <Send size={16} />
                    Envoyer
                  </button>
                  <button 
                    onClick={() => setIsOrdonnanceModalOpen(false)}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-[#8BD2F2] hover:bg-[#74C5E9] text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
                  >
                    <CheckCircle2 size={16} />
                    Générer ordonnance
                  </button>
                </div>
              </div>

              {/* Footer text */}
              <div className="text-center mt-4">
                <p className="text-[10px] text-slate-400">
                  © 2024 Clinique Saint Luc - Système de Prescription Électronique Certifié. Toutes les données sont traitées conformément aux normes HDS.
                </p>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
