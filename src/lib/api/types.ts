/**
 * Types du schéma de données, synchronisés avec le backend Nest
 * (`dotobase-backend/src/common/database.types.ts`).
 *
 * La webapp ne parle plus à Supabase directement : ces types décrivent ce que
 * l'API renvoie (les lignes de tables telles que le backend les expose), pas
 * un client Supabase. Toute modification de table doit être répercutée dans
 * les deux dépôts tant que la génération n'est pas unifiée.
 *
 * Différence majeure avec l'ancien schéma webapp : la table `users` porte
 * désormais l'identité et l'authentification de TOUS les comptes (staff et
 * patients). `npi`, `telephone`, `email` et le mot de passe ont quitté
 * `medecins` / `patients` pour `users` ; ces tables pointent vers le compte
 * via `utilisateur_id`. Le NPI n'est plus un identifiant de connexion (ANIP
 * indisponible), il reste une donnée de profil optionnelle.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      specialites: {
        Row: { id: string; code: string; nom: string };
      };
      etablissements: {
        Row: {
          id: string;
          nom: string;
          type: 'hopital' | 'clinique' | 'dispensaire' | 'cabinet' | 'autre';
          ville: string;
          adresse: string | null;
          telephone: string | null;
          email: string | null;
          nom_representant?: string | null;
          prenom_representant?: string | null;
          fonction_representant?: string | null;
          telephone_representant?: string | null;
          email_representant?: string | null;
          // 'valide' immédiat si créé par un admin, 'en_attente' si issu
          // d'une demande d'inscription publique (à approuver/refuser).
          statut: 'en_attente' | 'valide' | 'refuse';
          motif_refus?: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      etablissement_specialites: {
        Row: {
          id: string;
          etablissement_id: string;
          specialite_id: string;
          created_at: string;
        };
      };
      // Identité + auth commune à tout le staff ET aux patients. Jamais
      // exposée telle quelle par l'API (pas de controller `users`) : on la
      // voit uniquement à travers `/auth/me`.
      users: {
        Row: {
          id: string;
          npi: string | null;
          type: 'medecin' | 'infirmier' | 'admin' | 'directeur' | 'patient';
          telephone: string;
          email: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      medecins: {
        Row: {
          id: string;
          utilisateur_id: string;
          nom: string;
          prenom: string;
          specialite_id: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      infirmiers: {
        Row: {
          id: string;
          utilisateur_id: string;
          nom: string;
          prenom: string;
          service: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      medecin_etablissements: {
        Row: {
          id: string;
          medecin_id: string;
          etablissement_id: string;
          role: 'medecin' | 'infirmier' | 'admin' | 'directeur';
          est_principal: boolean;
          created_at: string;
        };
      };
      infirmier_etablissements: {
        Row: {
          id: string;
          infirmier_id: string;
          etablissement_id: string;
          role: 'medecin' | 'infirmier' | 'admin' | 'directeur';
          est_principal: boolean;
          created_at: string;
        };
      };
      // Pas de FK établissement : le dossier patient est national et unique,
      // il n'appartient à aucune clinique (voir acces_dossiers).
      patients: {
        Row: {
          id: string;
          utilisateur_id: string;
          nom: string;
          prenom: string;
          date_naissance: string;
          sexe: 'M' | 'F';
          adresse: string | null;
          groupe_sanguin:
            | 'A+'
            | 'A-'
            | 'B+'
            | 'B-'
            | 'AB+'
            | 'AB-'
            | 'O+'
            | 'O-'
            | null;
          created_at: string;
          updated_at: string;
        };
      };
      dossiers_medicaux: {
        Row: {
          id: string;
          patient_id: string;
          created_at: string;
          updated_at: string;
        };
      };
      icd10_codes: {
        Row: {
          id: string;
          code: string;
          description_fr: string;
          categorie: string | null;
          sous_categorie: string | null;
        };
      };
      consultations: {
        Row: {
          id: string;
          patient_id: string;
          medecin_id: string;
          etablissement_id: string;
          type: 'rdv' | 'urgence' | 'walk_in' | 'telemedicine';
          motif: string;
          service: string | null;
          salle: string | null;
          statut: 'en_cours' | 'terminee' | 'annulee';
          notes: string | null;
          date_consultation: string;
          created_at: string;
          updated_at: string;
        };
      };
      constantes_vitales: {
        Row: {
          id: string;
          consultation_id: string;
          tension_systolique: number | null;
          tension_diastolique: number | null;
          temperature: number | null;
          frequence_cardiaque: number | null;
          spo2: number | null;
          poids: number | null;
          taille: number | null;
          observations: string | null;
          created_at: string;
        };
      };
      // Symptômes rattachés à la consultation (ce que rapporte le patient),
      // pas au diagnostic (ce que le médecin retient, voir icd10_code_id).
      symptomes: {
        Row: { id: string; code: string; nom: string };
      };
      consultation_symptomes: {
        Row: {
          id: string;
          consultation_id: string;
          symptome_id: string;
          created_at: string;
        };
      };
      diagnostics: {
        Row: {
          id: string;
          consultation_id: string;
          patient_id: string;
          icd10_code_id: string | null;
          code_libre: string | null;
          type: 'principal' | 'secondaire' | 'differentiel';
          commentaire: string | null;
          severite: 'legere' | 'moderee' | 'severe' | 'critique' | null;
          created_at: string;
          updated_at: string;
        };
      };
      medicaments: {
        Row: {
          id: string;
          nom: string;
          classe: string | null;
          forme: string | null;
          dosages_disponibles: Json;
          actif: boolean;
        };
      };
      traitements: {
        Row: {
          id: string;
          patient_id: string;
          medecin_id: string;
          consultation_id: string | null;
          medicament_id: string | null;
          medicament_libre: string | null;
          dosage: string;
          voie: string;
          frequence: string;
          date_debut: string;
          date_fin: string | null;
          posologie: string | null;
          precautions: string | null;
          statut: 'actif' | 'termine' | 'suspendu' | 'annule';
          created_at: string;
          updated_at: string;
        };
      };
      ordonnances: {
        Row: {
          id: string;
          consultation_id: string;
          patient_id: string;
          medecin_id: string;
          numero: string;
          date_emission: string;
          date_validite: string;
          instructions_generales: string | null;
          statut: 'active' | 'expiree' | 'annulee';
          created_at: string;
          updated_at: string;
        };
      };
      documents: {
        Row: {
          id: string;
          patient_id: string;
          medecin_id: string;
          consultation_id: string | null;
          categorie:
            | 'analyse'
            | 'imagerie'
            | 'ecg'
            | 'compte_rendu'
            | 'ordonnance'
            | 'autre';
          titre: string;
          url_storage: string;
          format: string | null;
          taille_octets: number | null;
          est_urgent: boolean;
          priorite: 'normal' | 'important' | 'critique';
          created_at: string;
          updated_at: string;
        };
      };
      examens: {
        Row: {
          id: string;
          patient_id: string;
          medecin_id: string;
          consultation_id: string | null;
          type_examen:
            | 'analyse_sanguine'
            | 'imagerie'
            | 'ecg'
            | 'biopsie'
            | 'endoscopie'
            | 'autre';
          nom: string;
          priorite: 'faible' | 'normale' | 'urgente';
          statut: 'en_attente' | 'en_cours' | 'termine' | 'annule';
          motif: string | null;
          instructions: string | null;
          date_demande: string;
          date_resultat: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      // Accès accordé à un ÉTABLISSEMENT entier (pas à un médecin précis) :
      // le patient autorise temporairement tout le personnel d'un
      // établissement à consulter son dossier.
      acces_dossiers: {
        Row: {
          id: string;
          patient_id: string;
          etablissement_id: string;
          motif: 'consultation' | 'urgence' | 'suivi' | 'transfert' | 'autre';
          methode_auth: 'otp' | 'empreinte';
          duree_heures: 12 | 24 | 168 | 720;
          date_expiration: string;
          statut: 'en_attente' | 'approuve' | 'refuse' | 'expire';
          created_at: string;
          updated_at: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          table_name: string;
          record_id: string;
          action: 'INSERT' | 'UPDATE' | 'DELETE' | 'SELECT';
          medecin_id: string | null;
          old_values: Json | null;
          new_values: Json | null;
          ip_address: string | null;
          created_at: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          medecin_id: string;
          type:
            | 'nouveau_patient'
            | 'resultat_analyse'
            | 'demande_acces'
            | 'alerte_critique'
            | 'systeme';
          titre: string;
          message: string;
          est_lue: boolean;
          data: Json;
          created_at: string;
        };
      };
      empreintes_patients: {
        Row: {
          id: string;
          patient_id: string;
          doigt: Doigt;
          /** Template biométrique encodé (ISO/ANSI), pas l'image brute. */
          template: string;
          qualite_capture: number | null;
          device_id: string | null;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

