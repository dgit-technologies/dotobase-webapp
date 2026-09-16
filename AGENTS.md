# Directives & Règles pour les Agents IA — Dotobase Webapp

## ⚠️ RÈGLE ABSOLUE & CRITIQUE : INTERDICTION DE TOUCHER AU BACKEND (LECTURE SEULE)

1. **Interdiction formelle d'écrire ou modifier dans le backend** :
   - Vous ne devez **JAMAIS** modifier, ajouter, renommer ou supprimer de fichiers ou dossiers dans le backend (`dotobase-backend/`, migrations SQL, routes NestJS, services, DTOs, configurations backend, etc.).
   - Aucun commit, aucune modification de code, aucun script d'altération ne doit viser le backend.

2. **Lecture seule autorisée** :
   - Vous êtes autorisé à **consulter et lire** le code source du backend afin de comprendre les endpoints d'API, les formats de requête/réponse (DTOs), les types TypeScript, les schémas de base de données ou la logique métier.

3. **Signalement obligatoire à l'utilisateur** :
   - Si en analysant le backend ou en développant sur la webapp vous remarquez un problème (un bug, une incohérence entre frontend et backend, un manque, une erreur de typage ou une amélioration nécessaire côté backend) : **VOUS NE TOUCHEZ À RIEN DANS LE BACKEND**.
   - Vous devez **immédiatement et explicitement expliquer le problème à l'utilisateur** afin qu'il prenne les mesures nécessaires.

---

## 🧪 RÈGLE OBLIGATOIRE : TESTS SYSTÉMATIQUES À CHAQUE MISE À JOUR DE CODE

À chaque nouvelle mise à jour, ajout ou modification de code (composant UI, page, fonction utilitaire, hook, action, flux ou correction de bug) :
1. **Écriture obligatoire des tests correspondants** :
   - Il faut impérativement écrire les tests de tout ce qui est créé, modifié, ainsi que de tout ce qui en découle (tests unitaires, tests de composants avec React Testing Library, tests de hooks/actions avec Vitest, et tests E2E avec Playwright si un flux utilisateur est impacté).
   - Le fichier de test doit être créé à côté du fichier testé (`mon-composant.tsx` → `mon-composant.test.tsx`).
2. **Vérification avant finalisation** :
   - Exécuter systématiquement les tests (`pnpm test` / `pnpm test:e2e`) pour prouver que le nouveau code et le code existant passent sans régression.
3. **Indissociabilité du code et des tests** :
   - Aucun code ne doit être validé ou commité sans ses tests automatisés associés.

---

## 🎨 RÈGLE DE VALIDATION DES MAQUETTES
Avant de commencer l'implémentation de toute page ou vue :
Demander systématiquement confirmation à l'utilisateur avec la phrase :
> *"La maquette de cette page est-elle validée pour le dev ? Si oui, confirme. Si des modifications sont prévues, dis-le moi avant que je commence."*

---

## 👥 Rôles et Périmètres (Dev 1, Dev 2, Dev 3)
Chaque agent / développeur doit respecter son périmètre strict défini dans :
- `CLAUDE_dev1.md` : Fondations, Auth (P01/P02), Dashboard (P03), Composants UI partagés, Layout
- `CLAUDE_dev2.md` : Dossier patient (P04), Consultations, Diagnostics, Traitements, Ordonnances
- `CLAUDE_dev3.md` : Documents, Examens, Accès/Consentement, Paramètres, Aide

Respectez impérativement les listes de **fichiers interdits** propres à chaque rôle.
