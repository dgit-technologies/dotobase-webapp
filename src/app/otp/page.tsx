"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Clock, ShieldCheck, BriefcaseMedical } from "lucide-react";

/**
 * ÉCRAN NON BRANCHÉ (maquette P02).
 *
 * Le backend Nest n'expose pas d'OTP pour le personnel : le staff se connecte
 * en une étape (téléphone + mot de passe, voir /login). L'OTP existe côté
 * backend uniquement pour les PATIENTS (`/v1/auth/otp/request` puis
 * `/v1/auth/otp/verify`), qui se connectent depuis l'app mobile.
 *
 * Deux issues possibles, à trancher avec le produit :
 * - supprimer cet écran du parcours webapp ;
 * - ou demander au backend une seconde étape OTP pour le login staff, et
 *   brancher cet écran sur `api.auth` (les appels existent déjà côté client).
 */
export default function OTPPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(120);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("OTP submitted:", otp.join(""));
    // Prototype mode: Redirect to the dashboard
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] font-sans">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
        <div className="text-[#1D99D4] text-xl font-bold tracking-tight">
          Dotobase
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
            Support
          </a>
          <button className="text-sm font-bold text-[#14578E] border border-[#14578E]/30 px-4 py-2 rounded bg-blue-50/30 hover:bg-blue-50 transition-colors">
            Emergency Access
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center relative p-6">
        
        {/* Wrapper for Card to place the floating avatar relative to it */}
        <div className="relative w-full max-w-[440px]">
          {/* Main Card */}
          <div className="bg-white rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 px-8 py-10 relative z-10 text-center w-full">
            
            {/* Icon */}
            <div className="mx-auto w-12 h-12 bg-[#2299D2] rounded-lg flex items-center justify-center text-white mb-6 shadow-sm">
              <BriefcaseMedical className="w-6 h-6" strokeWidth={2} />
            </div>

            {/* Typography */}
            <h1 className="text-[22px] font-bold text-gray-900 mb-3 tracking-tight">
              Vérification de sécurité
            </h1>
            <p className="text-[13px] leading-relaxed text-gray-600 font-medium mb-8 px-2">
              Un code de vérification a été envoyé par SMS au numéro associé à votre compte NPI.
            </p>

            {/* OTP Form */}
            <form onSubmit={handleSubmit}>
              <div className="flex justify-between gap-2 sm:gap-3 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-11 h-12 sm:w-12 sm:h-14 bg-white border border-gray-300 rounded-md text-center text-xl font-semibold text-gray-900 focus:border-[#2299D2] focus:ring-1 focus:ring-[#2299D2] outline-none transition-all"
                  />
                ))}
              </div>

              {/* Timer */}
              <div className="flex items-center justify-center gap-2 text-[13px] font-bold text-gray-600 mb-6">
                <Clock className="w-4 h-4" strokeWidth={2} />
                <span>Temps restant : {formatTime(timeLeft)}</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#2299D2] hover:bg-[#1D86B9] text-white font-bold text-[13px] py-3.5 rounded-md transition-colors tracking-wide"
              >
                VALIDER
              </button>
            </form>

            {/* Resend Link */}
            <div className="mt-5">
              <button className="text-[13px] font-bold text-[#14578E] hover:underline transition-all">
                Renvoyer le code
              </button>
            </div>

            {/* Divider */}
            <div className="w-full border-t border-gray-100 mt-8 mb-5" />

            {/* Security Footer in Card */}
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" strokeWidth={2.5} />
              <span className="text-[10px] font-bold text-emerald-800">
                Connexion chiffrée de bout en bout
              </span>
            </div>

          </div>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="w-full bg-[#F8F9FA] border-t border-gray-200 px-6 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-gray-500">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-gray-700">Dotobase Systems</span>
          <span className="text-[11px] font-medium text-gray-500">
            © 2026 Dotobase Systems. Clinical Data Protection Protocol v4.2
          </span>
        </div>
        <div className="flex flex-wrap gap-4 md:gap-6 text-[10px] sm:text-[11px] font-bold">
          <a href="#" className="hover:text-gray-800 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gray-800 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-gray-800 transition-colors">HIPAA Compliance</a>
          <a href="#" className="hover:text-gray-800 transition-colors">Technical Support</a>
        </div>
      </footer>
    </div>
  );
}