/* --------------------------------------------------------------------------
 * Alias de lecture — ce que renvoient les endpoints GET
 * ----------------------------------------------------------------------- */

export type Specialite = Tables<'specialites'>;
export type Etablissement = Tables<'etablissements'>;
export type EtablissementSpecialite = Tables<'etablissement_specialites'>;
export type UserAccount = Tables<'users'>;
export type Medecin = Tables<'medecins'>;
export type Infirmier = Tables<'infirmiers'>;
export type MedecinEtablissement = Tables<'medecin_etablissements'>;
export type InfirmierEtablissement = Tables<'infirmier_etablissements'>;
export type Patient = Tables<'patients'>;
export type DossierMedical = Tables<'dossiers_medicaux'>;
export type Icd10Code = Tables<'icd10_codes'>;
export type Consultation = Tables<'consultations'>;
export type ConstantesVitales = Tables<'constantes_vitales'>;
export type Symptome = Tables<'symptomes'>;
export type ConsultationSymptome = Tables<'consultation_symptomes'>;
export type Diagnostic = Tables<'diagnostics'>;
export type Medicament = Tables<'medicaments'>;
export type Traitement = Tables<'traitements'>;
export type Ordonnance = Tables<'ordonnances'>;
export type DocumentMedical = Tables<'documents'>;
export type Examen = Tables<'examens'>;
export type AccesDossier = Tables<'acces_dossiers'>;
export type AuditLog = Tables<'audit_logs'>;
export type Notification = Tables<'notifications'>;
export type EmpreintePatient = Tables<'empreintes_patients'>;

