import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Cpu,
  Clock,
  CheckCircle2,
  Wrench,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#F8FAFC] via-[#F1F6FB] to-[#E9F2F8] text-slate-800 relative overflow-hidden">
      {/* Background soft ambient lighting */}
      <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-[500px] h-[500px] bg-cyan-100/40 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-sky-100/40 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <Link href="/" className="inline-flex items-center group" title="Dotobase">
            <Image
              src="/Logo_written.svg"
              alt="Dotobase Logo"
              width={160}
              height={124}
              className="h-11 sm:h-13 w-auto object-contain transition-transform group-hover:scale-[1.02]"
              priority
            />
            <span className="sr-only">Dotobase</span>
          </Link>
        </div>

        {/* Powered by pill in header */}
        <a
          href="https://dgit-technologies.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-white/80 hover:bg-white text-slate-700 hover:text-[#0053CD] border border-slate-200/80 shadow-xs hover:shadow-sm transition-all"
          title="Visiter DGIT-TECHNOLOGIES"
        >
          <span className="text-slate-500 font-normal">powered by</span>
          <strong className="text-slate-900 font-semibold">DGIT-TECHNOLOGIES</strong>
          <ExternalLink className="w-3.5 h-3.5 text-[#0053CD]" />
        </a>
      </header>

      {/* Main Content: 2-column layout on desktop */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-6 md:py-10 flex items-center z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center w-full">
          {/* Left Column: Messages, Explanation & Milestones */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Status Indicator Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/90 text-[#0053CD] mb-5 shadow-xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0053CD]" />
              </span>
              <Wrench className="w-3.5 h-3.5 text-[#0053CD]" />
              <span className="text-xs font-bold tracking-wide uppercase">
                Plateforme en cours de développement
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Quelque chose de grand est en train{" "}
              <span className="bg-gradient-to-r from-[#0053CD] via-[#0284C7] to-[#0D9488] bg-clip-text text-transparent">
                d&apos;être construit...
              </span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
              Nos équipes travaillent activement à la finalisation et à l&apos;interconnexion
              des APIs de la plateforme. Nous serons très bientôt prêts à vous accueillir.
            </p>

            {/* About Dotobase Card */}
            <div className="mt-8 w-full bg-white/90 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-2 mb-2 text-[#0053CD] font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>À propos du projet</span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Qu&apos;est-ce que Dotobase ?
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                <strong className="text-slate-900 font-semibold">Dotobase </strong>est la
                plateforme nationale de gestion de dossiers médicaux électroniques (DME). Elle est
                conçue pour unifier et sécuriser l&apos;ensemble du parcours de soins : centralisation
                des antécédents, suivi des consultations, ordonnances dématérialisées et résultats
                d&apos;examens. Elle offrira aux professionnels de santé un outil de travail collaboratif
                et précis, tout en redonnant aux patients le contrôle exclusif de leurs données médicales.
              </p>

              {/* Milestones */}
              <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-slate-800">Sécurité & Chiffrement</p>
                    <p className="text-emerald-600 font-medium">100% Finalisé</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-blue-50/70 border border-blue-100">
                  <Cpu className="w-4 h-4 text-[#0053CD] shrink-0 animate-pulse" />
                  <div className="text-xs">
                    <p className="font-semibold text-slate-800">Intégration des APIs</p>
                    <p className="text-[#0053CD] font-medium">En cours de finalisation</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-slate-800">Ouverture officielle</p>
                    <p className="text-indigo-600 font-medium">Bientôt disponible</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action CTA with DGIT */}
            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <a
                href="https://dgit-technologies.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#0053CD] hover:bg-[#0042A6] text-white font-semibold text-sm shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 transition-all"
              >
                <span>powered by DGIT-TECHNOLOGIES</span>
                <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <p className="text-xs text-slate-500">
                Visitez le site officiel de l&apos;éditeur sur{" "}
                <a
                  href="https://dgit-technologies.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0053CD] hover:underline font-medium"
                >
                  dgit-technologies.com
                </a>
              </p>
            </div>
          </div>

          {/* Right Column: 3D Construction Illustration */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-full max-w-lg">
              {/* Soft colorful blur background behind image */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-200/50 to-cyan-200/40 rounded-3xl blur-2xl opacity-70 pointer-events-none" />

              <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 bg-white/70 p-2 sm:p-3 shadow-xl shadow-slate-200/60">
                <Image
                  src="/illustration-construction.jpg"
                  alt="Illustration de la plateforme Dotobase en cours de construction"
                  width={600}
                  height={450}
                  className="w-full h-auto rounded-2xl object-cover shadow-xs"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 bg-white/60 backdrop-blur-md py-5 px-6 z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0053CD]" />
            <span>Dotobase Health Systems · Plateforme Médicale Sécurisée</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span>Propulsé par</span>
            <a
              href="https://dgit-technologies.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0053CD] font-semibold hover:underline inline-flex items-center gap-1"
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
