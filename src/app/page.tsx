import React from "react";
import Image from "next/image";
import {
  ShieldCheck,
  FolderLock,
  Stethoscope,
  Users,
  ExternalLink,
  Sparkles,
  Lock,
  Activity,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#F5F9FD] via-[#FFFFFF] to-[#F0F6FC] text-[#0E1B2A] relative overflow-hidden">
      {/* Background decorative soft glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-r from-blue-200/30 via-cyan-100/40 to-blue-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-2/3 -right-32 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-30 w-full border-b border-[#E3EDF7]/80 bg-white/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <Image
                src="/logo.svg"
                alt="Dotobase Logo"
                width={42}
                height={42}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-[#0053CD]">
                Dotobase
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#6E7C91]">
                Health Systems
              </span>
            </div>
          </div>

          {/* Navigation items / Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Powered by DGIT Badge */}
            <a
              href="https://dgit-technologies.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#EAF2FC] text-[#0053CD] hover:bg-[#DDEAF9] transition-colors border border-[#CDE0F7]"
              title="Visiter le site officiel de DGIT-TECHNOLOGIES"
            >
              <span>Powered by <strong className="font-bold">DGIT-TECHNOLOGIES</strong></span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 flex flex-col items-center text-center">
        {/* Teaser Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 via-cyan-50 to-indigo-50 border border-blue-200/80 shadow-xs mb-8">
          <Sparkles className="w-4 h-4 text-[#0053CD] animate-pulse" />
          <span className="text-xs sm:text-sm font-semibold text-[#0053CD]">
            Quelque chose de grand est en train d&apos;être construit...
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#0E1B2A] max-w-4xl leading-[1.15]">
          Votre santé,{" "}
          <span className="bg-gradient-to-r from-[#0053CD] via-[#146BFB] to-[#2B8A9E] bg-clip-text text-transparent">
            votre contrôle
          </span>
        </h1>

        {/* Subtitle / Description de Dotobase */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-[#4A5568] max-w-3xl font-normal leading-relaxed">
          <strong className="text-[#0E1B2A] font-semibold">Dotobase</strong> est la
          plateforme moderne de dossiers médicaux électroniques conçue pour centraliser,
          sécuriser et fluidifier la prise en charge des patients. Elle permet aux
          praticiens et structures de santé de collaborer en temps réel avec précision,
          tout en garantissant à chaque patient la maîtrise totale de ses données.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <a
            href="https://dgit-technologies.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-white bg-[#0053CD] hover:bg-[#0043A8] shadow-md hover:shadow-lg transition-all text-base"
          >
            <span>Découvrir DGIT-TECHNOLOGIES</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Security / Trust micro-banner */}
        <div className="mt-8 flex items-center gap-2 text-xs text-[#6E7C91]">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Données de santé hautement sécurisées · Chiffrement de niveau médical</span>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-16 sm:mt-20 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-6 border border-[#E3EDF7] shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:border-blue-200 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0053CD] flex items-center justify-center mb-4">
              <FolderLock className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-[#0E1B2A] mb-2">
              Dossier Médical Partagé
            </h2>
            <p className="text-sm text-[#6E7C91] leading-relaxed">
              Centralisation complète de l&apos;historique clinique, consultations,
              analyses et examens en un seul endroit sécurisé.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-6 border border-[#E3EDF7] shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:border-blue-200 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 text-[#2B8A9E] flex items-center justify-center mb-4">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-[#0E1B2A] mb-2">
              Pratique Médicale Fluide
            </h2>
            <p className="text-sm text-[#6E7C91] leading-relaxed">
              Outils intuitifs pour les médecins : diagnostic structuré, rédaction
              rapide d&apos;ordonnances et suivi des traitements.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-6 border border-[#E3EDF7] shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:border-blue-200 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-[#0E1B2A] mb-2">
              Confidentialité Absolue
            </h2>
            <p className="text-sm text-[#6E7C91] leading-relaxed">
              Protection maximale respectant le secret médical, avec traçabilité et
              accès strictement accordés par le patient.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-6 border border-[#E3EDF7] shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:border-blue-200 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-[#0E1B2A] mb-2">
              Contrôle pour le Patient
            </h2>
            <p className="text-sm text-[#6E7C91] leading-relaxed">
              Chaque citoyen est maître de ses informations de santé et autorise
              les professionnels de son choix.
            </p>
          </div>
        </div>

        {/* Large "Quelque chose de grand est en train d'être construit" Banner */}
        <section className="mt-16 sm:mt-20 w-full bg-gradient-to-br from-[#0053CD] via-[#0D62DD] to-[#1E95CB] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden text-center sm:text-left">
          {/* Subtle background graphics */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-cyan-400/20 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-sm mb-4">
                <Activity className="w-3.5 h-3.5" />
                <span>Innovation &amp; Santé Numérique</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
                Quelque chose de grand est en train d&apos;être construit
              </h2>
              <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
                Une infrastructure de santé unifiée, souveraine et moderne, pensée pour
                révolutionner l&apos;accès et la qualité des soins médicaux.
              </p>
            </div>

            <div className="shrink-0 flex flex-col items-center sm:items-end gap-3">
              <span className="text-xs uppercase tracking-widest text-blue-200 font-semibold">
                Initiative technologique
              </span>
              <a
                href="https://dgit-technologies.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-[#0053CD] font-bold text-sm shadow-md hover:bg-blue-50 transition-colors"
              >
                <span>powered by DGIT-TECHNOLOGIES</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#E3EDF7] bg-white py-10 px-4 sm:px-6 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Copyright */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.svg"
                alt="Dotobase Logo"
                width={24}
                height={24}
                className="object-contain"
              />
              <span className="font-bold text-sm text-[#0E1B2A]">
                Dotobase Health Systems
              </span>
            </div>
            <p className="text-xs text-[#6E7C91]">
              © {new Date().getFullYear()} Dotobase. Plateforme nationale de dossiers médicaux électroniques.
            </p>
          </div>

          {/* Powered by link in footer */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-xs font-medium text-[#6E7C91]">
            <a
              href="https://dgit-technologies.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#0053CD] hover:underline font-semibold"
            >
              <span>Propulsé par DGIT-TECHNOLOGIES (dgit-technologies.com)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