export type UserType = UserAccount['type'];
export type RoleEtablissement = MedecinEtablissement['role'];
export type Sexe = Patient['sexe'];
export type GroupeSanguin = NonNullable<Patient['groupe_sanguin']>;
export type StatutConsultation = Consultation['statut'];
export type TypeConsultation = Consultation['type'];
export type DureeAccesHeures = AccesDossier['duree_heures'];
export type Doigt =
  | 'pouce_droit'
  | 'index_droit'
  | 'majeur_droit'
  | 'annulaire_droit'
  | 'auriculaire_droit'
  | 'pouce_gauche'
  | 'index_gauche'
  | 'majeur_gauche'
  | 'annulaire_gauche'
  | 'auriculaire_gauche';

/* --------------------------------------------------------------------------
 * Authentification
 * ----------------------------------------------------------------------- */

export interface LoginPayload {
  /** Format international E.164, ex: `+2290161000000`. */
  telephone: string;
  password: string;
}

/** Le refresh token n'est pas dans le body : il arrive en cookie HttpOnly. */
export interface LoginResponse {
  access_token: string;
}

export interface OtpRequestPayload {
  telephone: string;
}

export interface OtpVerifyPayload {
  telephone: string;
  /** Code à 6 chiffres reçu par SMS. */
  code: string;
}

