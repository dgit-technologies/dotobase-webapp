"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  HeartPulse,
  Activity,
  FileText,
  Hospital,
  Lock,
  ShieldCheck,
  Stethoscope,
  ArrowUpRight,
  Fingerprint,
  Search,
  CheckCircle2,
} from "lucide-react";

interface CardItem {
  id: string;
  leadTitle: string;
  description: string;
  linkText?: string;
  linkHref?: string;
  renderVisual: () => React.ReactNode;
}

export function PatientCardsSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const checkScrollButtons = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 15);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 15);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScrollButtons();
    el.addEventListener("scroll", checkScrollButtons, { passive: true });
    window.addEventListener("resize", checkScrollButtons);
    return () => {
      el.removeEventListener("scroll", checkScrollButtons);
      window.removeEventListener("resize", checkScrollButtons);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const cardWidth = container.querySelector<HTMLElement>("[data-card-item]")?.offsetWidth || 380;
    const scrollAmount = cardWidth + 24; // width + gap
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

function AnimatedFingerprintNpiCard() {
  const fullNpi = "940-201-884-01";
  const [typedText, setTypedText] = useState("");
  const [fingerprintDrawn, setFingerprintDrawn] = useState(false);
  const [isTypingDone, setIsTypingDone] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let typeInterval: NodeJS.Timeout;

    const startSequence = () => {
      // 1. Reset
      setFingerprintDrawn(false);
      setTypedText("");
      setIsTypingDone(false);

      // 2. Animate fingerprint drawing
      timer = setTimeout(() => {
        setFingerprintDrawn(true);

        // 3. Start typing NPI in search bar after fingerprint forms
        timer = setTimeout(() => {
          let charIndex = 0;
          typeInterval = setInterval(() => {
            charIndex++;
            setTypedText(fullNpi.slice(0, charIndex));

            if (charIndex >= fullNpi.length) {
              clearInterval(typeInterval);
              setIsTypingDone(true);

              // 4. Wait 2.8s after verification, then repeat cycle
              timer = setTimeout(startSequence, 2800);
            }
          }, 100);
        }, 750);
      }, 250);
    };

    startSequence();

    return () => {
      clearTimeout(timer);
      clearInterval(typeInterval);
    };
  }, []);

  return (
    <div className="w-full h-full bg-white rounded-[32px] p-6 sm:p-7 flex flex-col justify-between relative select-none">
      {/* Top subtle indicator */}
      <div className="flex items-center justify-between z-10">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0053CD]">
          Identification Biométrique
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[10px] font-bold text-[#0053CD]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0053CD] animate-pulse" />
          En direct
        </span>
      </div>

      {/* Central Area: Fingerprint standalone + Search bar */}
      <div className="my-auto flex flex-col items-center justify-center text-center w-full">
        {/* Animated Fingerprint: Standalone, no background, no circle, nothing around it */}
        <div className="flex items-center justify-center relative">
          <svg
            className="w-20 h-20 sm:w-24 sm:h-24 text-[#0053CD] transition-all duration-500 drop-shadow-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"
              style={{
                strokeDasharray: 30,
                strokeDashoffset: fingerprintDrawn ? 0 : 30,
                transition: "stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s",
              }}
            />
            <path
              d="M14 13.12c0 2.38 0 6.38-1 8.88"
              style={{
                strokeDasharray: 30,
                strokeDashoffset: fingerprintDrawn ? 0 : 30,
                transition: "stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s",
              }}
            />
            <path
              d="M17.29 21.02c.12-.6.43-2.3.5-3.02"
              style={{
                strokeDasharray: 20,
                strokeDashoffset: fingerprintDrawn ? 0 : 20,
                transition: "stroke-dashoffset 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.3s",
              }}
            />
            <path
              d="M2 12a10 10 0 0 1 18-6"
              style={{
                strokeDasharray: 60,
                strokeDashoffset: fingerprintDrawn ? 0 : 60,
                transition: "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.15s",
              }}
            />
            <path
              d="M2 16h.01"
              style={{
                strokeDasharray: 10,
                strokeDashoffset: fingerprintDrawn ? 0 : 10,
                transition: "stroke-dashoffset 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.35s",
              }}
            />
            <path
              d="M21.8 16c.2-2 .131-5.354 0-6"
              style={{
                strokeDasharray: 30,
                strokeDashoffset: fingerprintDrawn ? 0 : 30,
                transition: "stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.25s",
              }}
            />
            <path
              d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2"
              style={{
                strokeDasharray: 40,
                strokeDashoffset: fingerprintDrawn ? 0 : 40,
                transition: "stroke-dashoffset 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.2s",
              }}
            />
            <path
              d="M8.65 22c.21-.66.45-1.32.57-2"
              style={{
                strokeDasharray: 25,
                strokeDashoffset: fingerprintDrawn ? 0 : 25,
                transition: "stroke-dashoffset 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.3s",
              }}
            />
            <path
              d="M9 6.8a6 6 0 0 1 9 5.2v2"
              style={{
                strokeDasharray: 50,
                strokeDashoffset: fingerprintDrawn ? 0 : 50,
                transition: "stroke-dashoffset 0.75s cubic-bezier(0.4, 0, 0.2, 1) 0.1s",
              }}
            />
          </svg>
        </div>

        {/* Barre de recherche avec écriture animée du NPI */}
        <div className="mt-6 w-full max-w-[280px] bg-slate-50 border border-slate-200/90 rounded-2xl py-2.5 px-3.5 flex items-center gap-2.5 shadow-2xs transition-all">
          <Search className="w-4 h-4 text-[#0053CD] shrink-0" />
          <div className="flex-1 font-mono text-xs sm:text-sm font-bold text-slate-800 tracking-wider flex items-center min-h-[20px] text-left">
            <span>{typedText || (!fingerprintDrawn ? "Recherche NPI..." : "")}</span>
            {fingerprintDrawn && !isTypingDone && (
              <span className="w-0.5 h-4 bg-[#0053CD] ml-0.5 animate-pulse inline-block" />
            )}
          </div>
          {isTypingDone && (
            <CheckCircle2 className="w-4 h-4 text-[#0053CD] shrink-0 transition-transform scale-110" />
          )}
        </div>

        {/* Statut sous la barre de recherche */}
        <div className="min-h-[22px] mt-2.5 flex items-center justify-center">
          <div
            className={`flex items-center gap-1.5 text-[11px] font-semibold transition-all duration-300 ${
              isTypingDone ? "opacity-100 translate-y-0 text-slate-700" : "opacity-0 -translate-y-1"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#0053CD]" />
            <span>Identité confirmée · Claire Dupont</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 z-10 pt-2">
        <span>Accueil médical sécurisé</span>
        <span className="font-semibold text-[#0053CD]">Dotobase NPI</span>
      </div>
    </div>
  );
}

  const cards: CardItem[] = [
    // 1. CARTE 1 : EMPREINTE DIGITALE & NPI (Bleu et Blanc)
    {
      id: "card-identite",
      leadTitle: "On sait qui vous êtes.",
      description:
        "Même si vous arrivez affaibli ou désorienté, votre identifiant unique garantit que vous êtes immédiatement reconnu, sans erreur de dossier ni confusion d'identité.",
      linkText: "En savoir plus sur l'admission instantanée",
      renderVisual: () => <AnimatedFingerprintNpiCard />,
    },

    // 2. CARTE 2 : ANTÉCÉDENTS & URGENCES (Bleu et Blanc)
    {
      id: "card-antecedents",
      leadTitle: "Vos antécédents connus avant l'examen.",
      description:
        "Les médecins ont connaissance de vos antécédents médicaux, allergies et opérations passées avant de vous administrer le moindre traitement ou médicament.",
      linkText: "Découvrir la prévention des erreurs",
      renderVisual: () => (
        <div className="w-full h-full bg-[#0B1E48] rounded-[32px] p-6 sm:p-8 flex flex-col justify-between relative select-none">
          {/* Top tag */}
          <div className="flex items-center justify-between z-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200">
              Urgences &amp; Sécurité
            </span>
            <ShieldCheck className="w-4 h-4 text-blue-200" />
          </div>

          {/* Center Glowing Heart symbol in blue & white */}
          <div className="my-auto flex flex-col items-center text-center z-10">
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-gradient-to-tr from-[#8BD2F2] via-[#1D63EB] to-[#60A5FA] flex items-center justify-center text-white shadow-[0_0_40px_rgba(37,99,235,0.45)] transition-transform hover:scale-105">
              <HeartPulse className="w-10 h-10 sm:w-11 sm:h-11 text-white" />
            </div>

            <h3 className="mt-5 text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight max-w-[260px]">
              Antécédents &amp; Allergies
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-blue-100 font-medium max-w-[240px]">
              Allergies, groupe sanguin et constantes vitaux transmis en 1 seconde.
            </p>
          </div>

          {/* Bottom indicator */}
          <div className="flex items-center justify-between text-xs text-blue-200 z-10">
            <span>Protection vitale</span>
            <span className="text-white font-semibold">0 interaction à risque</span>
          </div>
        </div>
      ),
    },

    // 3. CARTE 3 : CONSTANTES & DIAGNOSTIC (Bleu et Blanc)
    {
      id: "card-ecg",
      leadTitle: "Faites vos examens et suivez vos constantes.",
      description:
        "Les bilans sanguins, radios et constantes vitales sont centralisés pour un diagnostic ultra-rapide. Les soignants accèdent immédiatement aux données sans refaire des examens inutiles.",
      linkText: "Voir les analyses compatibles",
      renderVisual: () => (
        <div className="w-full h-full bg-[#08152E] rounded-[32px] p-6 sm:p-8 flex flex-col justify-between relative select-none">
          {/* Top tag */}
          <div className="flex items-center justify-between z-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-300">
              Constantes &amp; Diagnostic
            </span>
            <Activity className="w-4 h-4 text-sky-300" />
          </div>

          {/* Center graphic: ECG Waveform in bright blue & white */}
          <div className="my-auto space-y-4 z-10">
            {/* ECG Live visualizer in blue frosted glass */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse" />
                  <span className="text-xs font-bold text-white">Rythme Cardiaque</span>
                </div>
                <span className="text-sm font-extrabold text-[#38BDF8] font-mono">72 BPM</span>
              </div>

              {/* Cyan / Electric blue ECG line */}
              <div className="w-full h-12 flex items-center justify-center">
                <svg className="w-full h-10 text-[#38BDF8]" viewBox="0 0 280 40" fill="none">
                  <path
                    d="M0 20 H50 L58 10 L68 32 L78 6 L88 28 L96 16 L104 20 H180 L188 10 L198 32 L208 6 L218 28 L226 16 L234 20 H280"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="mt-2 flex items-center justify-between text-[10px] text-blue-200">
                <span>Tracé sinusal régulier</span>
                <span className="text-white font-semibold">Examen conforme</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center justify-between text-xs text-white">
              <span className="flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-blue-200" />
                <span>Transmission au praticien</span>
              </span>
              <span className="text-[#38BDF8] font-bold">Instantané</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-blue-200 z-10">
            <span>Bilan médical universel</span>
            <span className="text-white font-semibold">Synchronisé</span>
          </div>
        </div>
      ),
    },

    // 4. CARTE 4 : TOUT VOTRE SUIVI / ORDONNANCES (Bleu et Blanc)
    {
      id: "card-ordonnances",
      leadTitle: "Tout votre suivi est enregistré.",
      description:
        "Toutes vos ordonnances, prescriptions, résultats d'analyses et radios restent archivés au même endroit sur votre application. Fini les ordonnances froissées ou perdues.",
      linkText: "En savoir plus sur les e-ordonnances",
      renderVisual: () => (
        <div className="w-full h-full bg-gradient-to-br from-[#8BD2F2] via-[#0B63E5] to-[#74C5E9] rounded-[32px] p-6 sm:p-8 flex flex-col justify-between relative select-none">
          {/* Top Heart Icon Badge */}
          <div className="z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Big Bold Headline typography in white */}
          <div className="my-auto z-10">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-[1.15]">
              Tout votre suivi médical au même endroit.
            </h3>
            <p className="mt-3 text-sm sm:text-base text-blue-100 font-medium leading-snug">
              Prescriptions actives, radios et comptes-rendus ne sont plus jamais égarés.
            </p>
          </div>

          {/* Pill indicator */}
          <div className="flex items-center justify-between text-xs text-blue-100 z-10 pt-2">
            <span>Historique 100% archivé</span>
            <span className="text-[#8BD2F2] font-bold bg-white px-2.5 py-1 rounded-full text-[11px] shadow-xs">
              Actif 24h/24
            </span>
          </div>
        </div>
      ),
    },

    // 5. CARTE 5 : TOUS LES HÔPITAUX / INTEROPÉRABILITÉ (Bleu et Blanc)
    {
      id: "card-hopitaux",
      leadTitle: "Vous pouvez aller dans n'importe quel hôpital.",
      description:
        "Que vous consultiez au CHU, en clinique privée, dans un dispensaire ou dans une autre ville, votre dossier vous accompagne en continu. Vous ne recommencez jamais de zéro.",
      linkText: "Voir le réseau hospitalier partenaire",
      renderVisual: () => (
        <div className="w-full h-full bg-[#F5F8FF] rounded-[32px] p-6 sm:p-8 flex flex-col justify-between relative select-none">
          {/* Top tag */}
          <div className="flex items-center justify-between z-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8BD2F2]">
              Réseau Universel
            </span>
            <Hospital className="w-4 h-4 text-[#8BD2F2]" />
          </div>

          {/* Center Graphic: Connected Hospitals Network */}
          <div className="my-auto space-y-2.5 z-10">
            <div className="bg-white rounded-2xl p-3 flex items-center justify-between border border-blue-100/80 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#8BD2F2] flex items-center justify-center font-bold text-xs">
                  CHU
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">CHU de Montpellier</p>
                  <p className="text-[10px] text-slate-500">Service Urgences &amp; Soins</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#8BD2F2] bg-blue-50 px-2 py-0.5 rounded border border-blue-200/50">
                Connecté
              </span>
            </div>

            <div className="bg-white rounded-2xl p-3 flex items-center justify-between border border-blue-100/80 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#8BD2F2] flex items-center justify-center font-bold text-xs">
                  CSL
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Clinique Saint-Louis</p>
                  <p className="text-[10px] text-slate-500">Maternité &amp; Chirurgie</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#8BD2F2] bg-blue-50 px-2 py-0.5 rounded border border-blue-200/50">
                Connecté
              </span>
            </div>

            <div className="bg-white rounded-2xl p-3 flex items-center justify-between border border-blue-100/80 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#8BD2F2] flex items-center justify-center font-bold text-xs">
                  CMU
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Centre Médical Urbain</p>
                  <p className="text-[10px] text-slate-500">Consultations Externes</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#8BD2F2] bg-blue-50 px-2 py-0.5 rounded border border-blue-200/50">
                Connecté
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 z-10">
            <span>Dossier médical voyageur</span>
            <span className="text-[#8BD2F2] font-bold">100% Interopérable</span>
          </div>
        </div>
      ),
    },

    // 6. CARTE 6 : CONFIDENTIALITÉ & DONNÉES PRIVÉES (Bleu et Blanc)
    {
      id: "card-securite",
      leadTitle: "Vos données sont privées.",
      description:
        "C'est vous et vous seul qui donnez l'accès au médecin lors de la consultation. L'autorisation est temporaire et vous pouvez la révoquer quand vous le souhaitez.",
      linkText: "Consulter la charte de confidentialité",
      renderVisual: () => (
        <div className="w-full h-full bg-gradient-to-br from-[#07183D] via-[#0047B3] to-[#002D75] rounded-[32px] p-6 sm:p-8 flex flex-col justify-between relative select-none">
          {/* Top lock icon */}
          <div className="z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <Lock className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Big bold text */}
          <div className="my-auto z-10">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-[1.18]">
              Consentement souverain.
            </h3>
            <p className="mt-3 text-sm sm:text-base text-blue-100 font-medium leading-snug">
              Vous détenez la clé. Aucun praticien ne peut ouvrir votre dossier sans votre accord exprès.
            </p>
          </div>

          {/* Bottom badge */}
          <div className="flex items-center justify-between text-xs text-blue-200 z-10 pt-2">
            <span>Chiffrement bout en bout</span>
            <span className="text-[#8BD2F2] font-bold bg-white px-2.5 py-1 rounded-full text-[11px] shadow-xs">
              Révocation 1 clic
            </span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full select-none">
      {/* Scrollable Track - Full Width Edge-to-Edge, No WebKit Scrollbar, No Shadows, No Borders */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className="w-full overflow-x-auto scroll-smooth no-scrollbar flex flex-nowrap gap-5 sm:gap-6 px-4 sm:px-6 lg:px-8 xl:px-[calc((100vw-80rem)/2+2rem)] py-2 cursor-grab active:cursor-grabbing [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        style={{
          WebkitOverflowScrolling: "touch",
        }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            data-card-item
            className="w-[310px] sm:w-[380px] md:w-[410px] flex-shrink-0 flex flex-col snap-start"
          >
            {/* Top Visual Card: No border, No shadow, Large Apple rounded corners */}
            <div className="h-[370px] sm:h-[410px] w-full rounded-[32px] transition-transform duration-300 hover:scale-[1.015]">
              {card.renderVisual()}
            </div>

            {/* Bottom Descriptive Text Underneath Card */}
            <div className="mt-5 sm:mt-6 px-1 text-left flex flex-col">
              <p className="text-sm sm:text-[14.5px] leading-relaxed text-slate-700">
                <strong className="font-extrabold text-[#0F172A] mr-1.5">
                  {card.leadTitle}
                </strong>
                {card.description}
              </p>

              {card.linkText && (
                <a
                  href="#demo-section"
                  onClick={(e) => {
                    e.preventDefault();
                    // trigger contact or scroll
                    const el = document.getElementById("cliniques");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="mt-2.5 inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#8BD2F2] hover:underline"
                >
                  <span>{card.linkText}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Slider Controller: Positionné à droite et aligné avec le reste de la page */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-end gap-3.5 mt-8 sm:mt-10">
        <button
          type="button"
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          aria-label="Carte précédente"
          className="w-10 h-10 rounded-full bg-slate-200/80 hover:bg-slate-300 active:scale-95 text-slate-800 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-slate-200/80"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          aria-label="Carte suivante"
          className="w-10 h-10 rounded-full bg-slate-200/80 hover:bg-slate-300 active:scale-95 text-slate-800 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-slate-200/80"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
