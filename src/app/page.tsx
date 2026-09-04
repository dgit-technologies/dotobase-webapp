import React from "react";
import Image from "next/image";
import {
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Cpu,
  Layers,
  Clock,
  Activity,
  CheckCircle2,
  Wrench,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-[#0B1528] via-[#0D1F3C] to-[#081120] text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
            <Image
              src="/logo.svg"
              alt="Dotobase Logo"
              width={34}
              height={34}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-white">
              Dotobase
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-300">
              Health Systems
            </span>
          </div>
        </div>

        {/* Powered by pill in header */}
        <a
          href="https://dgit-technologies.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-blue-200"
          title="Visiter DGIT-TECHNOLOGIES"
        >
          <span>powered by <strong className="text-white font-semibold">DGIT-TECHNOLOGIES</strong></span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </header>

      {/* Main Content: Focused Under Construction message */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-10 md:py-16 flex flex-col items-center text-center justify-center z-10">
        {/* Status Indicator */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/30 backdrop-blur-md mb-8">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
          </span>
          <Wrench className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs sm:text-sm font-semibold tracking-wide text-cyan-200 uppercase">
            Plateforme en cours de développement
          </span>
        </div>

        {/* Grand Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-3xl leading-[1.15]">
          Quelque chose de grand est en train{" "}
          <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
            d&apos;être construit...
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-blue-100/80 max-w-2xl font-normal leading-relaxed">
          Nos équipes travaillent activement à la finalisation et à l&apos;interconnexion
          des APIs de la plateforme. Nous serons très bientôt prêts à vous accueillir.
        </p>

        {/* Qu'est-ce que Dotobase ? - Focus Box */}
        <div className="mt-10 w-full bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 text-left shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Activity className="w-48 h-48 text-cyan-300" />
          </div>

          <div className="flex items-center gap-2.5 mb-3 text-cyan-300">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider font-bold">
              À propos du projet
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
            Qu&apos;est-ce que Dotobase ?
          </h2>

          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
            <strong className="text-white font-semibold">Dotobase</strong> est la
            future plateforme nationale de dossiers médicaux électroniques (DME). Elle est
            conçue pour unifier et sécuriser l&apos;ensemble du parcours de soins : centralisation
            des antécédents, suivi des consultations, ordonnances dématérialisées et résultats
            d&apos;examens. Elle offrira aux professionnels de santé un outil de travail collaboratif
            et précis, tout en redonnant aux patients le contrôle exclusif de leurs données médicales.
          </p>

          {/* Development progress milestones */}
          <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 bg-white/[0.03] p-3 rounded-xl border border-white/5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-white">Sécurité & Chiffrement</p>
                <p className="text-emerald-400/90 font-medium">100% Finalisé</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/[0.03] p-3 rounded-xl border border-white/5">
              <Cpu className="w-5 h-5 text-cyan-400 shrink-0 animate-pulse" />
              <div className="text-xs">
                <p className="font-semibold text-white">Intégration des APIs</p>
                <p className="text-cyan-400/90 font-medium">En cours de finalisation</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/[0.03] p-3 rounded-xl border border-white/5">
              <Clock className="w-5 h-5 text-indigo-400 shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-white">Ouverture officielle</p>
                <p className="text-indigo-300/90 font-medium">Bientôt disponible</p>
              </div>
            </div>
          </div>
        </div>

        {/* Central Powered by DGIT-TECHNOLOGIES CTA */}
        <div className="mt-10 flex flex-col items-center gap-3">
          <span className="text-xs uppercase tracking-widest text-blue-300/70 font-semibold">
            Développé et propulsé par
          </span>

          <a
            href="https://dgit-technologies.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-[#0053CD] hover:from-blue-500 hover:to-[#146BFB] text-white font-bold text-base shadow-lg shadow-blue-500/25 hover:shadow-cyan-500/30 transition-all border border-blue-400/30"
          >
            <span>powered by DGIT-TECHNOLOGIES</span>
            <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          <p className="text-xs text-blue-200/60 mt-1">
            Visitez le site officiel de l&apos;éditeur sur{" "}
            <a
              href="https://dgit-technologies.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300 hover:underline"
            >
              dgit-technologies.com
            </a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 bg-black/20 backdrop-blur-md py-6 px-6 z-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-200/60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Dotobase Health Systems · Plateforme Médicale Sécurisée</span>
          </div>

          <div className="flex items-center gap-2">
            <span>Propulsé par</span>
            <a
              href="https://dgit-technologies.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300 font-semibold hover:underline inline-flex items-center gap-1"
            >
              <span>DGIT-TECHNOLOGIES</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
