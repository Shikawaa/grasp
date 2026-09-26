# AGENTS.md : Grasp

Contexte de travail pour tout agent de code (Claude Code, Antigravity, Codex, Cursor). À lire au début de chaque session. Garder ce fichier sous 150 lignes.

## Projet

Grasp aide à développer sa culture générale, un thème à la fois, et à s'en souvenir vraiment. Un questionnaire crée un profil, Grasp propose 3 thèmes, puis raconte le thème choisi en courtes leçons quotidiennes, suivies de cartes et de révisions espacées. La direction artistique est « Le carnet » : un carnet d'étude vivant.

C'est un projet personnel d'Alexandre Andurand, qui sert aussi de vitrine pour des recruteurs. Production : https://grasp-gold.vercel.app

**Documents de référence, à lire avant tout travail** :
- `docs/PRD.md` : quoi et pourquoi (boucle produit, features, règles).
- `docs/SPEC.md` : comment (stack, routes, données, génération IA, sécurité, lots).
- `docs/DESIGN.md` : direction « Le carnet » (tokens, composants, gestes, écrans, micro-copie).
- `docs/mockups/` : les maquettes validées, en HTML interactif (voir `docs/mockups/README.md`). En cas de différence, `DESIGN.md` fait foi.

En cas de contradiction entre ces documents, signale-la et demande, plutôt que de trancher seul.

## Le propriétaire

- **Alexandre n'est pas développeur.** Explique en français simple ce que tu fais et pourquoi.
- Il teste surtout sur desktop, directement sur https://grasp-gold.vercel.app après chaque push. Vérifie aussi chaque écran à 375 px.
- Il valide chaque lot avant que tu passes au suivant.
- Ce qu'il doit faire lui-même (variables Vercel, réglages Neon, clés) : liste-le clairement, étape par étape.
- Il tient beaucoup au design : les détails du carnet ne sont pas négociables, sauf s'il le décide.

## Stack

Next.js (App Router), React, TypeScript strict, Tailwind CSS 3, primitives Radix, Neon Postgres, Neon Auth, Gemini via `@google/genai` (outil `google_search`), API Wikipédia, Jina Reader, `ts-fsrs`, `zod`, Vitest, Vercel avec une tâche planifiée. Les versions exactes sont dans `package.json`, et le détail dans `docs/SPEC.md` (section 2).

## Commandes

```
npm run dev        # serveur local
npm run lint
npm run typecheck  # tsc --noEmit
npm run test       # Vitest
npm run build
npm run demo:set -- <themeId> --locale fr|en
```

## Structure

```
app/          routes (marketing, demo, auth, app, api)
components/   carnet/, cards/, lesson/, today/, themes/, explain/, landing/
lib/          auth/, db/, i18n/, ai/, research/, profile/, srs/, progress/, usage/, content/
scripts/      set-demo.ts
docs/         PRD.md, SPEC.md, DESIGN.md, mockups/
```

## Règles

**Méthode de travail**
1. Travaille directement sur `main`. **Chaque push est déployé en production** sur https://grasp-gold.vercel.app : ne pousse que du code dont lint, typecheck, test et build passent. La V1 est figée sous le tag Git `v1` et dans la branche Neon `v1-backup`.
2. Un lot à la fois, dans l'ordre de `docs/SPEC.md` (section 14). Propose un plan court avant de coder, puis attends la validation. Si ton outil propose un mode plan ou lecture seule, utilise-le pour l'audit et au début de chaque lot.
3. En fin de lot :
   - lint, typecheck, test et build passent ;
   - push sur `main` ;
   - résumé simple : ce qui a changé, comment le tester en production, ce qu'Alexandre doit faire ;
   - mise à jour de la section « État » ci-dessous ;
   - arrêt, en attente de validation.

**Sécurité**
- Jamais de secret dans le code, les logs, les commits ou le chat. Les clés restent côté serveur, jamais dans une variable `NEXT_PUBLIC_`.
- `requireUser()` dans chaque page privée, action serveur et route API. Toutes les requêtes sont filtrées par `user_id`.
- Les images capturées ne sont jamais enregistrées ni journalisées.
- Aucune opération destructive en base (DROP, TRUNCATE, suppression massive) sans branche Neon de sauvegarde et accord explicite.

**Code**
- TypeScript strict, sans `any`. Server Components par défaut, Client Components seulement quand c'est nécessaire.
- Validation zod à chaque frontière : formulaires, API, sorties de Gemini, pages lues.
- Aucune nouvelle dépendance hors de la liste de `docs/SPEC.md` (section 2) sans le demander.
- Les prompts IA vivent dans `lib/ai/prompts/`, avec une constante `PROMPT_VERSION`.
- Toute la logique métier pure vit dans `lib/`, avec ses tests.
- Messages de commit courts, en anglais (`feat:`, `fix:`, `chore:`).

**Interface**
- Toutes les chaînes passent par `lib/i18n` (français par défaut, anglais). Aucun texte en dur dans les composants.
- Documentation et échanges avec Alexandre en français.
- Couleurs, polices, tailles, grilles et durées : uniquement via les tokens de `docs/DESIGN.md`.
- Chaque écran utilise les composants de `components/carnet` et `components/cards`, sans rien redessiner.
- Avant de construire un écran, ouvre la maquette correspondante dans `docs/mockups/` pour en retrouver l'esprit exact.
- Le texte repose sur les lignes du carnet : grille de 24 px en mobile et 32 px en desktop, sauf la landing qui conserve une grille de 32 px à toutes les tailles conformément à `docs/DESIGN.md`.
- Vérifie chaque écran à 375 px, à 1024 px et à 1440 px, au clavier, et avec `prefers-reduced-motion`.

