"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Hospital,
  Building2,
  Phone,
  Mail,
  MapPin,
  User,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Send,
  AlertCircle,
  Briefcase,
} from "lucide-react";
import { etablissements } from "@/lib/api/referentiels";
import { toDisplayMessage, ApiError } from "@/lib/api";
import { toast } from "@/components/ui/toast";
import { normaliserTelephone, isTelephoneBJ, EXEMPLE_TELEPHONE } from "@/lib/utils/validators";
import type { CreateEtablissementPayload, Etablissement } from "@/lib/api/types";

const TYPES_LABELS: Record<Etablissement["type"], string> = {
  hopital: "Hôpital Public / CHU",
  clinique: "Clinique Privée",
  dispensaire: "Polyclinique / Dispensaire",
  cabinet: "Cabinet Médical",
  autre: "Autre structure de santé",
};

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function validateField(name: string, value: string | boolean): string | null {
  if (typeof value === "boolean") {
    if (name === "accepteConditions" && !value) {
      return "Veuillez confirmer que vous représentez légalement cet établissement.";
    }
    return null;
  }

  const trimmed = value.trim();

  switch (name) {
    case "nom":
      if (!trimmed) return "Le nom de l'établissement est obligatoire.";
      if (trimmed.length < 2) return "Le nom doit comporter au moins 2 caractères.";
      if (trimmed.length > 200) return "Le nom ne doit pas dépasser 200 caractères.";
      return null;

    case "type":
      if (!trimmed) return "Veuillez sélectionner le type d'établissement.";
      return null;

    case "ville":
      if (!trimmed) return "La ville est obligatoire.";
      if (trimmed.length < 2) return "La ville doit comporter au moins 2 caractères.";
      if (trimmed.length > 100) return "La ville ne doit pas dépasser 100 caractères.";
      return null;

    case "adresse":
      if (!trimmed) return "L'adresse ou le quartier est obligatoire.";
      if (trimmed.length < 3) return "L'adresse doit comporter au moins 3 caractères.";
      return null;

    case "telephone": {
      if (!trimmed) return "Le numéro de téléphone est obligatoire.";
      if (!isTelephoneBJ(trimmed)) {
        return `Numéro invalide. Format attendu : ${EXEMPLE_TELEPHONE}`;
      }
      return null;
    }

    case "email":
      if (!trimmed) return "L'email officiel est obligatoire.";
      if (!EMAIL_REGEX.test(trimmed)) {
        return "Format d'email invalide (ex: contact@etablissement.bj).";
      }
      return null;

    case "nom_representant":
      if (!trimmed) return "Le nom du représentant est obligatoire.";
      if (trimmed.length < 2) return "Le nom doit comporter au moins 2 caractères.";
      return null;

    case "prenom_representant":
      if (!trimmed) return "Le prénom du représentant est obligatoire.";
      if (trimmed.length < 2) return "Le prénom doit comporter au moins 2 caractères.";
      return null;

    case "telephone_representant": {
      if (!trimmed) return "Le téléphone direct du représentant est obligatoire.";
      if (!isTelephoneBJ(trimmed)) {
        return `Numéro invalide. Format attendu : ${EXEMPLE_TELEPHONE}`;
      }
      return null;
    }

    case "email_representant":
      if (!trimmed) return "L'email professionnel est obligatoire.";
      if (!EMAIL_REGEX.test(trimmed)) {
        return "Format d'email invalide (ex: nom@domaine.bj).";
      }
      return null;

    default:
      return null;
  }
}

