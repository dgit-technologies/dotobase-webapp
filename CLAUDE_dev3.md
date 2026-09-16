# CLAUDE.md — Dev 3

## Qui je suis
Je suis Dev 3 sur le projet Dotobase. Je gère les documents, les examens, le consentement/accès, les paramètres et l'aide. Mon travail couvre la sécurité des accès et les fonctionnalités support.

## Mes modules
- M7 : Documents (liste, grille, upload drag-and-drop, métadonnées)
- M8 : Examens (liste, alertes, création, journal audit)
- M9 : Accès / Consentement (demande accès, validation, policies RLS)
- M11 : Paramètres (profil, sécurité, signature, notifications, préférences)
- M12 : Aide (rubriques, FAQ, support)

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
Le guide complet est dans `docs/roadmap_webapp.md`. Lis les sections MODULE 7, MODULE 8, MODULE 9, MODULE 11, MODULE 12.
Les maquettes des pages sont dans `DEV/webapp/maquettes/`. 
Le fichier P04_dossier_patient.png correspond à la page P04 décrite dans la roadmap.
Avant de coder une page, ouvre la maquette correspondante pour reproduire le design.

## Branches
Branche principale : `dev`. Branche de pré-production : `staging`.
Mes branches (créées depuis `staging`) :
- `feature/M7-document`
- `feature/M8-examen`
- `feature/M9-acces`
- `feature/M11-parametres`
- `feature/M12-aide`

## Commits
```
feature(M7): description [DOT-numero]
feature(M8): description [DOT-numero]
feature(M9): description [DOT-numero]
feature(M11): description [DOT-numero]
feature(M12): description [DOT-numero]
```

## Stack
Next.js 15, TypeScript, Tailwind CSS, API NestJS (dépôt `dotobase-backend`), Vitest, Playwright, pgTAP.
Les données passent par `@/lib/api` (ex: `api.documents.list({ patient_id })`), plus par Supabase.
Le SQL (migrations, policies RLS, tests pgTAP) vit désormais dans `dotobase-backend/supabase/`.
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
src/app/(authenticated)/patients/[npi]/documents/
  page.tsx                                         # P12 Documents
  new/page.tsx                                     # P13 Ajouter document
src/app/(authenticated)/patients/[npi]/examens/
  page.tsx                                         # P14 Examens
  new/page.tsx                                     # P15 Créer examen
src/app/(authenticated)/acces/
  page.tsx                                         # P16 Demande accès
  valide/page.tsx                                  # P17 Accès validé
src/app/(authenticated)/parametres/page.tsx         # P19
src/app/(authenticated)/aide/page.tsx               # P20
src/components/documents/
src/components/examens/
src/components/acces/
src/components/parametres/
src/lib/hooks/use-acces.ts
src/lib/actions/acces.actions.ts
src/lib/actions/admin.actions.ts
e2e/acces.spec.ts
e2e/document.spec.ts
e2e/examen.spec.ts
packages/supabase/migrations/010_rls_policies.sql
packages/supabase/tests/rls.test.sql
```

## Fichiers interdits
- **NE JAMAIS toucher au backend** (`dotobase-backend/` ou tout fichier backend) — lecture seule uniquement. Tout problème ou besoin de modification doit être dit à l'utilisateur.
- NE PAS toucher `src/app/login/` (Dev 1)
- NE PAS toucher `src/app/otp/` (Dev 1)
- NE PAS toucher `src/components/ui/` (Dev 1 les crée, tu les utilises)
- NE PAS toucher `src/components/layout/` (Dev 1)
- NE PAS toucher `src/components/auth/` (Dev 1)
- NE PAS toucher `src/components/dashboard/` (Dev 1)
- NE PAS toucher `src/components/patients/` (Dev 2)
- NE PAS toucher `src/components/consultations/` (Dev 2)
- NE PAS toucher `src/components/diagnostics/` (Dev 2)
- NE PAS toucher `src/components/traitements/` (Dev 2)
- NE PAS toucher `src/components/ordonnance/` (Dev 2)

## Règle de tests (OBLIGATOIRE)
Code + tests dans le MÊME commit. CI bloque le merge.
Fichier test à côté : `upload-zone.tsx` → `upload-zone.test.tsx`

### Quoi tester
- Composant → rendu + interaction (Testing Library)
- Hook → retour + effets (Vitest)
- Appel API / Server Action → mock du backend via `src/test/helpers/mock-api.ts` (Vitest)
- Flux complet → E2E (Playwright)
- Policies RLS → pgTAP (packages/supabase/tests/)

### Mock auth (tant que M1 n'est pas terminé)
```typescript
export function useAuth() {
  return {
    user: { id: 'mock-user-id', npi: '1234567890' },
    etablissementActif: { id: 'mock-etab-id', nom: 'Clinique du Parc' },
    role: 'medecin',
  };
}
```

## Logique métier clé : consentement et accès

### Demande d'accès (3 méthodes visibles dans la maquette)
1. Validation NPI : le médecin saisit le NPI du patient, le système vérifie
2. Autorisation OTP : le patient reçoit un OTP et le communique
3. Empreinte : lecteur biométrique USB (UI only pour le MVP, pas de driver)

### Policies RLS (critiques)
Un professionnel accède aux données UNIQUEMENT si :
1. ATTRIBUTION_ROLE actif dans l'établissement courant
2. ACCES_DOSSIER actif entre ce patient et cet établissement

Tests pgTAP minimum 6 :
1. Médecin clinique A ne voit PAS patients clinique B
2. Accès expiré bloque
3. Accès révoqué bloque
4. Transfert U1 donne accès immédiat
5. Patient voit uniquement son dossier
6. Admin central ne voit pas le contenu médical

## Règles de code
- Utilise les composants UI de `src/components/ui/`
- Zod pour la validation
- react-hook-form pour les formulaires
- lucide-react pour les icônes
- Pas de `any` en TypeScript
- Pas de `console.log` en commit