## Fidélité au design

1. Sources de vérité : `docs/DESIGN.md` pour les règles, `docs/mockups/` pour l’esprit exact. En cas de différence, `DESIGN.md` fait foi.
2. Avant chaque écran : ouvre la maquette correspondante et liste les composants, tokens et gestes que tu vas utiliser. Si l’écran n’a pas de maquette, pars de la plus proche et de `docs/DESIGN.md`, puis montre à Alexandre une première version avant de la terminer.
3. Aucun écart silencieux : si une règle ou une maquette semble impossible ou mauvaise à appliquer, explique pourquoi et propose une alternative. Une fois validée, mets à jour `docs/DESIGN.md` dans la foulée, pour qu’il reste la seule référence.
4. Aucune valeur en dur : couleurs, polices, tailles, espacements, durées et grilles passent uniquement par les tokens. Un contrôle lancé avec `npm run lint` échoue si une couleur hexadécimale apparaît dans le code d’interface en dehors du fichier des tokens.
5. Composants uniques : les éléments du carnet listés en section 6 de `docs/DESIGN.md` (`Page`, `Tape`, `TapeButton`, `Highlight`, `PenCircle`, `PenStrike`, `CheckBox`, `Note`, etc.) n’existent qu’une fois, dans `components/carnet`, et chaque écran les réutilise.
6. Avant de montrer un écran : fais des captures à 375, 768, 1024 et 1440 px, compare-les à la maquette, corrige les écarts, puis parcours la checklist de la section 10 de `docs/DESIGN.md`. Dans le résumé, donne le résultat point par point, y compris ce qui n’est pas encore conforme.

## État

- [ ] Lot 0 : audit
- [x] Lot 1 : socle et nettoyage
- [ ] Lot 2 : design system du carnet et `/styleguide`
- [ ] Lot 3 : données
- [ ] Lot 4 : questionnaire et profil
- [ ] Lot 5 : propositions et préparation des parcours
- [ ] Lot 6 : leçon, cartes, révisions et Aujourd'hui
- [ ] Lot 7 : capture, explique-moi et signalement
- [ ] Lot 8 : landing et démo
- [ ] Lot 9 : finitions et lancement

## Journal des décisions

- 2026-09-26 : nouveau concept V2. Grasp devient une app d'apprentissage par thèmes (questionnaire, 3 propositions, leçons quotidiennes, révisions FSRS). L'import devient une capture légère qui nourrit les propositions.
- 2026-09-26 : retrait de l'import complet, de YouTube, du podcast, du chat, du partage, des XP et des séries.
- 2026-09-26 : inscriptions fermées. Base repartie de zéro. Plus de stockage de fichiers.
- 2026-09-26 : français par défaut et anglais, un seul réglage pour l'interface et les contenus.
- 2026-09-26 : direction artistique « Le carnet », avec le ruban noir comme bouton principal.
- 2026-09-26 : Next.js 16, sous réserve de la compatibilité avec Neon Auth.
- 2026-09-26 : développement directement sur `main`, avec une seule base de données. La V1 est figée (tag Git `v1`, branche Neon `v1-backup`).
- 2026-09-26 : adoption du nouveau logo Grasp. Le symbole « demi-G + point » est la source graphique stable de la marque ; ses règles d'usage sont intégrées à `docs/DESIGN.md`. Le composant Logo sera validé au lot 2, puis utilisé par la landing, la démo et l'image Open Graph au lot 8.

## Pièges connus

- Chaque push sur `main` part en production. Si un build échoue, Vercel garde la dernière version fonctionnelle, mais une app incomplète reste visible sur l'URL du CV.
- Next.js 16 remplace `middleware.ts` par `proxy.ts`. Le proxy ne suffit pas comme contrôle d'accès.
- `@google/generative-ai` est en fin de vie : utiliser `@google/genai`.
- Le modèle par défaut est configuré par `GEMINI_MODEL` et vaut actuellement `gemini-3.8-flash`. Ses tokens d'entrée et de sortie sont disponibles sur l'offre gratuite, mais `google_search` avec Gemini 3.8 Flash exige une offre payante. Ne jamais écrire l'identifiant du modèle en dur dans le code. Les quotas changent souvent : vérifier dans AI Studio. Pour Gemini 3, conserver la température par défaut en n'envoyant aucun paramètre `temperature`.
- La recherche gratuite utilise d'abord l'API Wikipédia dans la langue du thème, avec l'anglais en repli, puis les références externes fiables lues avec Jina Reader. `google_search` reste facultatif et désactivé par défaut avec `ENABLE_WEB_SEARCH=false`.
- Vercel limite la durée des fonctions et la taille des requêtes (environ 4,5 Mo) : découper la génération en étapes et compresser les images dans le navigateur.
- Les tâches planifiées de l'offre gratuite de Vercel sont limitées : vérifier la fréquence permise.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