export default function InscrireHopitalPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Formulaire centré sur les informations établissement et représentant légal (schéma Swagger)
  const [formData, setFormData] = useState({
    nom: "",
    type: "hopital" as Etablissement["type"],
    ville: "Cotonou",
    adresse: "",
    telephone: "",
    email: "",
    nom_representant: "",
    prenom_representant: "",
    telephone_representant: "",
    email_representant: "",
    accepteConditions: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const err = validateField(name, value);
    if (err) {
      setFieldErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation complète de tous les champs
    const newErrors: Record<string, string> = {};
    for (const [key, val] of Object.entries(formData)) {
      const err = validateField(key, val);
      if (err) {
        newErrors[key] = err;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      const msg = "Veuillez renseigner correctement tous les champs obligatoires.";
      setError(msg);
      toast.error("Champs invalides", msg);

      // Focus automatique et défilement vers le premier champ erroné
      const firstField = Object.keys(newErrors)[0];
      const elem = document.getElementById(firstField);
      if (elem) {
        elem.focus();
        try {
          elem.scrollIntoView({ behavior: "smooth", block: "center" });
        } catch {
          // ignore
        }
      }
      return;
    }

    setIsLoading(true);

    try {
      // Envoi du payload complet calqué sur la documentation Swagger
      const payload: CreateEtablissementPayload = {
        nom: formData.nom.trim(),
        type: formData.type,
        ville: formData.ville.trim(),
        adresse: formData.adresse.trim(),
        telephone: normaliserTelephone(formData.telephone.trim()),
        email: formData.email.trim(),
        nom_representant: formData.nom_representant.trim(),
        prenom_representant: formData.prenom_representant.trim(),
        telephone_representant: normaliserTelephone(formData.telephone_representant.trim()),
        email_representant: formData.email_representant.trim(),
      };

      await etablissements.demande(payload);
      setIsSubmitted(true);
      toast.success("Demande transmise", "Votre demande d'inscription a bien été reçue.");
      if (typeof window !== "undefined" && typeof window.scrollTo === "function") {
        try {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } catch {
          // ignore JSDOM
        }
      }
    } catch (err) {
      const msg = toDisplayMessage(err);
      setError(msg);
      toast.error("Erreur d'inscription", msg);

      // Si l'erreur provient du backend, rattacher chaque problème au champ correspondant
      if (err instanceof ApiError && err.body) {
        const backendErrors: Record<string, string> = {};
        const bodyObj = err.body as Record<string, unknown>;
        const rawMessages: string[] = [];

        if (Array.isArray(bodyObj.message)) {
          rawMessages.push(...bodyObj.message.filter((m): m is string => typeof m === "string"));
        } else if (typeof bodyObj.message === "string") {
          rawMessages.push(bodyObj.message);
        } else if (typeof err.message === "string") {
          rawMessages.push(err.message);
        }

        for (const rawMsg of rawMessages) {
          const lower = rawMsg.toLowerCase();
          // Représentant : téléphone
          if (
            lower.includes("telephone_representant") ||
            ((lower.includes("telephone") || lower.includes("téléphone")) &&
              (lower.includes("representant") || lower.includes("représentant")))
          ) {
            backendErrors.telephone_representant = rawMsg;
          }
          // Établissement : téléphone explicite
          else if (
            lower.includes("telephone_etablissement") ||
            ((lower.includes("telephone") || lower.includes("téléphone")) &&
              (lower.includes("etablissement") || lower.includes("établissement")))
          ) {
            backendErrors.telephone = rawMsg;
          }
          // Représentant : email
          else if (
            lower.includes("email_representant") ||
            ((lower.includes("email") || lower.includes("courriel")) &&
              (lower.includes("representant") || lower.includes("représentant")))
          ) {
            backendErrors.email_representant = rawMsg;
          }
          // Établissement : email explicite
          else if (
            lower.includes("email_etablissement") ||
            ((lower.includes("email") || lower.includes("courriel")) &&
              (lower.includes("etablissement") || lower.includes("établissement")))
          ) {
            backendErrors.email = rawMsg;
          }
          // Représentant : nom
          else if (
            lower.includes("nom_representant") ||
            (lower.includes("nom") &&
              (lower.includes("representant") || lower.includes("représentant")))
          ) {
            backendErrors.nom_representant = rawMsg;
          }
          // Représentant : prénom
          else if (
            lower.includes("prenom_representant") ||
            lower.includes("prenom") ||
            lower.includes("prénom")
          ) {
            backendErrors.prenom_representant = rawMsg;
          }
          // Établissement : nom
          else if (
            lower.includes("nom") &&
            (lower.includes("etablissement") || lower.includes("établissement") || lower.includes("structure"))
          ) {
            backendErrors.nom = rawMsg;
          }
          // Téléphone générique (le message mentionne "téléphone" sans préciser lequel)
          else if (lower.includes("telephone") || lower.includes("téléphone")) {
            const telValide = isTelephoneBJ(formData.telephone);
            const telRepValide = isTelephoneBJ(formData.telephone_representant);

            // Si le téléphone de l'établissement est valide mais pas celui du représentant,
            // l'erreur concerne nécessairement le représentant
            if (telValide && !telRepValide) {
              backendErrors.telephone_representant = rawMsg;
            } else if (!telValide && telRepValide) {
              backendErrors.telephone = rawMsg;
            } else if (lower.trim() === "telephone" || lower.startsWith("telephone must")) {
              backendErrors.telephone = rawMsg;
            } else if (!backendErrors.telephone_representant) {
              backendErrors.telephone_representant = rawMsg;
            } else {
              backendErrors.telephone = rawMsg;
            }
          }
          // Email générique
          else if (lower.includes("email") || lower.includes("courriel")) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const emailValide = emailRegex.test(formData.email.trim());
            const emailRepValide = emailRegex.test(formData.email_representant.trim());

            if (emailValide && !emailRepValide) {
              backendErrors.email_representant = rawMsg;
            } else if (!emailValide && emailRepValide) {
              backendErrors.email = rawMsg;
            } else {
              backendErrors.email = rawMsg;
            }
          } else if (lower.includes("nom")) {
            backendErrors.nom = rawMsg;
          } else if (lower.includes("ville")) {
            backendErrors.ville = rawMsg;
          } else if (lower.includes("adresse")) {
            backendErrors.adresse = rawMsg;
          }
        }

        if (Object.keys(backendErrors).length > 0) {
          setFieldErrors((prev) => ({ ...prev, ...backendErrors }));
          const firstKey = Object.keys(backendErrors)[0];
          const elem = document.getElementById(firstKey);
          if (elem) {
            elem.focus();
            try {
              elem.scrollIntoView({ behavior: "smooth", block: "center" });
            } catch {
              // ignore
            }
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getInputClasses = (hasError: boolean, hasIcon = true) => {
    const base = hasIcon
      ? "w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-colors"
      : "w-full px-4 py-2.5 rounded-xl text-sm transition-colors";
    if (hasError) {
      return `${base} bg-rose-50/50 border border-rose-400 text-rose-950 placeholder:text-rose-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-500`;
    }
    return `${base} bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8BD2F2] transition-colors`;
  };

  const getIconClasses = (hasError: boolean) => {
    return `w-4 h-4 transition-colors ${hasError ? "text-rose-500" : "text-slate-400"}`;
  };

  const getLabelClasses = (hasError: boolean) => {
    return `block text-xs font-bold mb-1.5 transition-colors ${hasError ? "text-rose-800" : "text-slate-800"}`;
  };

  const renderError = (fieldName: string) => {
    const errorMsg = fieldErrors[fieldName];
    if (!errorMsg) return null;
    return (
      <p
        id={`${fieldName}-error`}
        role="alert"
        className="text-xs text-rose-600 mt-1.5 flex items-center gap-1.5 font-medium animate-in fade-in duration-150"
      >
        <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
        <span>{errorMsg}</span>
      </p>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-[#8BD2F2]/15 selection:text-[#8BD2F2]">
      {/* Header avec Logo & Accès Connexion */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8BD2F2] rounded-lg py-1"
            aria-label="Retour à l'accueil"
          >
            <Image
              src="/Logo_written.svg"
              alt="Dotobase"
              width={180}
              height={56}
              className="h-14 w-auto object-contain group-hover:opacity-90 transition-opacity"
              priority
            />
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-slate-500 font-medium">
              Déjà partenaire ?
            </span>
            <Link
              href="/login"
              className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#0E1B2A] hover:bg-slate-100 rounded-full transition-all border border-slate-200"
            >
              Espace Connexion
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Bouton retour */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 hover:text-[#0E1B2A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l&apos;accueil</span>
          </Link>
        </div>

        {isSubmitted ? (
          /* =========================================================================
              CONFIRMATION D'ENREGISTREMENT DE LA DEMANDE
          ========================================================================= */
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-12 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-xs border border-emerald-100">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 mb-3">
              Demande enregistrée
            </span>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              Demande d&apos;inscription transmise
            </h1>

            <p className="mt-4 text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
              La demande pour l&apos;établissement{" "}
              <strong className="text-slate-900 font-bold">{formData.nom || "votre établissement"}</strong>{" "}
              a été enregistrée sur la plateforme Dotobase avec le statut{" "}
              <span className="inline-block px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                en attente
              </span>.
            </p>

            {/* Récapitulatif des données saisies */}
            <div className="mt-8 p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left max-w-lg mx-auto text-xs space-y-4 text-slate-700">
              <div>
                <p className="font-bold text-slate-900 pb-2 border-b border-slate-200 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#8BD2F2]" />
                  <span>Établissement</span>
                </p>
                <div className="mt-2 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nom :</span>
                    <span className="font-semibold text-slate-900">{formData.nom}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Type :</span>
                    <span className="font-medium text-slate-900">{TYPES_LABELS[formData.type]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ville :</span>
                    <span className="font-medium text-slate-900">{formData.ville}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Adresse :</span>
                    <span className="font-medium text-slate-900">{formData.adresse}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Téléphone :</span>
                    <span className="font-medium text-slate-900">{formData.telephone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Email officiel :</span>
                    <span className="font-medium text-slate-900">{formData.email}</span>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-200">
                  <p className="font-bold text-slate-900 pb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-[#8BD2F2]" />
                    <span>Représentant légal</span>
                  </p>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Nom &amp; Prénom :</span>
                      <span className="font-semibold text-slate-900">{formData.prenom_representant} {formData.nom_representant}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Téléphone direct :</span>
                      <span className="font-medium text-slate-900">{formData.telephone_representant}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Email :</span>
                      <span className="font-medium text-slate-900">{formData.email_representant}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-2xl mx-auto">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-[#8BD2F2] text-[#0E1B2A] font-bold text-xs flex items-center justify-center mb-2">
                  1
                </span>
                <p className="text-xs font-bold text-slate-900">Vérification</p>
                <p className="text-[11px] text-slate-500 mt-1">Examen des informations et du représentant par l&apos;administration Dotobase.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-[#8BD2F2] text-[#0E1B2A] font-bold text-xs flex items-center justify-center mb-2">
                  2
                </span>
                <p className="text-xs font-bold text-slate-900">Approbation</p>
                <p className="text-[11px] text-slate-500 mt-1">L&apos;administrateur valide la structure médicale (statut valide).</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-[#8BD2F2] text-[#0E1B2A] font-bold text-xs flex items-center justify-center mb-2">
                  3
                </span>
                <p className="text-xs font-bold text-slate-900">Notification &amp; Accès</p>
                <p className="text-[11px] text-slate-500 mt-1">Envoi d&apos;un email de confirmation au représentant avec les identifiants d&apos;accès.</p>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3 rounded-full font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors text-sm"
              >
                Retourner sur le site
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-[#0E1B2A] bg-[#8BD2F2] hover:bg-[#74C5E9] shadow-md shadow-[#8BD2F2]/20 transition-all text-sm"
              >
                <span>Espace de connexion</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* =========================================================================
              FORMULAIRE D'INSCRIPTION HÔPITAL - TOUT OBLIGATOIRE
          ========================================================================= */
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
            {/* Bannière d'en-tête */}
            <div className="bg-gradient-to-br from-[#0E1B2A] via-[#142337] to-[#1E3A5F] text-white p-6 sm:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-[#8BD2F2]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#8BD2F2] text-xs font-bold mb-3 border border-white/10">
                  <Hospital className="w-3.5 h-3.5" />
                  <span>Demande d&apos;inscription établissement de santé</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  Inscrire mon hôpital
                </h1>

                <p className="mt-2 text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                  Renseignez les coordonnées de votre structure de santé. L&apos;ensemble de ces informations est obligatoire pour valider votre demande et vous transmettre vos identifiants d&apos;accès.
                </p>
              </div>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} noValidate className="p-6 sm:p-10 space-y-8">
              {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-700 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
                  <div>
                    <strong className="block font-bold">Impossible d&apos;enregistrer la demande</strong>
                    <p className="text-xs mt-0.5 text-rose-600">{error}</p>
                  </div>
                </div>
              )}

              {/* Coordonnées de l'établissement */}
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-200">
                  <Building2 className="w-5 h-5 text-[#8BD2F2]" />
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Coordonnées de l&apos;établissement de santé
                  </h2>
                </div>

                {/* Champ 1 : Nom de l'établissement */}
                <div>
                  <label htmlFor="nom" className={getLabelClasses(!!fieldErrors.nom)}>
                    Nom de l&apos;établissement *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Building2 className={getIconClasses(!!fieldErrors.nom)} />
                    </div>
                    <input
                      id="nom"
                      name="nom"
                      required
                      minLength={2}
                      maxLength={200}
                      value={formData.nom}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={!!fieldErrors.nom}
                      aria-describedby={fieldErrors.nom ? "nom-error" : undefined}
                      placeholder="ex: Centre Hospitalier Universitaire, Clinique Sainte Famille..."
                      className={getInputClasses(!!fieldErrors.nom, true)}
                    />
                  </div>
                  {renderError("nom")}
                  {!fieldErrors.nom && (
                    <span className="text-[11px] text-slate-400 mt-1 block">Entre 2 et 200 caractères</span>
                  )}
                </div>

                {/* Champ 2 : Type de structure & Champ 3 : Ville */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="type" className={getLabelClasses(!!fieldErrors.type)}>
                      Type de structure *
                    </label>
                    <select
                      id="type"
                      name="type"
                      required
                      value={formData.type}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={!!fieldErrors.type}
                      aria-describedby={fieldErrors.type ? "type-error" : undefined}
                      className={getInputClasses(!!fieldErrors.type, false)}
                    >
                      <option value="hopital">Hôpital Public / CHU</option>
                      <option value="clinique">Clinique Privée</option>
                      <option value="dispensaire">Polyclinique / Dispensaire</option>
                      <option value="cabinet">Cabinet Médical Spécialisé</option>
                      <option value="autre">Autre structure de soins</option>
                    </select>
                    {renderError("type")}
                  </div>

                  <div>
                    <label htmlFor="ville" className={getLabelClasses(!!fieldErrors.ville)}>
                      Ville *
                    </label>
                    <input
                      id="ville"
                      name="ville"
                      required
                      minLength={2}
                      maxLength={100}
                      value={formData.ville}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={!!fieldErrors.ville}
                      aria-describedby={fieldErrors.ville ? "ville-error" : undefined}
                      placeholder="ex: Cotonou, Porto-Novo, Parakou..."
                      className={getInputClasses(!!fieldErrors.ville, false)}
                    />
                    {renderError("ville")}
                  </div>
                </div>

                {/* Champ 4 : Adresse */}
                <div>
                  <label htmlFor="adresse" className={getLabelClasses(!!fieldErrors.adresse)}>
                    Adresse ou quartier physique *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <MapPin className={getIconClasses(!!fieldErrors.adresse)} />
                    </div>
                    <input
                      id="adresse"
                      name="adresse"
                      required
                      value={formData.adresse}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={!!fieldErrors.adresse}
                      aria-describedby={fieldErrors.adresse ? "adresse-error" : undefined}
                      placeholder="ex: Quartier Haie Vive, Rue 241"
                      className={getInputClasses(!!fieldErrors.adresse, true)}
                    />
                  </div>
                  {renderError("adresse")}
                </div>

                {/* Champ 5 & 6 : Téléphone et Email officiel */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="telephone" className={getLabelClasses(!!fieldErrors.telephone)}>
                      Téléphone de l&apos;établissement *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Phone className={getIconClasses(!!fieldErrors.telephone)} />
                      </div>
                      <input
                        id="telephone"
                        name="telephone"
                        type="tel"
                        required
                        value={formData.telephone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-invalid={!!fieldErrors.telephone}
                        aria-describedby={fieldErrors.telephone ? "telephone-error" : undefined}
                        placeholder={EXEMPLE_TELEPHONE}
                        className={getInputClasses(!!fieldErrors.telephone, true)}
                      />
                    </div>
                    {renderError("telephone")}
                    {!fieldErrors.telephone && (
                      <span className="text-[11px] text-slate-400 mt-1 block">Format Bénin ({EXEMPLE_TELEPHONE})</span>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className={getLabelClasses(!!fieldErrors.email)}>
                      Email officiel de l&apos;établissement *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Mail className={getIconClasses(!!fieldErrors.email)} />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-invalid={!!fieldErrors.email}
                        aria-describedby={fieldErrors.email ? "email-error" : undefined}
                        placeholder="contact@etablissement.bj"
                        className={getInputClasses(!!fieldErrors.email, true)}
                      />
                    </div>
                    {renderError("email")}
                  </div>
                </div>
              </div>

              {/* Coordonnées du représentant légal */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-200">
                  <User className="w-5 h-5 text-[#8BD2F2]" />
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Représentant légal de l&apos;établissement
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nom du représentant */}
                  <div>
                    <label htmlFor="nom_representant" className={getLabelClasses(!!fieldErrors.nom_representant)}>
                      Nom du représentant *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <User className={getIconClasses(!!fieldErrors.nom_representant)} />
                      </div>
                      <input
                        id="nom_representant"
                        name="nom_representant"
                        required
                        value={formData.nom_representant}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-invalid={!!fieldErrors.nom_representant}
                        aria-describedby={fieldErrors.nom_representant ? "nom_representant-error" : undefined}
                        placeholder="ex: Diallo"
                        className={getInputClasses(!!fieldErrors.nom_representant, true)}
                      />
                    </div>
                    {renderError("nom_representant")}
                  </div>

                  {/* Prénom du représentant */}
                  <div>
                    <label htmlFor="prenom_representant" className={getLabelClasses(!!fieldErrors.prenom_representant)}>
                      Prénom du représentant *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <User className={getIconClasses(!!fieldErrors.prenom_representant)} />
                      </div>
                      <input
                        id="prenom_representant"
                        name="prenom_representant"
                        required
                        value={formData.prenom_representant}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-invalid={!!fieldErrors.prenom_representant}
                        aria-describedby={fieldErrors.prenom_representant ? "prenom_representant-error" : undefined}
                        placeholder="ex: Awa"
                        className={getInputClasses(!!fieldErrors.prenom_representant, true)}
                      />
                    </div>
                    {renderError("prenom_representant")}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Téléphone du représentant */}
                  <div>
                    <label htmlFor="telephone_representant" className={getLabelClasses(!!fieldErrors.telephone_representant)}>
                      Téléphone direct du représentant *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Phone className={getIconClasses(!!fieldErrors.telephone_representant)} />
                      </div>
                      <input
                        id="telephone_representant"
                        name="telephone_representant"
                        type="tel"
                        required
                        value={formData.telephone_representant}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-invalid={!!fieldErrors.telephone_representant}
                        aria-describedby={fieldErrors.telephone_representant ? "telephone_representant-error" : undefined}
                        placeholder={EXEMPLE_TELEPHONE}
                        className={getInputClasses(!!fieldErrors.telephone_representant, true)}
                      />
                    </div>
                    {renderError("telephone_representant")}
                    {!fieldErrors.telephone_representant && (
                      <span className="text-[11px] text-slate-400 mt-1 block">Format Bénin ({EXEMPLE_TELEPHONE})</span>
                    )}
                  </div>

                  {/* Email du représentant */}
                  <div>
                    <label htmlFor="email_representant" className={getLabelClasses(!!fieldErrors.email_representant)}>
                      Email professionnel du représentant *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Mail className={getIconClasses(!!fieldErrors.email_representant)} />
                      </div>
                      <input
                        id="email_representant"
                        name="email_representant"
                        type="email"
                        required
                        value={formData.email_representant}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-invalid={!!fieldErrors.email_representant}
                        aria-describedby={fieldErrors.email_representant ? "email_representant-error" : undefined}
                        placeholder="awa.diallo@example.com"
                        className={getInputClasses(!!fieldErrors.email_representant, true)}
                      />
                    </div>
                    {renderError("email_representant")}
                  </div>
                </div>
              </div>

              {/* Sécurité & Consentement */}
              <div className={`rounded-2xl p-4 sm:p-5 border transition-all ${
                fieldErrors.accepteConditions 
                  ? 'bg-rose-50/40 border-rose-400 ring-2 ring-rose-300/30' 
                  : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Validation &amp; Sécurité des données de santé</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Votre demande sera transmise à l&apos;équipe Dotobase. Une fois validée par un administrateur, votre établissement recevra ses identifiants et pourra intégrer ses praticiens.
                </p>
                <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    id="accepteConditions"
                    name="accepteConditions"
                    required
                    checked={formData.accepteConditions}
                    onChange={handleCheckboxChange}
                    className="mt-0.5 rounded text-[#8BD2F2] focus:ring-[#8BD2F2] border-slate-300"
                  />
                  <span className={`text-xs font-medium leading-snug ${fieldErrors.accepteConditions ? 'text-rose-700 font-semibold' : 'text-slate-700'}`}>
                    Je confirme représenter légalement cet établissement de santé et formule cette demande en son nom. *
                  </span>
                </label>
                {renderError("accepteConditions")}
              </div>

              {/* Bouton d'envoi */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-2xl font-extrabold text-[#0E1B2A] bg-[#8BD2F2] hover:bg-[#74C5E9] shadow-lg shadow-[#8BD2F2]/25 hover:shadow-xl transition-all text-base flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span>Envoi de votre demande en cours...</span>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Inscrire mon hôpital</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Footer minimal */}
      <footer className="w-full border-t border-slate-200 bg-white py-8 px-4 sm:px-6 text-xs text-slate-500 text-center">
        <p>© {new Date().getFullYear()} Dotobase Health Systems. Plateforme nationale de santé.</p>
      </footer>
    </div>
  );
}