/** Flow patient (mobile) : les deux tokens sont dans le body. */
export interface OtpVerifyResponse {
  access_token: string;
  refresh_token: string;
}

export interface GenericMessageResponse {
  message: string;
}

export interface AuthMeEtablissementLien {
  etablissement_id: string;
  role: string;
  est_principal: boolean;
}

/**
 * Réponse brute renvoyée par le backend Nest sur `GET /v1/auth/me`.
 * Depuis la fonctionnalité multi-profil, le compte peut porter plusieurs
 * profils métiers simultanément (ex: admin ou médecin ayant aussi un dossier patient).
 */
export interface AuthMeResponse {
  telephone: string;
  type: UserType;
  medecin?: Medecin;
  infirmier?: Infirmier;
  patient?: Patient;
  etablissements?: AuthMeEtablissementLien[];
}

/**
 * Profil normalisé du compte connecté, aplati pour utilisation directe dans la webapp.
 */
export type AuthProfile = (
  | (Medecin & { telephone: string; type: 'medecin' | 'admin' | 'directeur' })
  | (Infirmier & { telephone: string; type: 'infirmier' })
  | (Patient & { telephone: string; type: 'patient' })
) & {
  etablissements?: AuthMeEtablissementLien[];
};

/* --------------------------------------------------------------------------
 * Payloads d'écriture — calqués sur les DTO Nest.
 *
 * Le backend valide avec `forbidNonWhitelisted: true` : toute propriété non
 * déclarée dans le DTO fait échouer la requête en 400. Ne pas envoyer d'objet
 * "row complet" (id, created_at…) sur un POST/PATCH.
 * ----------------------------------------------------------------------- */

/** Crée le compte `users` ET le profil `medecins` en une requête. */
export interface CreateMedecinPayload {
  telephone: string;
  password?: string;
  npi?: string;
  email?: string;
  nom: string;
  prenom: string;
  specialite_id?: string;
  etablissement_id?: string;
}

export interface UpdateMedecinPayload {
  nom?: string;
  prenom?: string;
  specialite_id?: string;
}

export interface CreateInfirmierPayload {
  telephone: string;
  password?: string;
  npi?: string;
  email?: string;
  nom: string;
  prenom: string;
  service?: string;
  etablissement_id?: string;
}

export interface UpdateInfirmierPayload {
  nom?: string;
  prenom?: string;
  service?: string;
}

export interface CreateMedecinEtablissementPayload {
  medecin_id: string;
  etablissement_id: string;
  role?: RoleEtablissement;
  est_principal?: boolean;
}

export interface UpdateAffectationPayload {
  role?: RoleEtablissement;
  est_principal?: boolean;
}

export interface CreateInfirmierEtablissementPayload {
  infirmier_id: string;
  etablissement_id: string;
  role?: RoleEtablissement;
  est_principal?: boolean;
}

/** Le patient n'a pas de mot de passe : il se connecte par OTP. */
export interface CreatePatientPayload {
  npi?: string;
  nom: string;
  prenom: string;
  /** ISO 8601, `YYYY-MM-DD`. */
  date_naissance: string;
  sexe: Sexe;
  telephone: string;
  email?: string;
  adresse?: string;
  groupe_sanguin?: GroupeSanguin;
}

export interface UpdatePatientPayload {
  nom?: string;
  prenom?: string;
  date_naissance?: string;
  sexe?: Sexe;
  adresse?: string;
  groupe_sanguin?: GroupeSanguin;
}

export interface CreateConsultationPayload {
  patient_id: string;
  medecin_id: string;
  etablissement_id: string;
  type: TypeConsultation;
  motif: string;
  service?: string;
  salle?: string;
  statut?: StatutConsultation;
  notes?: string;
  /** ISO 8601 complet, ex: `2026-08-09T09:30:00.000Z`. */
  date_consultation: string;
}

export type UpdateConsultationPayload = Partial<CreateConsultationPayload>;

