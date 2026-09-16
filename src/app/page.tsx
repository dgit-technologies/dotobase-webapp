"use client";

import React, { useContext, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AuthContext } from "@/components/auth/AuthProvider";
import { PatientCardsSlider } from "@/components/home/PatientCardsSlider";
import {
  ShieldCheck,
  FileText,
  AlertTriangle,
  HeartPulse,
  Building2,
  Clock,
  ArrowRight,
  CheckCircle2,
  X,
  Menu,
  Sparkles,
  QrCode,
  UserCheck,
  Search,
  Lock,
  Smartphone,
  Hospital,
  ChevronRight,
  ChevronLeft,
  Share2,
  Plus,
  Send,
  Check,
  Stethoscope,
  Activity,
  History,
  FileSpreadsheet,
} from "lucide-react";

export default function LandingPage() {
  const auth = useContext(AuthContext);
  const isAuthenticated = auth?.isAuthenticated ?? false;
  const isLoading = auth?.isLoading ?? false;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoSuccess, setDemoSuccess] = useState(false);
  const [demoRole, setDemoRole] = useState<"clinique" | "patient" | "partenaire">("clinique");
  const [modalMode, setModalMode] = useState<"demo" | "inscription">("inscription");

  const openInscriptionModal = () => {
    setDemoRole("clinique");
    setModalMode("inscription");
    setDemoModalOpen(true);
  };

  const openDemoModal = (role: "clinique" | "patient" | "partenaire" = "clinique") => {
    setDemoRole(role);
    setModalMode("demo");
    setDemoModalOpen(true);
  };

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoSuccess(true);
    setTimeout(() => {
      setDemoSuccess(false);
      setDemoModalOpen(false);
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] selection:bg-[#8BD2F2]/15 selection:text-[#8BD2F2] font-sans antialiased">
      {/* =========================================================================
          1. NAVIGATION FIXE, LÉGÈRE ET TRANSLUCIDE (SOFT BLANC ET BLEU)
      ========================================================================= */}
      {/* =========================================================================
          1. NAVIGATION FLOTTANTE EN CAPSULE (STYLE SUPERPOWER / PREMIUM HEALTHCARE)
      ========================================================================= */}
      <header className="fixed top-0 inset-x-0 z-50 pointer-events-none px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto bg-white/85 backdrop-blur-xl border border-slate-200/90 rounded-full px-4 sm:px-6 py-2 shadow-xs shadow-slate-900/5">
          {/* Logo Dotobase */}
          <Link
            href="/"
            className="group flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8BD2F2] rounded-full py-0.5"
            aria-label="Accueil Dotobase"
          >
            <Image
              src="/Logo_written.svg"
              alt="Dotobase"
              width={160}
              height={44}
              className="h-9 sm:h-11 w-auto object-contain group-hover:opacity-90 transition-opacity"
              priority
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600" aria-label="Navigation principale">
            <a
              href="#avantages"
              className="hover:text-[#0F172A] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8BD2F2] rounded-full px-1 py-0.5"
            >
              Avantages patients
            </a>
            <a
              href="#pourquoi"
              className="hover:text-[#0F172A] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8BD2F2] rounded-full px-1 py-0.5"
            >
              Pourquoi Dotobase ?
            </a>
            <a
              href="#cliniques"
              className="hover:text-[#0F172A] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8BD2F2] rounded-full px-1 py-0.5"
            >
              Pour les cliniques
            </a>
            <a
              href="#partenaires"
              className="hover:text-[#0F172A] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8BD2F2] rounded-full px-1 py-0.5"
            >
              Partenaires
            </a>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            {!isLoading && isAuthenticated ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-bold text-slate-800 hover:text-[#0F172A] bg-slate-100 hover:bg-slate-200/80 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8BD2F2]"
              >
                Mon Espace
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-[#0F172A] hover:bg-slate-100/80 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8BD2F2]"
              >
                Se connecter
              </Link>
            )}
            <Link
              href="/inscrire-hopital"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-[#0E1B2A] bg-[#8BD2F2] hover:bg-[#74C5E9] rounded-full shadow-xs shadow-[#8BD2F2]/25 hover:shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#8BD2F2]"
            >
              <Hospital className="w-4 h-4" />
              <span>Inscrire mon hôpital</span>
            </Link>
            <button
              onClick={() => openDemoModal("clinique")}
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 border border-slate-300 hover:bg-slate-50 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 cursor-pointer"
            >
              Demander une démo
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8BD2F2]"
            aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 border border-slate-200/90 bg-white/95 backdrop-blur-xl rounded-2xl p-4 space-y-3 shadow-xl max-w-7xl mx-auto">
            <nav className="flex flex-col space-y-2 text-base font-medium text-slate-700" aria-label="Navigation mobile">
              <a
                href="#avantages"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-slate-50"
              >
                Avantages patients
              </a>
              <a
                href="#pourquoi"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-slate-50"
              >
                Pourquoi Dotobase ?
              </a>
              <a
                href="#cliniques"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-slate-50"
              >
                Pour les cliniques
              </a>
              <a
                href="#partenaires"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-slate-50"
              >
                Partenaires
              </a>
            </nav>
            <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
              {!isLoading && isAuthenticated ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 font-bold text-slate-800 bg-slate-100 border border-slate-200 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Mon Espace
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 font-semibold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Se connecter
                </Link>
              )}
              <Link
                href="/inscrire-hopital"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 font-bold text-[#0E1B2A] bg-[#8BD2F2] rounded-xl shadow-xs hover:bg-[#74C5E9] transition-colors flex items-center justify-center gap-2"
              >
                <Hospital className="w-4 h-4" />
                <span>Inscrire mon hôpital</span>
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openDemoModal("clinique");
                }}
                className="w-full text-center py-2.5 font-semibold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Demander une démo
              </button>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* =========================================================================
            2. HERO SECTION : INSPIRÉ DE LA MAQUETTE (SOBRE, PREMIUM, CLAIR)
               "Connecter pour mieux soigner"
        ========================================================================= */}
        <section className="relative min-h-screen w-full flex items-end pb-[100px] overflow-hidden bg-[#F8FAFC] pt-24 sm:pt-28">
          {/* IMAGE DE FOND (MÉDECIN ET PATIENT TOUS DEUX NOIRS À PEAU CLAIRE, MACBOOK VU DE DOS) */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero-consultation-v2.jpg"
              alt="Consultation médicale Dotobase entre un médecin et un patient"
              fill
              priority
              className="object-cover object-center sm:object-[75%_center] lg:object-right"
              sizes="100vw"
            />
          </div>

          {/* CONTENU PRINCIPAL DU HERO ENVELOPPÉ DANS UNE CARTE BLUR GLASSMORPHISM */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-xl bg-white/80 backdrop-blur-xl border border-white/70 p-7 sm:p-10 rounded-3xl shadow-xl shadow-slate-900/5">
              
              {/* Titre central demandé : "Connecter pour mieux soigner" */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] leading-[1.1]">
                Connecter pour <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0E1B2A] to-slate-700">
                  mieux soigner
                </span>
              </h1>

              {/* Deux boutons d'action : Inscrire mon hôpital & Découvrir pour les patients */}
              <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3.5">
                <Link
                  href="/inscrire-hopital"
                  className="px-6 sm:px-7 py-3.5 rounded-full font-bold text-sm text-[#0E1B2A] bg-[#8BD2F2] hover:bg-[#74C5E9] shadow-md shadow-[#8BD2F2]/25 hover:shadow-lg transition-all hover:-translate-y-0.5 inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#8BD2F2]"
                >
                  <Hospital className="w-4 h-4" />
                  <span>Inscrire mon hôpital</span>
                </Link>

                <a
                  href="#avantages"
                  className="px-6 sm:px-7 py-3.5 rounded-full font-semibold text-sm text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 transition-all shadow-xs inline-flex items-center gap-2 group"
                >
                  <span>Découvrir pour les patients</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform text-slate-500 group-hover:text-slate-900" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. SECTION SUIVANTE : SLIDERS / CARTES APPLE POUR LES PATIENTS
        ========================================================================= */}
        <section id="avantages" className="py-20 sm:py-28 bg-white border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#8BD2F2]">
                Conçu pour vous
              </span>
              <h2 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0F172A]">
                Une prise en charge sans faille.
              </h2>
              <p className="mt-4 text-base sm:text-lg text-slate-600">
                Découvrez comment Dotobase transforme chaque étape de votre parcours de santé,
                dès la porte de l&apos;hôpital.
              </p>
            </div>
          </div>

          {/* SLIDER HORIZONTAL PLEINE LARGEUR (FULL BLEED SANS CONTRAINTE DE LARGEUR) */}
          <div className="w-full">
            <PatientCardsSlider />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* BOUTONS INSTALLER L'APPLICATION (APP STORE & GOOGLE PLAY STORE) */}
            <div className="mt-14 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-blue-50/80 via-white to-indigo-50/80 border border-blue-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 text-left">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#8BD2F2] text-xs font-semibold mb-2">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Disponible sur vos smartphones</span>
                </div>
                <h3 className="text-2xl font-extrabold text-[#0F172A]">
                  Installez l&apos;application Dotobase dès aujourd&apos;hui
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Créez votre profil en 2 minutes et gardez vos antécédents médicaux toujours avec vous.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                {/* App Store Button */}
                <button
                  onClick={() => alert("Dotobase sera disponible très prochainement sur l'App Store d'Apple !")}
                  className="w-full sm:w-auto inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-black text-white transition-all shadow-md"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.98.6-2.61 1.34-.56.64-.99 1.7-0.86 2.72.99.08 2.01-.52 2.55-1.21z" />
                  </svg>
                  <div className="text-left">
                    <span className="block text-[10px] uppercase font-medium tracking-wider text-slate-300">
                      Télécharger sur
                    </span>
                    <span className="block text-sm font-bold leading-tight">App Store</span>
                  </div>
                </button>

                {/* Google Play Button */}
                <button
                  onClick={() => alert("Dotobase sera disponible très prochainement sur le Google Play Store !")}
                  className="w-full sm:w-auto inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-black text-white transition-all shadow-md"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a1.44 1.44 0 0 1-.61-.92L3 2.734c0-.36.216-.69.609-.92zm11.306 11.306L6.87 21.165l10.237-5.91-2.192-2.135zm0-2.24l2.192-2.135-10.237-5.91 8.045 8.045zm1.583.71l2.88 1.664c.97.56.97 1.474 0 2.034l-2.88 1.663-1.644-1.68 1.644-1.681z" />
                  </svg>
                  <div className="text-left">
                    <span className="block text-[10px] uppercase font-medium tracking-wider text-slate-300">
                      Disponible sur
                    </span>
                    <span className="block text-sm font-bold leading-tight">Google Play</span>
                  </div>
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* =========================================================================
            4. SECTION « POURQUOI DOTOBASE ? » (LE CONSTAT DU TERRAIN)
        ========================================================================= */}
        <section id="pourquoi" className="py-20 sm:py-28 bg-[#F8FAFC] border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                La réalité du terrain
              </span>
              <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0F172A]">
                Pourquoi Dotobase est devenu indispensable ?
              </h2>
              <p className="mt-4 text-base sm:text-lg text-slate-600">
                Aujourd&apos;hui, la dispersion des informations médicales met en danger des patients
                et ralentit considérablement le travail des soignants.
              </p>
            </div>

            {/* 3 problèmes réels + la solution Dotobase */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {/* Problème 1 : Traitements inadaptés */}
              <div className="bg-white p-7 rounded-3xl border border-red-100 shadow-xs relative overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold mb-4">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  La plupart des traitements sont inadaptés
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Sans accès immédiat à l&apos;historique complet, les soignants doivent deviner ou réinterroger
                  des patients fatigués. Résultat : risques d&apos;interactions médicamenteuses néfastes et examens
                  répétés inutilement.
                </p>
              </div>

              {/* Problème 2 : Obligé de partager sur WhatsApp */}
              <div className="bg-white p-7 rounded-3xl border border-amber-100 shadow-xs relative overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-4">
                  <Share2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Obligé de partager sur WhatsApp pour s&apos;y retrouver
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Des photos d&apos;ordonnances floues, des comptes-rendus éparpillés dans des conversations de messagerie
                  personnelle, introuvables quand l&apos;urgence survient et sans aucune sécurité de confidentialité.
                </p>
              </div>

              {/* Problème 3 : Perte de temps critique en urgence */}
              <div className="bg-white p-7 rounded-3xl border border-blue-100 shadow-xs relative overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#8BD2F2] flex items-center justify-center font-bold mb-4">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Chaque minute perdue pèse sur le pronostic
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Attendre des proches pour connaître le groupe sanguin ou les allergies d&apos;un patient inconscient
                  retarde la prise en charge. Dotobase règle ce problème en donnant l&apos;information vitale instantanément.
                </p>
              </div>
            </div>

            {/* Réponse Dotobase */}
            <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-[#8BD2F2] text-[#0E1B2A] text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="max-w-2xl">
                <h4 className="text-xl sm:text-2xl font-extrabold mb-1">
                  Dotobase remplace le bricolage par une infrastructure médicale sûre.
                </h4>
                <p className="text-blue-100 text-sm sm:text-base">
                  Un pont numérique universel reliant les patients, les médecins et les hôpitaux en toute sérénité.
                </p>
              </div>
              <button
                onClick={() => setDemoModalOpen(true)}
                className="px-6 py-3.5 rounded-full bg-white text-[#8BD2F2] font-bold text-sm hover:bg-blue-50 transition-colors shrink-0 shadow-md"
              >
                Parler avec notre équipe
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================================
            5. SECTION « POUR LES CLINIQUES & HÔPITAUX »
        ========================================================================= */}
        <section id="cliniques" className="py-20 sm:py-28 bg-white border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#8BD2F2] text-xs font-semibold mb-4 border border-blue-200">
                  <Hospital className="w-3.5 h-3.5" />
                  <span>Structures de santé &amp; praticiens</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0F172A] leading-tight">
                  Équipez votre clinique d&apos;un outil de prise en charge instantané.
                </h2>
                <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
                  Dotobase s&apos;intègre aux habitudes des professionnels de santé pour accélérer les admissions,
                  fiabiliser le diagnostic et sécuriser chaque acte médical.
                </p>

                <div className="mt-8 space-y-4 text-sm sm:text-base text-slate-700">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      ✓
                    </div>
                    <div>
                      <strong className="text-slate-900 block">Recherche patient en 5 secondes</strong>
                      <span className="text-slate-500 text-xs sm:text-sm">
                        Identification par numéro NPI, QR code d&apos;admission ou nom complet vérifié.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      ✓
                    </div>
                    <div>
                      <strong className="text-slate-900 block">Réduction massive des informations manquantes</strong>
                      <span className="text-slate-500 text-xs sm:text-sm">
                        Consultation de l&apos;historique sans dépendre des souvenirs ou carnets oubliés.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      ✓
                    </div>
                    <div>
                      <strong className="text-slate-900 block">Traçabilité légale et secret médical</strong>
                      <span className="text-slate-500 text-xs sm:text-sm">
                        Chaque consultation est horodatée et soumise à l&apos;accord explicite du patient.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    href="/inscrire-hopital"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-[#0E1B2A] bg-[#8BD2F2] hover:bg-[#74C5E9] shadow-md shadow-[#8BD2F2]/20 transition-all text-sm sm:text-base"
                  >
                    <Hospital className="w-5 h-5" />
                    <span>Inscrire mon hôpital</span>
                  </Link>
                  <button
                    onClick={() => openDemoModal("clinique")}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs transition-all text-sm sm:text-base cursor-pointer"
                  >
                    <span>Demander une démo</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Panneau de prévisualisation clinique */}
              <div className="bg-[#F8FAFC] rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm text-left space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-xs font-bold text-[#8BD2F2] uppercase tracking-wider">
                    Console Praticien
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Dotobase Medical Suite v2</span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Prise en charge active</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                      Consentement accordé
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">Dr. Abdou Diallo · Service Médecine Générale</p>
                  <p className="text-xs text-slate-500">
                    Patient : Claire Dupont · Consultation débutée il y a 8 min
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Constante</span>
                    <span className="font-bold text-slate-900 text-sm">TA 125/80 mmHg</span>
                    <span className="text-slate-500 block text-[10px]">Rythme régulier</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Prescription</span>
                    <span className="font-bold text-slate-900 text-sm">e-Ordonnance</span>
                    <span className="text-emerald-600 block text-[10px]">Contrôle sécurisé</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center gap-2.5 text-xs text-[#8BD2F2]">
                  <Activity className="w-4 h-4 shrink-0" />
                  <span>Gain estimé : 15 minutes par admission et zéro dossier perdu.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            6. SECTION « ILS NOUS FONT CONFIANCE » (ACPB, CLINIQUE STE FAMILLE, CLINIQUE MÉLODIE)
        ========================================================================= */}
        <section id="partenaires" className="py-16 sm:py-24 bg-[#F8FAFC] border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#8BD2F2]">
              Partenaires &amp; Établissements
            </span>
            <h2 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A]">
              Ils nous font confiance
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
              Des structures de santé engagées pour moderniser la prise en charge et le suivi médical de leurs patients.
            </p>

            {/* LES 3 ÉTABLISSEMENTS CITÉS */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* ACPB */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-xs hover:border-blue-200 hover:shadow-md transition-all flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#8BD2F2] flex items-center justify-center font-extrabold text-xl mb-4">
                  ACPB
                </div>
                <h3 className="text-lg font-bold text-slate-900">ACPB</h3>
                <p className="text-xs text-slate-500 mt-1">Association Clinique &amp; Praticiens</p>
                <div className="mt-4 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[11px] font-medium text-slate-600">
                  Partenaire Médical Officiel
                </div>
              </div>

              {/* Clinique Ste Famille */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-xs hover:border-blue-200 hover:shadow-md transition-all flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl mb-4">
                  <Hospital className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Clinique Ste Famille</h3>
                <p className="text-xs text-slate-500 mt-1">Établissement de Soins &amp; Maternité</p>
                <div className="mt-4 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[11px] font-medium text-slate-600">
                  Établissement Équipé
                </div>
              </div>

              {/* Clinique Mélodie */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-xs hover:border-blue-200 hover:shadow-md transition-all flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl mb-4">
                  <Building2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Clinique Mélodie</h3>
                <p className="text-xs text-slate-500 mt-1">Centre Médico-Chirurgical &amp; Urgences</p>
                <div className="mt-4 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[11px] font-medium text-slate-600">
                  Établissement Équipé
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      {/* =========================================================================
          7. FOOTER MINIMAL
      ========================================================================= */}
      <footer className="w-full border-t border-slate-200 bg-white py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#8BD2F2] text-[#0E1B2A] flex items-center justify-center font-bold text-xs">
              D
            </div>
            <span className="font-extrabold text-sm text-slate-900">Dotobase</span>
            <span className="text-slate-300">|</span>
            <p>© {new Date().getFullYear()} Dotobase. Tous droits réservés.</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 font-medium text-slate-600">
            <a href="#avantages" className="hover:text-[#8BD2F2] transition-colors">
              Avantages
            </a>
            <a href="#pourquoi" className="hover:text-[#8BD2F2] transition-colors">
              Pourquoi Dotobase
            </a>
            <a href="#cliniques" className="hover:text-[#8BD2F2] transition-colors">
              Cliniques
            </a>
            <button
              onClick={() => {
                setDemoRole("partenaire");
                setDemoModalOpen(true);
              }}
              className="hover:text-[#8BD2F2] transition-colors"
            >
              Contact
            </button>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          MODALE DEMANDE DE DÉMO & CONTACT
      ========================================================================= */}
      {demoModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
        >
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-left relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setDemoModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>

            {demoSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {modalMode === "inscription"
                    ? "Demande d'inscription enregistrée"
                    : "Demande bien transmise"}
                </h3>
                <p className="text-sm text-slate-600">
                  {modalMode === "inscription"
                    ? "Merci ! Notre équipe dédiée prendra contact avec votre établissement dans la journée pour finaliser votre inscription."
                    : "Notre équipe prendra contact avec vous dans la journée pour vous présenter Dotobase."}
                </p>
              </div>
            ) : (
              <div>
                <div className="mb-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8BD2F2]">
                    {modalMode === "inscription" ? "Inscription Établissement" : "Échange personnalisé"}
                  </span>
                  <h3 id="modal-title" className="text-2xl font-extrabold text-slate-900 mt-1">
                    {modalMode === "inscription" ? "Inscrire mon hôpital" : "Demander une démo Dotobase"}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    {modalMode === "inscription"
                      ? "Rejoignez le réseau Dotobase pour moderniser l'accueil et sécuriser la prise en charge de vos patients."
                      : "Découvrez comment Dotobase améliore la prise en charge dans votre établissement."}
                  </p>
                </div>

                <form onSubmit={handleDemoSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Vous êtes :
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setDemoRole("clinique")}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                          demoRole === "clinique"
                            ? "bg-[#8BD2F2] text-[#0E1B2A] border-[#8BD2F2]"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        Clinique / Hôpital
                      </button>
                      <button
                        type="button"
                        onClick={() => setDemoRole("patient")}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                          demoRole === "patient"
                            ? "bg-[#8BD2F2] text-[#0E1B2A] border-[#8BD2F2]"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        Patient
                      </button>
                      <button
                        type="button"
                        onClick={() => setDemoRole("partenaire")}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                          demoRole === "partenaire"
                            ? "bg-[#8BD2F2] text-[#0E1B2A] border-[#8BD2F2]"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        Partenaire
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="nom" className="block text-xs font-bold text-slate-800 mb-1">
                        Nom complet *
                      </label>
                      <input
                        id="nom"
                        required
                        placeholder="Dr. Marc Hounnou"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8BD2F2]"
                      />
                    </div>
                    <div>
                      <label htmlFor="etablissement" className="block text-xs font-bold text-slate-800 mb-1">
                        Établissement / Hôpital {modalMode === "inscription" ? "*" : ""}
                      </label>
                      <input
                        id="etablissement"
                        required={modalMode === "inscription"}
                        placeholder="Centre Hospitalier..."
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8BD2F2]"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-bold text-slate-800 mb-1">
                      Email professionnel ou contact *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="contact@hopital.com"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8BD2F2]"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-bold text-slate-800 mb-1">
                      Votre besoin ou questions
                    </label>
                    <textarea
                      id="message"
                      rows={3}
                      placeholder="Indiquez vos coordonnées, le nombre de praticiens ou vos questions..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8BD2F2]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl font-bold text-[#0E1B2A] bg-[#8BD2F2] hover:bg-[#74C5E9] shadow-md shadow-[#8BD2F2]/20 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>
                        {modalMode === "inscription"
                          ? "Envoyer la demande d'inscription"
                          : "Envoyer la demande"}
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
