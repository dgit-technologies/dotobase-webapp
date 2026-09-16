# CLAUDE.md — Dev 1

## Qui je suis
Je suis Dev 1 sur le projet Dotobase. Je gère les fondations, l'authentification et le dashboard.

## Mes modules
- M0 : Setup projet (Next.js, theme, composants UI, client API backend, config tests, CI/CD)
- M1 : Auth (login téléphone + mot de passe côté staff — le NPI n'est plus un identifiant de connexion et l'OTP est réservé au login patient)
- M2 : Dashboard (gestion consultations, stats, alertes, modale recherche patient)
- Infrastructure : migrations SQL, types TypeScript, seed data, GitLab CI/CD

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
Le guide complet est dans `docs/roadmap_webapp.md`. Lis les sections MODULE 0, MODULE 1, MODULE 2.
Les maquettes des pages sont dans `DEV/webapp/maquettes/`. 
Le fichier P04_dossier_patient.png correspond à la page P04 décrite dans la roadmap.
Avant de coder une page, ouvre la maquette correspondante pour reproduire le design.

## Branches
Branche principale : `dev`. Branche de pré-production : `staging`.
Mes branches de travail (créées depuis `staging`) :
- `feature/M0-setup`
- `feature/M1-auth`
- `feature/M2-dashboard`

## Commits
```
feature(M0): description [DOT-numero]
feature(M1): description [DOT-numero]
feature(M2): description [DOT-numero]
fix(M1): description [DOT-numero]
test(M1): description [DOT-numero]
chore: description
```

## Stack
Next.js 15, TypeScript, Tailwind CSS, API NestJS (dépôt `dotobase-backend`), Vitest, Playwright.
Dossier webapp : `DEV/webapp/`
Schéma SQL et migrations : dans `dotobase-backend/supabase/migrations/` (la webapp n'accède plus à Supabase).

## Commandes
```bash
cd DEV/webapp
pnpm dev              # Serveur de dev
pnpm lint             # Lint
pnpm tsc --noEmit     # Types
pnpm test             # Tests unitaires + composants
pnpm test:watch       # Mode watch
pnpm test:coverage    # Couverture
pnpm test:e2e         # Tests E2E Playwright
pnpm build            # Build production
```

## Mes fichiers
```
src/app/login/                         # P01
src/app/otp/                           # P02
src/app/(authenticated)/layout.tsx     # Sidebar + Header
src/app/(authenticated)/dashboard/     # P03
src/components/ui/                     # Tous les composants UI de base
src/components/layout/                 # Sidebar, Header, SearchModal (P05)
src/components/auth/                   # LoginForm, OtpInput
src/components/dashboard/              # StatCards, AlertPanel, ActivityTimeline
src/lib/api/                           # Client de l'API Nest (auth, ressources, types)
src/lib/hooks/use-auth.ts
src/lib/actions/auth.actions.ts
src/lib/utils/validators.ts
src/test/                              # Setup tests + helpers partagés
e2e/auth.spec.ts
e2e/dashboard.spec.ts
vitest.config.ts
playwright.config.ts
.gitlab-ci.yml
```

## Fichiers interdits
- **NE JAMAIS toucher au backend** (`dotobase-backend/` ou tout fichier backend) — lecture seule uniquement. Tout problème ou besoin de modification doit être dit à l'utilisateur.
- NE PAS toucher `src/app/(authenticated)/patients/` (Dev 2)
- NE PAS toucher `src/components/patients/` (Dev 2)
- NE PAS toucher `src/components/consultations/` (Dev 2)
- NE PAS toucher `src/components/diagnostics/` (Dev 2)
- NE PAS toucher `src/components/traitements/` (Dev 2)
- NE PAS toucher `src/components/ordonnance/` (Dev 2)
- NE PAS toucher `src/app/(authenticated)/acces/` (Dev 3)
- NE PAS toucher `src/components/acces/` (Dev 3)
- NE PAS toucher `src/components/documents/` (Dev 3)
- NE PAS toucher `src/components/examens/` (Dev 3)
- NE PAS toucher `src/components/parametres/` (Dev 3)
- NE PAS toucher `src/components/admin/` (Dev 3)
- NE PAS toucher `src/app/(authenticated)/parametres/` (Dev 3)
- NE PAS toucher `src/app/(authenticated)/aide/` (Dev 3)

## Règle de tests (OBLIGATOIRE)
Code + tests dans le MÊME commit. CI bloque le merge si un test échoue.
Fichier test à côté du fichier testé : `button.tsx` → `button.test.tsx`

### Quoi tester
- Composant React → rendu + interaction (Testing Library)
- Hook → retour et effets (Vitest)
- Fonction utilitaire → test unitaire (Vitest)
- Appel API / Server Action → mock du backend (Vitest)
- Flux complet → E2E (Playwright, dans e2e/)

### Mock du backend
`src/test/helpers/mock-api.ts` (`mockFetchRoutes({ 'GET /v1/patients': [...] })`)
et `src/test/helpers/mock-auth.ts` (`mockAuthContext()`) pour un utilisateur connecté.

## Règles de code
- Zod pour la validation
- react-hook-form pour les formulaires
- lucide-react pour les icônes
- Pas de `any` en TypeScript
- Pas de `console.log` en commit
- Chaque composant a un seul export default
