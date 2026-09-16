# CLAUDE.md — Dev 2

## Qui je suis
Je suis Dev 2 sur le projet Dotobase. Je développe le dossier patient, les consultations, les diagnostics, les traitements et les ordonnances. C'est le coeur fonctionnel de l'application.

## Mes modules
- M3 : Dossier patient (vue principale, onglets, alertes, tri par pertinence)
- M4 : Consultations (historique, formulaire complet)
- M5 : Diagnostics (dossier diagnostics, ajout avec CIM-10)
- M6 : Traitements (prescriptions, ajout avec contrôles sécurité)
- M10 : Ordonnance (vue PDF-like avec signature)

## RÈGLES IMPORTANTES

### 1. INTERDICTION DE TOUCHER AU BACKEND (LECTURE SEULE)
- **NE JAMAIS modifier, créer ou supprimer de fichiers dans le backend** (`dotobase-backend`, migrations, API, DTOs, etc.).
- **Lecture seule autorisée** : vous pouvez consulter et lire le code backend pour comprendre les API, les types et la logique.
- **Signalement obligatoire** : dès que vous remarquez une anomalie, un bug, une incohérence ou un point à améliorer côté backend, **vous ne touchez à rien et vous le dites immédiatement à l'utilisateur**.

### 2. Validation des maquettes
Avant de développer une page, demander à l'utilisateur :
"La maquette de cette page est-elle validée pour le dev ? Si oui, confirme. Si des modifications sont prévues, dis-le moi avant que je commence."

### 3. Tests systématiques à chaque mise à jour de code
À chaque nouvelle mise à jour ou ajout de code (composant, utilitaire, hook, action, page, flux ou correction de bug), il est **obligatoire d'écrire ou adapter immédiatement les tests correspondants** couvrant tout ce qui en découle. Aucun code ne doit être considéré terminé sans ses tests validés (`pnpm test` / `pnpm test:e2e`).

## Roadmap
Le guide complet est dans `docs/roadmap_webapp.md`. Lis les sections MODULE 3, MODULE 4, MODULE 5, MODULE 6, MODULE 10.
Les maquettes des pages sont dans `DEV/webapp/maquettes/`. 
Le fichier P04_dossier_patient.png correspond à la page P04 décrite dans la roadmap.
Avant de coder une page, ouvre la maquette correspondante pour reproduire le design.

## Branches
Branche principale : `dev`. Branche de pré-production : `staging`.
Mes branches (créées depuis `staging`) :
- `feature/M3-dossier`
- `feature/M4-consultation`
- `feature/M5-diagnostic`
- `feature/M6-traitement`
- `feature/M10-ordonnance`

## Commits
```
feature(M3): description [DOT-numero]
feature(M4): description [DOT-numero]
feature(M5): description [DOT-numero]
feature(M6): description [DOT-numero]
feature(M10): description [DOT-numero]
```

## Stack
Next.js 15, TypeScript, Tailwind CSS, API NestJS (dépôt `dotobase-backend`), Vitest, Playwright.
Les données passent par `@/lib/api` (ex: `api.patients.list()`), plus par Supabase.
Dossier webapp : `DEV/webapp/`

## Commandes
```bash
cd DEV/webapp
pnpm dev              # Serveur de dev
pnpm lint             # Lint
pnpm tsc --noEmit     # Types
pnpm test             # Tests
pnpm test:watch       # Mode watch
pnpm test:e2e         # E2E
```

## Mes fichiers
```
src/app/(authenticated)/patients/                  # Toutes les pages patients
  [npi]/page.tsx                                   # P04 Dossier patient
  [npi]/consultations/page.tsx                     # P06 Historique
  [npi]/consultations/new/page.tsx                 # P07 Ajouter
  [npi]/diagnostics/page.tsx                       # P08 Dossier diag
  [npi]/diagnostics/new/page.tsx                   # P09 Ajouter
  [npi]/traitements/page.tsx                       # P10 Dossier trait
  [npi]/traitements/new/page.tsx                   # P11 Ajouter
  [npi]/ordonnance/[ordoId]/page.tsx               # P18 Vue ordonnance
src/components/patients/
src/components/consultations/
src/components/diagnostics/
src/components/traitements/
src/components/ordonnance/
src/lib/hooks/use-patient.ts
src/lib/hooks/use-consultation.ts
src/lib/actions/consultation.actions.ts
src/lib/actions/ordonnance.actions.ts
e2e/dossier.spec.ts
e2e/consultation.spec.ts
e2e/diagnostic.spec.ts
e2e/traitement.spec.ts
e2e/ordonnance.spec.ts
```

## Fichiers interdits
- **NE JAMAIS toucher au backend** (`dotobase-backend/` ou tout fichier backend) — lecture seule uniquement. Tout problème ou besoin de modification doit être dit à l'utilisateur.
- NE PAS toucher `src/app/login/` (Dev 1)
- NE PAS toucher `src/app/otp/` (Dev 1)
- NE PAS toucher `src/components/ui/` (Dev 1 les crée, tu les utilises)
- NE PAS toucher `src/components/layout/` (Dev 1)
- NE PAS toucher `src/components/auth/` (Dev 1)
- NE PAS toucher `src/components/dashboard/` (Dev 1)
- NE PAS toucher `src/app/(authenticated)/acces/` (Dev 3)
- NE PAS toucher `src/components/acces/` (Dev 3)
- NE PAS toucher `src/components/documents/` (Dev 3)
- NE PAS toucher `src/components/examens/` (Dev 3)
- NE PAS toucher `src/components/parametres/` (Dev 3)
- NE PAS toucher `src/app/(authenticated)/parametres/` (Dev 3)
- NE PAS toucher `src/app/(authenticated)/aide/` (Dev 3)

## Règle de tests (OBLIGATOIRE)
Code + tests dans le MÊME commit. CI bloque le merge.
Fichier test à côté : `consultation-form.tsx` → `consultation-form.test.tsx`

### Quoi tester
- Composant → rendu + interaction (Testing Library)
- Hook → retour + effets (Vitest)
- Appel API / Server Action → mock du backend via `src/test/helpers/mock-api.ts` (Vitest)
- Flux complet → E2E (Playwright)

### Mock auth (tant que M1 n'est pas terminé)
```typescript
export function useAuth() {
  return {
    user: { id: 'mock-user-id', npi: '1234567890' },
    etablissementActif: { id: 'mock-etab-id', nom: 'Hôpital Central' },
    specialiteId: 'cardio-uuid',
    role: 'medecin',
  };
}
```
Ce mock sera remplacé quand M1 sera mergé dans staging.

## Logique métier clé : tri par pertinence
Quand le médecin est cardiologue, les consultations/diagnostics/traitements de cardiologie apparaissent en premier. Les allergies, groupe sanguin et traitements en cours sont toujours en haut.
```typescript
consultations.sort((a, b) => {
  if (a.specialite_id === medecinSpecialiteId) return -1;
  if (b.specialite_id === medecinSpecialiteId) return 1;
  return new Date(b.date_consultation).getTime() - new Date(a.date_consultation).getTime();
});
```

## Règles de code
- Utilise les composants UI de `src/components/ui/`
- Zod pour la validation
- react-hook-form pour les formulaires
- lucide-react pour les icônes
- Pas de `any` en TypeScript
- Pas de `console.log` en commit
