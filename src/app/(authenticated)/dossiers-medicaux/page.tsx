'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  UserPlus, 
  Stethoscope, 
  Search, 
  ChevronDown, 
  Eye,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Fingerprint,
  IdCard,
  Info,
  MoreHorizontal,
  ShieldCheck,
  Smartphone,
  Clock,
  Lock,
  User,
  Shield,
  FolderHeart,
  Phone,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/ui/spinner';
import { api, toDisplayMessage } from '@/lib/api';
import { toast } from '@/components/ui/toast';
import type { Patient, Consultation, Traitement, Diagnostic, AuditLog, AccesDossier } from '@/lib/api/types';
import { useAuth } from '@/lib/hooks/use-auth';
import {
  calculerAge,
  extraireInitiales,
  formaterDateDerniereVisite,
  formaterNpi,
} from '@/lib/utils/formatters';

export default function PatientsPage() {
  const router = useRouter();
  const { etablissementActif, role } = useAuth();

  // Données chargées depuis l'API
  const [patients, setPatients] = useState<Patient[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [traitements, setTraitements] = useState<Traitement[]>([]);
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [accesDossiers, setAccesDossiers] = useState<AccesDossier[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Timestamp stable pour pureté des calculs de dates
  const [referenceTimestamp] = useState(() => Date.now());

  // Recherche & Filtres
  const [recherche, setRecherche] = useState('');
  const [filtreGenre, setFiltreGenre] = useState('');
  const [filtreAge, setFiltreAge] = useState('');
  const [filtreGroupeSanguin, setFiltreGroupeSanguin] = useState('');
  const [filtreAlertes, setFiltreAlertes] = useState('');
  const [filtreVisite, setFiltreVisite] = useState('');

  // Pagination
  const [pageCourante, setPageCourante] = useState(1);
  const elementsParPage = 8;

  // Modale "Ouvrir un dossier"
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'npi' | 'fingerprint'>('npi');
  const [searchStatus, setSearchStatus] = useState<'idle' | 'waiting' | 'success' | 'not_found' | 'create'>('idle');
  const [inputRechercheModal, setInputRechercheModal] = useState('');
  const [patientTrouve, setPatientTrouve] = useState<Patient | null>(null);
  const [erreurModal, setErreurModal] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  // Formulaire de création rapide (patient sans dossier)
  const [formNom, setFormNom] = useState('');
  const [formPrenom, setFormPrenom] = useState('');
  const [formTelephone, setFormTelephone] = useState('');
  const [formDateNaissance, setFormDateNaissance] = useState('');
  const [formSexe, setFormSexe] = useState<'M' | 'F'>('M');
  const [formNpi, setFormNpi] = useState('');
  const [formGroupeSanguin, setFormGroupeSanguin] = useState<string>('');
  const [formAdresse, setFormAdresse] = useState('');
  const [isSubmittingPatient, setIsSubmittingPatient] = useState(false);
  const [erreurCreation, setErreurCreation] = useState('');

  // Chargement des données backend
  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const [pRes, cRes, tRes, dRes, aRes, accRes] = await Promise.allSettled([
          api.patients.list(),
          api.consultations.list(),
          api.traitements.list(),
          api.diagnostics.list(),
          api.audit.list(),
          etablissementActif?.id
            ? api.acces.list({ etablissement_id: etablissementActif.id })
            : api.acces.list(),
        ]);

        if (cancelled) return;

        if (pRes.status === 'fulfilled') {
          setPatients(Array.isArray(pRes.value) ? pRes.value : []);
        } else {
          toast.error('Erreur patients', toDisplayMessage(pRes.reason));
        }

        if (cRes.status === 'fulfilled') {
          setConsultations(Array.isArray(cRes.value) ? cRes.value : []);
        }

        if (tRes.status === 'fulfilled') {
          setTraitements(Array.isArray(tRes.value) ? tRes.value : []);
        }

        if (dRes.status === 'fulfilled') {
          setDiagnostics(Array.isArray(dRes.value) ? dRes.value : []);
        }

        if (aRes.status === 'fulfilled') {
          setAuditLogs(Array.isArray(aRes.value) ? aRes.value : []);
        }

        if (accRes.status === 'fulfilled') {
          setAccesDossiers(Array.isArray(accRes.value) ? accRes.value : []);
        }
      } catch (err) {
        if (!cancelled) {
          toast.error('Erreur réseau', toDisplayMessage(err));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [etablissementActif?.id]);

  // Handlers avec remise à zéro de la pagination
  const handleRechercheChange = (val: string) => {
    setRecherche(val);
    setPageCourante(1);
  };

  const handleGenreChange = (val: string) => {
    setFiltreGenre(val);
    setPageCourante(1);
  };

  const handleAgeChange = (val: string) => {
    setFiltreAge(val);
    setPageCourante(1);
  };

  const handleGroupeSanguinChange = (val: string) => {
    setFiltreGroupeSanguin(val);
    setPageCourante(1);
  };

  const handleAlertesChange = (val: string) => {
    setFiltreAlertes(val);
    setPageCourante(1);
  };

  const handleVisiteChange = (val: string) => {
    setFiltreVisite(val);
    setPageCourante(1);
  };

  const effacerFiltres = () => {
    setRecherche('');
    setFiltreGenre('');
    setFiltreAge('');
    setFiltreGroupeSanguin('');
    setFiltreAlertes('');
    setFiltreVisite('');
    setPageCourante(1);
  };

  // Maps associatives pour liaisons rapides
  const consultationsParPatient = useMemo(() => {
    const map = new Map<string, Consultation[]>();
    for (const c of consultations) {
      const list = map.get(c.patient_id) || [];
      list.push(c);
      map.set(c.patient_id, list);
    }
    for (const [, list] of map) {
      list.sort((a, b) => new Date(b.date_consultation).getTime() - new Date(a.date_consultation).getTime());
    }
    return map;
  }, [consultations]);

  const diagnosticsParPatient = useMemo(() => {
    const map = new Map<string, Diagnostic[]>();
    for (const d of diagnostics) {
      const list = map.get(d.patient_id) || [];
      list.push(d);
      map.set(d.patient_id, list);
    }
    return map;
  }, [diagnostics]);

  const traitementsParPatient = useMemo(() => {
    const map = new Map<string, Traitement[]>();
    for (const t of traitements) {
      const list = map.get(t.patient_id) || [];
      list.push(t);
      map.set(t.patient_id, list);
    }
    return map;
  }, [traitements]);

  // Patients accessibles pour l'établissement actif (secret médical & consentement)
  const patientsAutorises = useMemo(() => {
    // Si super admin sans établissement actif spécifique sélectionné, accès global
    if (role === 'admin' && !etablissementActif?.id) {
      return patients;
    }

    const etablissementId = etablissementActif?.id;
    if (!etablissementId) {
      return patients;
    }

    // 1. Patients ayant au moins une consultation dans cet établissement
    const patientsAvecConsultation = new Set<string>();
    for (const c of consultations) {
      if (c.etablissement_id === etablissementId) {
        patientsAvecConsultation.add(c.patient_id);
      }
    }

    // 2. Patients ayant un accès approuvé et non expiré pour cet établissement
    const patientsAvecAcces = new Set<string>();
    const now = referenceTimestamp;
    for (const a of accesDossiers) {
      if (
        a.etablissement_id === etablissementId &&
        a.statut === 'approuve' &&
        new Date(a.date_expiration).getTime() > now
      ) {
        patientsAvecAcces.add(a.patient_id);
      }
    }

    return patients.filter(
      (p) => patientsAvecConsultation.has(p.id) || patientsAvecAcces.has(p.id)
    );
  }, [patients, consultations, accesDossiers, etablissementActif?.id, role, referenceTimestamp]);

  // Calculs KPI
  const stats = useMemo(() => {
    const total = patientsAutorises.length;

    const septJoursMs = 7 * 24 * 60 * 60 * 1000;
    const nouveaux7j = patientsAutorises.filter((p) => {
      const dateCreation = new Date(p.created_at).getTime();
      return referenceTimestamp - dateCreation <= septJoursMs;
    }).length;

    const actifs = patientsAutorises.filter((p) => {
      const cons = consultationsParPatient.get(p.id);
      return (cons && cons.length > 0) || referenceTimestamp - new Date(p.created_at).getTime() <= 30 * 24 * 60 * 60 * 1000;
    }).length;

    const urgent = patientsAutorises.filter((p) => {
      const diags = diagnosticsParPatient.get(p.id);
      const cons = consultationsParPatient.get(p.id);
      const hasUrgentDiag = diags?.some((d) => d.severite === 'critique' || d.severite === 'severe');
      const hasUrgentCons = cons?.some((c) => c.type === 'urgence' && c.statut !== 'terminee');
      return hasUrgentDiag || hasUrgentCons;
    }).length;

    const sousTraitement = patientsAutorises.filter((p) => {
      const traits = traitementsParPatient.get(p.id);
      return traits && traits.length > 0;
    }).length;

    return {
      total,
      actifs,
      urgent,
      nouveaux7j,
      sousTraitement,
    };
  }, [patientsAutorises, consultationsParPatient, diagnosticsParPatient, traitementsParPatient, referenceTimestamp]);

  // Filtrage des patients
  const patientsFiltres = useMemo(() => {
    return patientsAutorises.filter((p) => {
      if (recherche.trim()) {
        const query = recherche.trim().toLowerCase();
        const nomComplet = `${p.prenom} ${p.nom}`.toLowerCase();
        const nomInverse = `${p.nom} ${p.prenom}`.toLowerCase();
        const idMatch = p.id.toLowerCase().includes(query);
        const adresseMatch = p.adresse?.toLowerCase().includes(query);
        if (!nomComplet.includes(query) && !nomInverse.includes(query) && !idMatch && !adresseMatch) {
          return false;
        }
      }

      if (filtreGenre && p.sexe !== filtreGenre) {
        return false;
      }

      if (filtreAge) {
        const age = calculerAge(p.date_naissance);
        if (age === null) return false;
        if (filtreAge === 'inf_18' && age >= 18) return false;
        if (filtreAge === '18_35' && (age < 18 || age > 35)) return false;
        if (filtreAge === '36_60' && (age < 36 || age > 60)) return false;
        if (filtreAge === 'sup_60' && age <= 60) return false;
      }

      if (filtreGroupeSanguin && p.groupe_sanguin !== filtreGroupeSanguin) {
        return false;
      }

      if (filtreAlertes) {
        const diags = diagnosticsParPatient.get(p.id) || [];
        const hasAlerte = diags.length > 0;
        if (filtreAlertes === 'avec' && !hasAlerte) return false;
        if (filtreAlertes === 'sans' && hasAlerte) return false;
      }

      if (filtreVisite) {
        const cons = consultationsParPatient.get(p.id);
        const derniereDate = cons && cons[0] ? new Date(cons[0].date_consultation).getTime() : 0;
        const diffJours = derniereDate ? (referenceTimestamp - derniereDate) / (24 * 60 * 60 * 1000) : Infinity;
        if (filtreVisite === 'recent' && diffJours > 30) return false;
        if (filtreVisite === 'ancien' && diffJours <= 30) return false;
      }

      return true;
    });
  }, [patientsAutorises, recherche, filtreGenre, filtreAge, filtreGroupeSanguin, filtreAlertes, filtreVisite, diagnosticsParPatient, consultationsParPatient, referenceTimestamp]);

  // Pagination
  const totalFiltres = patientsFiltres.length;
  const nombrePages = Math.max(1, Math.ceil(totalFiltres / elementsParPage));
  const patientsAffiches = useMemo(() => {
    const debut = (pageCourante - 1) * elementsParPage;
    return patientsFiltres.slice(debut, debut + elementsParPage);
  }, [patientsFiltres, pageCourante]);

  // Derniers ajouts de patients
  const derniersAjouts = useMemo(() => {
    return [...patientsAutorises]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 2);
  }, [patientsAutorises]);

  // Notes de suivi récentes (audit logs ou consultations récentes)
  const notesRecentes = useMemo(() => {
    if (auditLogs.length > 0) {
      return auditLogs.slice(0, 2).map((log) => ({
        id: log.id,
        titre: `${log.action} - ${log.table_name}`,
        date: new Date(log.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        detail: `Enregistrement ID: ${log.record_id.slice(0, 8)}...`,
      }));
    }
    if (consultations.length > 0) {
      return consultations.slice(0, 2).map((c) => {
        const patient = patientsAutorises.find((p) => p.id === c.patient_id);
        const nomPatient = patient ? `${patient.prenom[0]}. ${patient.nom}` : 'Patient';
        return {
          id: c.id,
          titre: `Consultation - ${nomPatient}`,
          date: new Date(c.date_consultation).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          detail: c.motif || 'Consultation générale',
        };
      });
    }
    return [
      {
        id: '1',
        titre: 'Modification Dossier - M. Lawson',
        date: '14:20',
        detail: "Mise à jour de l'allergie (Pénicilline) par Dr. Smith.",
      },
      {
        id: '2',
        titre: 'Clôture de Consultation - A. Codjo',
        date: '11:05',
        detail: 'Consultation terminée pour motif "Douleur thoracique".',
      },
    ];
  }, [auditLogs, consultations, patients]);

  // Recherche dans la modale (téléphone, NPI ou nom)
  const gererRechercheModal = async () => {
    const terme = inputRechercheModal.trim();
    if (!terme) {
      setErreurModal('Veuillez entrer un numéro de téléphone, un NPI ou un nom.');
      return;
    }

    setErreurModal('');
    setSearchStatus('waiting');

    try {
      const termeLower = terme.toLowerCase();
      // Chiffres nettoyés (enlève espaces, tirets, points)
      const chiffres = terme.replace(/[\s.-]/g, '');

      let patient: Patient | null | undefined = patients.find(
        (p) =>
          p.id.toLowerCase() === termeLower ||
          p.nom.toLowerCase().includes(termeLower) ||
          p.prenom.toLowerCase().includes(termeLower)
      );

      // 1. Recherche par identifiant exact (téléphone ou NPI) via GET /patients/recherche
      if (!patient && /^(\+?[0-9]{6,15})$/.test(chiffres)) {
        try {
          const isNpiCandidate = /^[0-9]{10}$/.test(chiffres);
          let resRec: { id: string; nom: string; prenom: string; date_naissance: string; sexe: any; a_acces: boolean } | null = null;

          if (isNpiCandidate) {
            try {
              resRec = await api.patients.recherche({ npi: chiffres });
            } catch {
              // Si 404 sur NPI, on teste par téléphone
            }
          }

          if (!resRec) {
            try {
              resRec = await api.patients.recherche({ telephone: chiffres });
            } catch {
              if (!chiffres.startsWith('+229')) {
                try {
                  resRec = await api.patients.recherche({ telephone: `+229${chiffres}` });
                } catch {
                  // Ignore
                }
              }
            }
          }

          if (resRec) {
            patient = {
              id: resRec.id,
              utilisateur_id: '',
              nom: resRec.nom,
              prenom: resRec.prenom,
              date_naissance: resRec.date_naissance,
              sexe: resRec.sexe,
              adresse: null,
              groupe_sanguin: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };

            if (resRec.a_acces) {
              setPatientTrouve(patient);
              setSearchStatus('success');
              return;
            } else {
              // L'établissement n'a pas encore accès : initialiser la demande d'accès
              if (etablissementActif?.id) {
                try {
                  const dateExpiration = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
                  await api.acces.create({
                    patient_id: resRec.id,
                    etablissement_id: etablissementActif.id,
                    motif: 'consultation',
                    methode_auth: 'otp',
                    duree_heures: 24,
                    date_expiration: dateExpiration,
                  });
                } catch {
                  // Si déjà existante
                }
              }
              setPatientTrouve(patient);
              setSearchStatus('waiting');
              return;
            }
          }
        } catch {
          // On poursuit vers la recherche par liste/nom
        }
      }

      // 2. Recherche par téléphone ou NPI sur la liste scopée si pas trouvé via recherche globale
      if (!patient && /^(\+?[0-9]{6,15})$/.test(chiffres)) {
        try {
          const resPhone = await api.patients.list({ telephone: chiffres });
          if (Array.isArray(resPhone) && resPhone.length > 0) {
            patient = resPhone[0];
          } else if (!chiffres.startsWith('+229')) {
            const resPhone229 = await api.patients.list({ telephone: `+229${chiffres}` });
            if (Array.isArray(resPhone229) && resPhone229.length > 0) {
              patient = resPhone229[0];
            }
          } else {
            const resNpi = await api.patients.list({ npi: chiffres });
            if (Array.isArray(resNpi) && resNpi.length > 0) {
              patient = resNpi[0];
            }
          }
        } catch {
          // On poursuit vers la recherche par nom ou id
        }
      }

      // 3. Recherche par nom via le backend si pas encore trouvé
      if (!patient) {
        try {
          const resultats = await api.patients.list({ nom: terme });
          if (Array.isArray(resultats) && resultats.length > 0) {
            patient = resultats[0];
          }
        } catch {
          // Ignore
        }
      }

      // 4. Recherche par identifiant direct (si UUID ou ID de dossier pat-xxx)
      if (!patient && !/^(\+?[0-9]{6,15})$/.test(chiffres) && terme.length > 5) {
        try {
          const resDirect = await api.patients.get(terme);
          if (resDirect && resDirect.id) {
            patient = resDirect;
          }
        } catch {
          // Ignore
        }
      }

      if (patient) {
        setPatientTrouve(patient);
        setSearchStatus('success');
      } else {
        setSearchStatus('not_found');
      }
    } catch {
      setSearchStatus('not_found');
    }
  };

  // Préparation du formulaire de création rapide à partir de la recherche
  const initierCreationPatient = () => {
    const terme = inputRechercheModal.trim();
    const chiffres = terme.replace(/[\s.-]/g, '');
    setFormNom('');
    setFormPrenom('');
    setFormDateNaissance('');
    setFormSexe('M');
    setFormGroupeSanguin('');
    setFormAdresse('');
    setErreurCreation('');

    if (/^[0-9]{10}$/.test(chiffres)) {
      setFormNpi(chiffres);
      setFormTelephone('');
    } else if (/^(\+?[0-9]{6,15})$/.test(chiffres)) {
      setFormNpi('');
      if (chiffres.startsWith('+')) {
        setFormTelephone(chiffres);
      } else if (chiffres.length === 8) {
        setFormTelephone(`+229${chiffres}`);
      } else if (chiffres.startsWith('229')) {
        setFormTelephone(`+${chiffres}`);
      } else {
        setFormTelephone(chiffres);
      }
    } else {
      setFormNpi('');
      setFormTelephone('');
      if (terme) {
        const parts = terme.split(' ');
        if (parts.length >= 2) {
          setFormNom(parts[0].toUpperCase());
          setFormPrenom(parts.slice(1).join(' '));
        } else {
          setFormNom(terme.toUpperCase());
        }
      }
    }
    setSearchStatus('create');
  };

  // Enregistrement d'un nouveau patient et ouverture immédiate de son dossier
  const gererCreationPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreurCreation('');

    if (!formNom.trim() || !formPrenom.trim() || !formDateNaissance || !formTelephone.trim()) {
      setErreurCreation('Veuillez renseigner tous les champs obligatoires (Nom, Prénom, Date de naissance, Téléphone).');
      return;
    }

    let tel = formTelephone.trim().replace(/[\s.-]/g, '');
    if (!tel.startsWith('+')) {
      if (tel.length === 8) {
        tel = `+229${tel}`;
      } else if (tel.startsWith('229')) {
        tel = `+${tel}`;
      } else {
        tel = `+${tel}`;
      }
    }

    const npiClean = formNpi.trim().replace(/[\s.-]/g, '');
    if (npiClean && !/^\d{10}$/.test(npiClean)) {
      setErreurCreation('Le NPI doit comporter exactement 10 chiffres.');
      return;
    }

    setIsSubmittingPatient(true);
    try {
      const nouveauPatient = await api.patients.create({
        nom: formNom.trim(),
        prenom: formPrenom.trim(),
        date_naissance: formDateNaissance,
        sexe: formSexe,
        telephone: tel,
        npi: npiClean || undefined,
        adresse: formAdresse.trim() || undefined,
        groupe_sanguin: (formGroupeSanguin as any) || undefined,
      });

      toast.success(
        'Dossier médical créé',
        `Le dossier de ${nouveauPatient.prenom} ${nouveauPatient.nom} a été initialisé avec succès.`
      );

      setPatients((prev) => [nouveauPatient, ...prev]);
      setPatientTrouve(nouveauPatient);

      setIsModalOpen(false);
      setSearchStatus('idle');
      router.push(`/dossiers-medicaux/${nouveauPatient.id}`);
    } catch (err: any) {
      setErreurCreation(toDisplayMessage(err));
    } finally {
      setIsSubmittingPatient(false);
    }
  };

  // Scan biométrique via le lecteur Aratek/ZK4500
  const gererScanBiometrique = async () => {
    setErreurModal('');
    setIsScanning(true);
    try {
      const match = await api.biometrie.identifier({ template: 'sample_template' });
      if (match && match.patient_id) {
        let p = patients.find((item) => item.id === match.patient_id);
        if (!p) {
          try {
            p = await api.patients.get(match.patient_id);
          } catch {
            // Ignore
          }
        }
        if (p) {
          setPatientTrouve(p);
          setSearchStatus('success');
          setActiveTab('npi');
        } else {
          setErreurModal('Empreinte reconnue mais dossier patient introuvable.');
        }
      } else {
        setErreurModal('Aucune correspondance trouvée pour cette empreinte.');
      }
    } catch (err: any) {
      const msg = toDisplayMessage(err);
      if (
        msg.includes('501') ||
        msg.toLowerCase().includes('branché') ||
        msg.toLowerCase().includes('not implemented')
      ) {
        setErreurModal(
          'Le moteur biométrique Aratek n’est pas encore branché côté serveur. Vous pouvez rechercher directement le dossier via le numéro de téléphone ou le NPI ci-dessous.'
        );
      } else {
        setErreurModal(
          'Impossible de contacter le terminal biométrique. Utilisez la recherche par numéro de téléphone ou NPI.'
        );
      }
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 pb-10">
      
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Dossiers médicaux</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez et suivez les dossiers médicaux des patients</p>
        </div>
        <button 
          onClick={() => {
            setIsModalOpen(true);
            setSearchStatus('idle');
            setInputRechercheModal('');
            setErreurModal('');
          }}
          className="bg-[#00A1C9] hover:bg-[#008BB0] text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Plus size={18} />
          Ouvrir un dossier
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        
        {/* Card 1 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#00A1C9] flex items-center justify-center">
              <FolderHeart size={20} strokeWidth={2} />
            </div>
            {stats.nouveaux7j > 0 ? (
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                +{stats.nouveaux7j} (7j)
              </span>
            ) : (
              <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                0 (7j)
              </span>
            )}
          </div>
          <div className="mt-4">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">TOTAL DOSSIERS</p>
            <h3 className="text-2xl font-bold text-gray-900 leading-none">
              {isLoading ? <Spinner size="sm" /> : stats.total}
            </h3>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 size={20} strokeWidth={2} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">ACTIFS</p>
            <h3 className="text-2xl font-bold text-gray-900 leading-none">
              {isLoading ? <Spinner size="sm" /> : stats.actifs}
            </h3>
          </div>
        </div>

        {/* Card 3 (Red) */}
        <div className="bg-[#FFEBEB] rounded-xl shadow-sm border border-[#FFD6D6] p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-[#D14343] text-white flex items-center justify-center">
              <AlertTriangle size={20} strokeWidth={2.5} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-[10px] font-bold text-[#D14343] uppercase tracking-wider mb-1">URGENT</p>
            <h3 className="text-2xl font-bold text-[#D14343] leading-none">
              {isLoading ? <Spinner size="sm" /> : stats.urgent}
            </h3>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center">
              <UserPlus size={20} strokeWidth={2} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">NOUVEAUX (7J)</p>
            <h3 className="text-2xl font-bold text-gray-900 leading-none">
              {isLoading ? <Spinner size="sm" /> : stats.nouveaux7j}
            </h3>
          </div>
        </div>

        {/* Card 5 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-500 flex items-center justify-center">
              <Stethoscope size={20} strokeWidth={2} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">SOUS TRAITEMENT</p>
            <h3 className="text-2xl font-bold text-gray-900 leading-none">
              {isLoading ? <Spinner size="sm" /> : stats.sousTraitement}
            </h3>
          </div>
        </div>

      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
        {/* Search */}
        <div className="relative w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            value={recherche}
            onChange={(e) => handleRechercheChange(e.target.value)}
            placeholder="Rechercher un dossier par nom, NPI, téléphone..." 
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#00A1C9] focus:ring-1 focus:ring-[#00A1C9]"
          />
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Genre */}
          <div className="relative">
            <select
              aria-label="Genre"
              value={filtreGenre}
              onChange={(e) => handleGenreChange(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 pl-3 pr-7 py-1.5 hover:bg-gray-50 focus:outline-none focus:border-[#00A1C9] cursor-pointer"
            >
              <option value="">Genre</option>
              <option value="M">Homme (H)</option>
              <option value="F">Femme (F)</option>
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Âge */}
          <div className="relative">
            <select
              aria-label="Âge"
              value={filtreAge}
              onChange={(e) => handleAgeChange(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 pl-3 pr-7 py-1.5 hover:bg-gray-50 focus:outline-none focus:border-[#00A1C9] cursor-pointer"
            >
              <option value="">Âge</option>
              <option value="inf_18">&lt; 18 ans</option>
              <option value="18_35">18 - 35 ans</option>
              <option value="36_60">36 - 60 ans</option>
              <option value="sup_60">&gt; 60 ans</option>
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Groupe Sanguin */}
          <div className="relative">
            <select
              aria-label="Groupe Sanguin"
              value={filtreGroupeSanguin}
              onChange={(e) => handleGroupeSanguinChange(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 pl-3 pr-7 py-1.5 hover:bg-gray-50 focus:outline-none focus:border-[#00A1C9] cursor-pointer"
            >
              <option value="">Groupe Sanguin</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Alertes */}
          <div className="relative">
            <select
              aria-label="Alertes"
              value={filtreAlertes}
              onChange={(e) => handleAlertesChange(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 pl-3 pr-7 py-1.5 hover:bg-gray-50 focus:outline-none focus:border-[#00A1C9] cursor-pointer"
            >
              <option value="">Alertes</option>
              <option value="avec">Avec alertes</option>
              <option value="sans">Sans alerte</option>
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Dernière Visite */}
          <div className="relative">
            <select
              aria-label="Dernière Visite"
              value={filtreVisite}
              onChange={(e) => handleVisiteChange(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 pl-3 pr-7 py-1.5 hover:bg-gray-50 focus:outline-none focus:border-[#00A1C9] cursor-pointer"
            >
              <option value="">Dernière Visite</option>
              <option value="recent">&lt; 30 jours</option>
              <option value="ancien">&gt; 30 jours</option>
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Bouton Effacer */}
          <button 
            onClick={effacerFiltres}
            className="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors bg-gray-100 hover:bg-gray-200 rounded-lg ml-auto cursor-pointer"
          >
            Effacer les filtres
          </button>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="py-3 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">PATIENT</th>
                  <th className="py-3 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">ÂGE &amp; GENRE</th>
                  <th className="py-3 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">GROUPE SANGUIN</th>
                  <th className="py-3 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">ALERTES MÉDICALES</th>
                  <th className="py-3 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">DERNIÈRE VISITE</th>
                  <th className="py-3 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {patientsAffiches.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500 text-sm">
                      Aucun dossier patient ne correspond à vos critères.
                    </td>
                  </tr>
                ) : (
                  patientsAffiches.map((patient, index) => {
                    const age = calculerAge(patient.date_naissance);
                    const initiales = extraireInitiales(patient.nom, patient.prenom);
                    const cons = consultationsParPatient.get(patient.id);
                    const derniereConsultation = cons && cons[0] ? cons[0].date_consultation : null;
                    const diags = diagnosticsParPatient.get(patient.id) || [];
                    const alertePrincipale = diags[0]?.code_libre || diags[0]?.commentaire || (diags[0]?.severite ? `Alerte (${diags[0].severite})` : null);

                    const isEven = index % 2 === 0;
                    const avatarBg = isEven ? 'bg-blue-100 text-[#0053CD]' : 'bg-purple-100 text-purple-700';

                    return (
                      <tr 
                        key={patient.id}
                        onClick={() => router.push(`/dossiers-medicaux/${patient.id}`)}
                        className="hover:bg-gray-50/70 transition-colors cursor-pointer"
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full ${avatarBg} border-2 border-white shadow-xs flex items-center justify-center font-bold text-xs shrink-0`}>
                              {initiales}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 leading-snug">
                                {patient.prenom} {patient.nom}
                              </p>
                              <p className="text-[11px] text-gray-400 font-mono">
                                NPI: {formaterNpi(patient.id.slice(0, 10))}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-xs font-semibold text-gray-700">
                            {age !== null ? `${age} ans` : '—'}
                          </span>
                          <span className="text-xs text-gray-400 ml-1.5 font-medium">
                            · {patient.sexe === 'M' ? 'H' : 'F'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {patient.groupe_sanguin ? (
                            <span className="inline-flex px-2 py-0.5 bg-blue-50 text-[#0053CD] border border-blue-200 text-xs font-bold rounded-md">
                              {patient.groupe_sanguin}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          {alertePrincipale ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-[#D14343] border border-red-200 text-xs font-semibold rounded-md">
                              <AlertTriangle size={12} className="shrink-0 text-[#D14343]" />
                              {alertePrincipale}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400 font-medium">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-xs font-medium text-gray-900">
                            {formaterDateDerniereVisite(derniereConsultation)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button 
                            aria-label="Voir le dossier"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/dossiers-medicaux/${patient.id}`);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00A1C9]/10 hover:bg-[#00A1C9] text-[#008BB0] hover:text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                          >
                            <Eye size={14} />
                            <span>Consulter</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium">
            Affichage de {totalFiltres === 0 ? 0 : (pageCourante - 1) * elementsParPage + 1}-
            {Math.min(pageCourante * elementsParPage, totalFiltres)} sur {totalFiltres} dossiers
          </span>
          <div className="flex items-center gap-1">
            <button 
              disabled={pageCourante <= 1}
              onClick={() => setPageCourante((p) => Math.max(1, p - 1))}
              className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: Math.min(5, nombrePages) }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setPageCourante(page)}
                className={`w-7 h-7 flex items-center justify-center rounded text-xs font-medium cursor-pointer ${
                  pageCourante === page
                    ? 'bg-[#00A1C9] text-white'
                    : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button 
              disabled={pageCourante >= nombrePages}
              onClick={() => setPageCourante((p) => Math.min(nombrePages, p + 1))}
              className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Layout Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Derniers Ajouts */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-4">Derniers Ajouts</h2>
          <div className="flex flex-col gap-3">
            {derniersAjouts.length === 0 ? (
              <p className="text-xs text-gray-400">Aucun patient récent.</p>
            ) : (
              derniersAjouts.map((patient) => {
                const initiales = extraireInitiales(patient.nom, patient.prenom);
                return (
                  <div 
                    key={patient.id}
                    onClick={() => router.push(`/dossiers-medicaux/${patient.id}`)}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                        {initiales}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {patient.prenom[0]}. {patient.nom}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formaterDateDerniereVisite(patient.created_at)}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Notes de Suivi Récentes */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-sm font-bold text-gray-900">Notes de Suivi Récentes</h2>
            <button 
              onClick={() => toast.info('Journal d\'audit', 'Accès complet disponible pour les administrateurs.')}
              className="text-xs font-semibold text-[#00A1C9] hover:underline cursor-pointer"
            >
              Voir tout l&apos;audit log
            </button>
          </div>
          
          <div className="relative border-l border-gray-200 ml-2 space-y-6 pb-2">
            {notesRecentes.map((note, idx) => (
              <div key={note.id || idx} className="relative pl-6">
                <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ${idx === 0 ? 'bg-[#00A1C9]' : 'bg-gray-300'} border-2 border-white box-content`}></div>
                <div className="flex justify-between items-start mb-0.5">
                  <h4 className="text-sm font-semibold text-gray-900">{note.titre}</h4>
                  <span className="text-xs text-gray-400 font-medium">{note.date}</span>
                </div>
                <p className="text-xs text-gray-500">{note.detail}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Add Patient Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-[24px] w-full max-w-[500px] shadow-2xl relative overflow-hidden flex flex-col">
            
            {/* Close Button */}
            <button 
              onClick={() => { setIsModalOpen(false); setSearchStatus('idle'); }}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors z-10 cursor-pointer"
            >
              <X size={18} />
            </button>

            {searchStatus === 'success' ? (
              <div className="p-10 flex flex-col items-center relative">
                {/* Avatar with Shield */}
                <div className="relative mb-4 mt-4">
                  <div className="w-20 h-20 rounded-full bg-slate-200 border-4 border-white shadow-sm overflow-hidden flex items-center justify-center">
                    <User size={40} className="text-slate-400" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white">
                    <Shield size={12} fill="currentColor" strokeWidth={0} />
                  </div>
                </div>

                {/* Patient Info */}
                <h2 className="text-lg font-bold text-[#0E1B2A] mb-1">
                  {patientTrouve ? `${patientTrouve.prenom} ${patientTrouve.nom}` : 'Dossier trouvé'}
                </h2>
                <p className="text-sm text-slate-500 font-mono tracking-widest mb-10">
                  {patientTrouve ? formaterNpi(patientTrouve.id.slice(0, 12)) : (inputRechercheModal || 'Dossier médical')}
                </p>

                {/* Success Icon */}
                <div className="relative flex items-center justify-center mb-8">
                  <div className="absolute w-24 h-24 bg-emerald-100 rounded-full"></div>
                  <div className="relative w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-sm z-10">
                    <CheckCircle2 size={32} />
                  </div>
                </div>

                {/* Status Text */}
                <h3 className="text-[17px] font-bold text-slate-900 mb-2 text-center">Autorisation accordée</h3>
                <p className="text-[13px] text-slate-500 text-center mb-8 max-w-xs leading-relaxed">
                  Le patient a validé l&apos;accès à son dossier depuis son application mobile.
                </p>

                {/* Go to file Button */}
                <button 
                  onClick={() => {
                    setIsModalOpen(false);
                    setSearchStatus('idle');
                    const targetId = patientTrouve?.id || '329875421';
                    router.push(`/dossiers-medicaux/${targetId}`);
                  }}
                  className="w-full bg-[#8BD2F2] hover:bg-[#74C5E9] text-[#0E1B2A] py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
                >
                  <Search size={18} />
                  Aller au dossier médical
                </button>
              </div>
            ) : searchStatus === 'waiting' ? (
              <div className="p-10 flex flex-col items-center relative">
                {/* Avatar with Shield */}
                <div className="relative mb-4 mt-4">
                  <div className="w-20 h-20 rounded-full bg-slate-200 border-4 border-white shadow-sm overflow-hidden flex items-center justify-center">
                    <User size={40} className="text-slate-400" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white">
                    <Shield size={12} fill="currentColor" strokeWidth={0} />
                  </div>
                </div>

                {/* Patient Info */}
                <h2 className="text-lg font-bold text-[#0053CD] mb-1">
                  {patientTrouve ? `${patientTrouve.prenom} ${patientTrouve.nom}` : 'Recherche en cours...'}
                </h2>
                <p className="text-sm text-slate-500 font-mono tracking-widest mb-10">
                  {inputRechercheModal || '1234 5678 9012'}
                </p>

                {/* Pulsing Phone Icon */}
                <div className="relative flex items-center justify-center mb-8">
                  <div className="absolute w-32 h-32 bg-[#E6F3FF] rounded-full animate-ping opacity-75"></div>
                  <div className="absolute w-24 h-24 bg-[#CCE7FF] rounded-full"></div>
                  <div className="relative w-16 h-16 bg-[#99D0FF] rounded-full flex items-center justify-center text-white shadow-sm z-10">
                    <Smartphone size={32} />
                  </div>
                </div>

                {/* Status Text */}
                <h3 className="text-[15px] font-bold text-slate-900 mb-2 text-center">En attente d&apos;autorisation du patient...</h3>
                <p className="text-[13px] text-slate-500 text-center mb-6 max-w-xs leading-relaxed">
                  Une notification a été envoyée sur l&apos;application mobile du patient.
                </p>

                {/* Timer Badge */}
                <div className="flex items-center gap-2 bg-[#F0F7FF] text-[#0053CD] px-4 py-2 rounded-full font-semibold text-sm mb-8">
                  <Clock size={16} />
                  <span>Expire dans 02:45</span>
                </div>

                {/* Cancel Button */}
                <button 
                  onClick={() => setSearchStatus('idle')}
                  className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 py-3.5 rounded-xl font-bold transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <X size={18} />
                  Annuler la demande
                </button>
              </div>
            ) : searchStatus === 'not_found' ? (
              <div className="p-8 flex flex-col items-center text-center relative">
                {/* UserPlus Icon */}
                <div className="w-20 h-20 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-4 mt-2 shadow-sm">
                  <UserPlus size={36} />
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/70 text-amber-800 text-[11px] font-bold uppercase tracking-wider mb-3">
                  <AlertTriangle size={13} />
                  <span>Dossier introuvable</span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Le patient n&apos;a pas de dossier médical
                </h3>

                <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
                  Aucun dossier médical n&apos;est associé à {inputRechercheModal ? <span className="font-semibold text-slate-800 font-mono">« {inputRechercheModal} »</span> : 'cette recherche'}. Veuillez lui en créer un pour démarrer sa prise en charge.
                </p>

                <div className="w-full flex flex-col gap-2.5">
                  <button
                    onClick={initierCreationPatient}
                    className="w-full bg-[#00A1C9] hover:bg-[#008BB0] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
                  >
                    <UserPlus size={18} />
                    <span>Créer le patient et son dossier</span>
                  </button>

                  <button
                    onClick={() => {
                      setSearchStatus('idle');
                      setErreurModal('');
                    }}
                    className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 py-3 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Réessayer une recherche
                  </button>
                </div>
              </div>
            ) : searchStatus === 'create' ? (
              <div className="p-8 max-h-[85vh] overflow-y-auto">
                <div className="mb-5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-50 text-[#0053CD] text-[10px] font-bold uppercase tracking-wider mb-1.5">
                    <UserPlus size={12} />
                    <span>Nouveau dossier médical</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">Créer un dossier patient</h2>
                  <p className="text-xs text-slate-500">
                    Renseignez les informations d&apos;état civil du patient pour lui ouvrir un dossier informatisé.
                  </p>
                </div>

                {erreurCreation && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2 mb-4">
                    <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                    <span>{erreurCreation}</span>
                  </div>
                )}

                <form onSubmit={gererCreationPatient} className="flex flex-col gap-3.5">
                  {/* Nom & Prénom */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nom <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formNom}
                        onChange={(e) => setFormNom(e.target.value)}
                        placeholder="Ex: Dossou"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#0053CD]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Prénom <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formPrenom}
                        onChange={(e) => setFormPrenom(e.target.value)}
                        placeholder="Ex: Jean"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#0053CD]"
                      />
                    </div>
                  </div>

                  {/* Date de naissance & Sexe */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Date de naissance <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={formDateNaissance}
                        onChange={(e) => setFormDateNaissance(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#0053CD]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Sexe <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formSexe}
                        onChange={(e) => setFormSexe(e.target.value as 'M' | 'F')}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#0053CD] bg-white"
                      >
                        <option value="M">Masculin</option>
                        <option value="F">Féminin</option>
                      </select>
                    </div>
                  </div>

                  {/* Téléphone & NPI */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Téléphone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formTelephone}
                        onChange={(e) => setFormTelephone(e.target.value)}
                        placeholder="+229 97 00 00 00"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#0053CD]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        NPI <span className="text-slate-400 font-normal">(10 chiffres)</span>
                      </label>
                      <input
                        type="text"
                        maxLength={10}
                        value={formNpi}
                        onChange={(e) => setFormNpi(e.target.value)}
                        placeholder="Ex: 0123456789"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#0053CD]"
                      />
                    </div>
                  </div>

                  {/* Groupe sanguin & Adresse */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Groupe sanguin
                      </label>
                      <select
                        value={formGroupeSanguin}
                        onChange={(e) => setFormGroupeSanguin(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#0053CD] bg-white"
                      >
                        <option value="">Non renseigné</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Adresse / Ville
                      </label>
                      <input
                        type="text"
                        value={formAdresse}
                        onChange={(e) => setFormAdresse(e.target.value)}
                        placeholder="Ex: Cotonou"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#0053CD]"
                      />
                    </div>
                  </div>

                  {/* Mention déontologique & légale */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2 text-slate-600 text-[11px] leading-relaxed">
                    <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      Le patient a été informé de la création de son dossier médical informatisé et pourra y accéder depuis l&apos;application mobile Dotobase.
                    </span>
                  </div>

                  {/* Boutons actions */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSearchStatus('not_found')}
                      className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 py-3 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Retour
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingPatient}
                      className="flex-2 bg-[#00A1C9] hover:bg-[#008BB0] disabled:opacity-50 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
                    >
                      {isSubmittingPatient ? (
                        <>
                          <Spinner size="sm" className="text-white" />
                          <span>Création en cours...</span>
                        </>
                      ) : (
                        <>
                          <UserPlus size={16} />
                          <span>Créer et ouvrir le dossier</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="p-8 pb-6">
                <div className="mb-6">
                  <p className="text-[#0053CD] text-[10px] font-bold tracking-wider uppercase mb-1">ACCÈS DOSSIER PATIENT</p>
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">Ouvrir un dossier médical</h2>
                  <p className="text-sm text-slate-500">
                    Recherchez un dossier par numéro de téléphone, NPI ou via le lecteur d&apos;empreinte digitale.
                  </p>
                </div>

                {/* Tabs */}
                <div className="bg-slate-100/80 p-1 rounded-xl flex gap-1 mb-6">
                  <button 
                    onClick={() => { setActiveTab('npi'); setSearchStatus('idle'); setErreurModal(''); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                      activeTab === 'npi' 
                        ? 'bg-[#0E1B2A] text-white shadow-sm' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    <Phone size={15} />
                    <span>Téléphone / NPI</span>
                  </button>
                  <button 
                    onClick={() => { setActiveTab('fingerprint'); setSearchStatus('idle'); setErreurModal(''); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                      activeTab === 'fingerprint' 
                        ? 'bg-[#0E1B2A] text-white shadow-sm' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    <Fingerprint size={16} />
                    <span>Empreinte digitale</span>
                  </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'npi' ? (
                  <>
                    {/* Input Form */}
                    <div className="flex flex-col gap-2 mb-6">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                        <span>Numéro de téléphone ou NPI</span>
                        <span className="text-[10px] font-normal text-slate-400 lowercase">(ou nom complet)</span>
                      </label>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={inputRechercheModal}
                          onChange={(e) => setInputRechercheModal(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') gererRechercheModal();
                          }}
                          placeholder="Ex: +229 97 00 00 01 ou 1234 5678 90" 
                          className="w-full border border-slate-200 rounded-xl pl-4 pr-12 py-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0053CD] focus:ring-1 focus:ring-[#0053CD] text-base"
                        />
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 flex items-center gap-1">
                          <Phone size={15} />
                          <span className="text-slate-300">/</span>
                          <IdCard size={16} />
                        </div>
                      </div>
                      {erreurModal ? (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600 flex items-start gap-2 mt-1">
                          <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                          <span>{erreurModal}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-400 mt-1">
                          <Info size={13} />
                          <span className="text-xs">Saisissez le téléphone béninois/international ou le NPI à 10 chiffres du patient.</span>
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button 
                      onClick={gererRechercheModal}
                      className="w-full bg-[#0E1B2A] hover:bg-slate-800 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
                    >
                      <Search size={18} />
                      Rechercher le dossier
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-[#DFF1F8] flex items-center justify-center mb-4 relative">
                      <Fingerprint size={48} className={`text-[#0E1B2A] ${isScanning ? 'animate-pulse' : ''}`} strokeWidth={1.5} />
                    </div>
                    
                    <h3 className="text-base font-bold text-slate-900 mb-1 text-center">Posez le doigt du patient sur le lecteur</h3>
                    <p className="text-xs text-slate-500 text-center mb-4 max-w-sm">
                      Le lecteur biométrique va comparer l&apos;empreinte avec les données nationales enregistrées.
                    </p>
                    
                    <div className="flex items-center gap-3 bg-[#F8FAFC] border border-slate-100 rounded-full px-4 py-1.5 mb-5">
                      <div className="flex items-center gap-2 border-r border-slate-200 pr-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="text-[11px] font-bold text-slate-700">Lecteur connecté</span>
                      </div>
                      <span className="text-[11px] font-bold text-[#00A1C9]">ZK4500 USB</span>
                    </div>

                    {erreurModal && (
                      <div className="w-full p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 mb-4 flex flex-col gap-2">
                        <div className="flex items-start gap-2">
                          <AlertTriangle size={15} className="shrink-0 mt-0.5 text-amber-600" />
                          <span>{erreurModal}</span>
                        </div>
                        <button
                          onClick={() => { setActiveTab('npi'); setErreurModal(''); }}
                          className="self-start text-[11px] font-bold text-[#0053CD] hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <Phone size={12} />
                          Utiliser la recherche Téléphone / NPI à la place
                        </button>
                      </div>
                    )}

                    <button 
                      onClick={gererScanBiometrique}
                      disabled={isScanning}
                      className="w-full bg-[#0E1B2A] hover:bg-slate-800 disabled:opacity-60 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer mb-2.5"
                    >
                      {isScanning ? (
                        <>
                          <Spinner size="sm" className="text-white" />
                          <span>Numérisation en cours...</span>
                        </>
                      ) : (
                        <>
                          <Fingerprint size={18} />
                          <span>Lancer la numérisation de l&apos;empreinte</span>
                        </>
                      )}
                    </button>

                    <button 
                      onClick={() => { setIsModalOpen(false); setSearchStatus('idle'); setErreurModal(''); }}
                      className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 py-3 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Annuler
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Info Footer */}
            {searchStatus === 'waiting' || searchStatus === 'success' ? (
              <div className="p-4 flex items-center justify-center gap-2 mt-auto border-t border-slate-100 pb-6 pt-6">
                <Lock size={12} className="text-[#0E1B2A]" />
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                  Connexion sécurisée établie
                </p>
              </div>
            ) : searchStatus === 'not_found' || searchStatus === 'create' ? null : activeTab === 'npi' ? (
              <div className="bg-[#F0F7FF] p-4 flex items-start gap-3 mt-auto">
                <div className="text-[#0053CD] shrink-0 mt-0.5">
                  <Info size={16} />
                </div>
                <p className="text-xs text-[#0053CD] font-medium leading-relaxed">
                  L&apos;accès au dossier est sécurisé par consentement du patient.
                </p>
              </div>
            ) : (
              <div className="bg-[#F0F7FF] p-4 flex items-center justify-center gap-2 mt-auto">
                <ShieldCheck size={16} className="text-[#0053CD]" />
                <p className="text-[11px] font-semibold text-[#0053CD]">
                  Authentification sécurisée via le registre biométrique national (ANIP)
                </p>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
