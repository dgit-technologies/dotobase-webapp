"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Phone, Lock, Eye, EyeOff, ShieldCheck, LogIn, CircleHelp, Hospital } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";
import Spinner from "@/components/ui/spinner";
import { toDisplayMessage } from "@/lib/api";
import { toast } from "@/components/ui/toast";
import { EXEMPLE_TELEPHONE, loginSchema, premiereErreur } from "@/lib/utils/validators";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();

  // Si l'utilisateur est déjà connecté, redirection automatique vers /dashboard (ou page demandée)
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const from =
        typeof window !== 'undefined'
          ? new URLSearchParams(window.location.search).get('from')
          : null;
      const target =
        from && from.startsWith('/') && !from.startsWith('//')
          ? from
          : '/dashboard';
      router.replace(target);
    }
  }, [isLoading, isAuthenticated, router]);

  // Connexion staff : téléphone + mot de passe (POST /v1/auth/login).
  // Le NPI n'est plus un identifiant de connexion, et il n'y a pas d'OTP
  // côté personnel — l'OTP est réservé au login patient (app mobile).
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const saisie = loginSchema.safeParse({ telephone, password });
    if (!saisie.success) {
      const msg = premiereErreur(saisie.error);
      setError(msg);
      toast.error("Formulaire invalide", msg);
      return;
    }

    setIsSubmitting(true);

    try {
      await login(saisie.data);
      toast.success("Connexion réussie", "Bienvenue sur votre espace Dotobase.");
      const from =
        typeof window !== 'undefined'
          ? new URLSearchParams(window.location.search).get('from')
          : null;
      const target =
        from && from.startsWith('/') && !from.startsWith('//')
          ? from
          : '/dashboard';
      router.push(target);
    } catch (err) {
      const msg = toDisplayMessage(err);
      setError(msg);
      toast.error("Échec de connexion", msg);
      setIsSubmitting(false);
    }
  };

  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EAF5F8] to-[#F4F9F9]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center bg-gradient-to-br from-[#EAF5F8] to-[#F4F9F9] overflow-hidden">
      {/* Background soft glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-100/50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Content */}
      <div className="z-10 w-full max-w-md px-6 flex flex-col items-center">
        {/* Logo */}
        <div className="mb-8 relative flex items-center justify-center">
          <Image 
            src="/logo.png" 
            alt="Dotobase Logo" 
            width={120} 
            height={120} 
            className="object-contain drop-shadow-sm"
          />
        </div>

        {/* Login Card */}
        <div className="w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/60 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Connexion Médecin</h1>
            <p className="text-sm text-gray-500">Accédez à votre espace sécurisé</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                {error}
              </div>
            )}

            {/* Telephone Field */}
            <div className="space-y-1.5">
              <label htmlFor="telephone" className="block text-xs font-bold text-gray-700 tracking-wide">
                Téléphone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Phone className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <input
                  id="telephone"
                  type="tel"
                  required
                  autoComplete="tel"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder={EXEMPLE_TELEPHONE}
                  className="block w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8BD2F2]/30 focus:border-[#8BD2F2] placeholder:text-gray-400 transition-colors bg-gray-50/30"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-xs font-bold text-gray-700 tracking-wide">
                  Mot de passe
                </label>
                <a href="#" className="text-xs font-bold text-[#0E1B2A] hover:text-[#8BD2F2] transition-colors">
                  Mot de passe oublié ?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8BD2F2]/30 focus:border-[#8BD2F2] transition-colors bg-gray-50/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" strokeWidth={1.5} />
                  ) : (
                    <Eye className="h-5 w-5" strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>

            {/* Security Banner */}
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 flex items-center justify-center gap-2 mt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" strokeWidth={2} />
              <span className="text-[11px] font-medium text-slate-600">Connexion sécurisée par chiffrement AES-256</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-[#0E1B2A] bg-[#8BD2F2] hover:bg-[#74C5E9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8BD2F2] transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? "Connexion en cours..." : "Se connecter"}
              {!isSubmitting && <LogIn className="w-4 h-4" strokeWidth={2} />}
            </button>
          </form>

          {/* Inscrire mon hôpital */}
          <div className="mt-6 pt-5 border-t border-gray-100 text-center space-y-2">
            <p className="text-xs text-gray-500">
              Votre structure de santé n&apos;est pas encore inscrite ?
            </p>
            <Link
              href="/inscrire-hopital"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg border border-gray-200 text-xs font-bold text-slate-700 hover:text-[#0E1B2A] hover:bg-slate-50 hover:border-[#8BD2F2] transition-colors"
            >
              <Hospital className="w-4 h-4 text-[#8BD2F2]" />
              <span>Inscrire mon hôpital</span>
            </Link>
          </div>

          {/* Help Link */}
          <div className="mt-4 pt-3 flex justify-center">
            <a href="#" className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors">
              <CircleHelp className="w-4 h-4" strokeWidth={1.5} />
              Besoin d&apos;aide ?
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full px-6 py-5 border-t border-gray-200/50 bg-white/30 backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-4 z-10">
        <div className="text-[10px] sm:text-xs font-bold text-gray-700 tracking-wider">
          DOTOBASE HEALTH SYSTEMS
        </div>
        <div className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">
          © 2024 Dotobase Health Systems. Secure Medical Access Terminal.
        </div>
        <div className="flex gap-4 md:gap-6 text-[10px] sm:text-xs font-medium text-gray-500">
          <a href="#" className="hover:text-gray-800 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gray-800 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-gray-800 transition-colors hidden sm:block">Security Standards</a>
          <a href="#" className="hover:text-gray-800 transition-colors">Contact Support</a>
        </div>
      </footer>
    </div>
  );
}