export interface CreateDiagnosticPayload {
  consultation_id: string;
  patient_id: string;
  icd10_code_id?: string;
  code_libre?: string;
  type: Diagnostic['type'];
  commentaire?: string;
  severite?: NonNullable<Diagnostic['severite']>;
}

export type UpdateDiagnosticPayload = Partial<CreateDiagnosticPayload>;

export interface CreateTraitementPayload {
  patient_id: string;
  medecin_id: string;
  consultation_id?: string;
  medicament_id?: string;
  medicament_libre?: string;
  dosage: string;
  voie: string;
  frequence: string;
  date_debut: string;
  date_fin?: string;
  posologie?: string;
  precautions?: string;
  statut?: Traitement['statut'];
}

export type UpdateTraitementPayload = Partial<CreateTraitementPayload>;

export interface CreateOrdonnancePayload {
  consultation_id: string;
  patient_id: string;
  medecin_id: string;
  numero: string;
  date_emission: string;
  date_validite: string;
  instructions_generales?: string;
  statut?: Ordonnance['statut'];
}

export type UpdateOrdonnancePayload = Partial<CreateOrdonnancePayload>;

export interface CreateExamenPayload {
  patient_id: string;
  medecin_id: string;
  consultation_id?: string;
  type_examen: Examen['type_examen'];
  nom: string;
  priorite?: Examen['priorite'];
  statut?: Examen['statut'];
  motif?: string;
  instructions?: string;
  date_demande: string;
  date_resultat?: string;
}

export type UpdateExamenPayload = Partial<CreateExamenPayload>;

export interface CreateDocumentPayload {
  patient_id: string;
  medecin_id: string;
  consultation_id?: string;
  categorie: DocumentMedical['categorie'];
  titre: string;
  /** URL du fichier dans le storage (l'upload ne passe pas par cette API). */
  url_storage: string;
  format?: string;
  taille_octets?: number;
  est_urgent?: boolean;
  priorite?: DocumentMedical['priorite'];
}

export type UpdateDocumentPayload = Partial<CreateDocumentPayload>;

export interface CreateNotificationPayload {
  medecin_id: string;
  type: Notification['type'];
  titre: string;
  message: string;
  data?: Json;
}

export interface CreateAccesPayload {
  patient_id: string;
  etablissement_id: string;
  motif: AccesDossier['motif'];
  methode_auth: AccesDossier['methode_auth'];
  duree_heures: DureeAccesHeures;
  date_expiration: string;
}

export type UpdateAccesPayload = Partial<CreateAccesPayload> & {
  statut?: AccesDossier['statut'];
};

export interface CreateAuditLogPayload {
  table_name: string;
  record_id: string;
  action: AuditLog['action'];
  medecin_id?: string;
  old_values?: Json;
  new_values?: Json;
  ip_address?: string;
}

export interface CreateEmpreintePayload {
  patient_id: string;
  doigt: Doigt;
  template: string;
  qualite_capture?: number;
  device_id?: string;
}

export interface IdentifierPayload {
  template: string;
  device_id?: string;
}

export interface CreateSpecialitePayload {
  code: string;
  nom: string;
}

export type UpdateSpecialitePayload = Partial<CreateSpecialitePayload>;

export interface CreateEtablissementPayload {
  nom: string;
  type: Etablissement['type'];
  ville: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  nom_representant?: string;
  prenom_representant?: string;
  fonction_representant?: string;
  telephone_representant?: string;
  email_representant?: string;
}

export type UpdateEtablissementPayload = Partial<CreateEtablissementPayload>;

export interface RefuserEtablissementPayload {
  motif?: string;
}

export interface CreateEtablissementSpecialitePayload {
  etablissement_id: string;
  specialite_id: string;
}

export interface CreateSymptomePayload {
  code: string;
  nom: string;
}

export type UpdateSymptomePayload = Partial<CreateSymptomePayload>;

export interface CreateConsultationSymptomePayload {
  consultation_id: string;
  symptome_id: string;
}
