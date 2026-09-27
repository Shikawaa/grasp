# Grasp V2 : SPEC technique

> Lire d'abord `PRD.md`. Ce document décrit comment construire la V2 : stack, routes, données, génération IA, sécurité et lots de livraison. L'interface et ses composants sont décrits dans `DESIGN.md`.

## 1. Principes

- **Une branche par lot.** Elle part du dernier `main` validé. Aucun push ni aucune fusion dans `main` sans l'accord explicite d'Alexandre ; un push de branche ne sert qu'à obtenir une prévisualisation Vercel demandée. Le lot 2 utilise `lot-2`, fondée sur le commit du logo marqué localement `v2-lot1.1`. Le tag `v2-lot1` reste le marqueur de fin du lot 1.
- **La V1 est figée avant le lot 1** : un tag Git `v1` sur son dernier commit, et une branche Neon `v1-backup`. Il n'y a ensuite qu'une seule base de données : la base principale Neon, utilisée en local comme en production.
- **On garde l'infrastructure** issue de la migration vers Neon : la base et Neon Auth. **Le stockage de fichiers n'est plus utilisé** : les captures d'écran sont lues puis supprimées.
- **Tout le domaine produit est reconstruit.** On repart d'un schéma de base propre, sans reprise des données V1.
- **Simplicité** : peu de dépendances, un module par responsabilité, et une validation à chaque frontière (entrée utilisateur, sortie IA, API externe).
- **Le proxy n'est pas une barrière de sécurité.** Il redirige, mais chaque page privée, action serveur et route API revérifie l'utilisateur.
- **Toute la logique métier pure** (répétition espacée, semaine, objectif du jour, quotas, signaux de profil, validation des contenus) vit dans `lib/` et est couverte par des tests.
- **Le desktop est traité dans chaque lot**, en même temps que le mobile.

## 2. Stack

| Couche | Choix | Remarque |
|---|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript strict | Montée depuis 14.2 au lot 1, si Neon Auth est compatible (vérifié pendant l'audit). Sinon : rester en 14.2 et le noter dans `AGENTS.md` |
| Style | CSS Modules sémantiques, tokens CSS globaux | Seuls les tokens, le reset minimal et les styles de base sont globaux ; pas de Tailwind |
| Primitives accessibles | Radix (déjà installé) | Pour les dialogues et les feuilles ; leur habillage suit `DESIGN.md` |
| Base | Neon Postgres | Garder l'accès base mis en place par la migration. S'il n'y a pas d'ORM, utiliser Drizzle ORM et drizzle-kit |
| Auth | Neon Auth (Better Auth managé) | Inscriptions fermées |
| IA | Gemini via `@google/genai` | Modèle configurable par `GEMINI_MODEL`, avec `gemini-3.8-flash` par défaut |
| Recherche web | API Wikipédia, références externes et Jina Reader | Sources filtrées par une liste de domaines fiables ; `google_search` reste facultatif et désactivé par défaut |
| Encyclopédie | API REST publique de Wikipédia | Sans clé |
| Lecture de pages | Jina Reader | Déjà utilisé en V1 ; clé facultative |
| Répétition espacée | `ts-fsrs` | Paramètres par défaut, rétention cible de 0,9 |
| Validation | `zod` | |
| Traductions | Dictionnaires maison `lib/i18n/fr.ts` et `en.ts`, typés | Sans bibliothèque ; la langue n'apparaît pas dans l'URL |
| Tests | Vitest, `@playwright/test`, axe et Stylelint | Logique pure, structure multi-navigateurs, références visuelles et accessibilité automatisée |
| Hébergement | Vercel, avec une tâche planifiée (Cron) | Limites de l'offre gratuite à vérifier pendant l'audit |

**À supprimer** : `unpdf`, `msedge-tts`, `@google/generative-ai`, les paquets `@supabase/*` s'il en reste, `react-markdown` s'il n'est plus utilisé, et tout le code lié à l'import de PDF et d'articles, à YouTube, à Supadata, à ElevenLabs, au podcast, au chat, au partage, à l'inscription et au stockage de fichiers.

**Nouvelles dépendances autorisées** : `@google/genai`, `zod`, `ts-fsrs`, `vitest`, `@playwright/test`, `@axe-core/playwright`, `stylelint`, les plugins PostCSS nécessaires à `@custom-media` et aux données globales, et `drizzle-orm` avec `drizzle-kit` si aucun ORM n'est en place. Autoprefixer reste configuré explicitement. Toute autre dépendance doit être demandée.

**Polices** : Fraunces et Caveat via `next/font/google`, et Geist (déjà installé). Voir `DESIGN.md`, section 3.

## 3. Routes

| Route | Accès | Rôle |
|---|---|---|
| `/` | Public et privé | Visiteur : rewrite vers `/welcome`. Connecté : Aujourd'hui (ou `/onboarding` si le profil n'existe pas) |
| `/welcome` | Public | Landing (l'URL affichée reste `/`) |
| `/demo` | Public | Démo : leçon 1 et cartes du thème de démo, dans la langue du visiteur |
| `/sign-in` | Public | Connexion, sans lien d'inscription ; accès privé et lien vers `/demo` au lot 8 |
| `/onboarding` | Privé | Questionnaire d'accueil |
| `/themes` | Privé | Thème en cours et thèmes passés |
| `/themes/new` | Privé | Les 3 propositions et « Me proposer 3 autres idées » |
| `/themes/[id]` | Privé | Page d'un thème : progression, sources, pause, abandon |
| `/themes/[id]/prepare` | Privé | Écran d'attente pendant la préparation du parcours |
| `/lessons/[id]` | Privé | Leçon, « J'ai lu », cartes, avis, fiche « Demain » |
| `/review` | Privé | Révisions du jour |
| `/capture` | Privé | Nouvelle capture et liste des captures |
| `/settings` | Privé | Langue, fuseau horaire, refaire le questionnaire, déconnexion |
| `/styleguide` | Public, non indexé | Vitrine des composants du carnet (lot 2), avec métadonnée `noindex, nofollow` et sans blocage dans `robots.txt` |
| `/api/themes/[id]/generate` | Privé | Exécute l'étape suivante de la préparation d'un parcours |
| `/api/proposals` | Privé | Prépare un nouveau lot de 3 propositions |
| `/api/captures` | Privé | Traite une capture (lien, texte ou image) |
| `/api/explain` | Privé | Questions de suivi de l'explique-moi |
| `/api/cron/generation` | Tâche planifiée | Termine les parcours inachevés (protégée par `CRON_SECRET`) |
| `/opengraph-image` | Public | Image d'aperçu (`next/og`), dans les deux langues |

**Proxy** (`proxy.ts` en Next.js 16, `middleware.ts` sinon) :
- Un visiteur non connecté sur `/` est réécrit vers `/welcome`.
- Routes publiques : `/welcome`, `/demo`, `/sign-in`, `/styleguide`, les callbacks de Neon Auth, `/opengraph-image`, `/api/cron/*` (protégée par son secret) et les fichiers statiques.
- Un visiteur non connecté ailleurs est redirigé vers `/sign-in`. Les routes `/api/*` privées renvoient une erreur 401.
- Un utilisateur connecté sur `/sign-in` est redirigé vers `/`.
- Lors d'un rewrite ou d'une redirection, les cookies de session sont recopiés sur la réponse.
- La redirection vers `/onboarding` (profil absent) se fait dans le layout serveur de l'app, pas dans le proxy.

**Langue** :
- Un utilisateur connecté reçoit `profiles.language`.
- Un visiteur reçoit le cookie `lang` s'il existe. Sinon, l'en-tête `Accept-Language` décide : une langue qui commence par `fr` donne le français, toute autre l'anglais.
- Le bouton FR / EN pose le cookie `lang`.
- La balise `<html lang>` suit la langue active.

## 4. Structure du code

```
app/
  (marketing)/welcome/page.tsx
  demo/page.tsx
  (auth)/sign-in/page.tsx
  (app)/layout.tsx               # coque : barre du bas (mobile), intercalaires (desktop), garde onboarding
  (app)/page.tsx                 # Aujourd'hui
  (app)/onboarding/page.tsx
  (app)/themes/page.tsx
  (app)/themes/new/page.tsx
  (app)/themes/[id]/page.tsx
  (app)/themes/[id]/prepare/page.tsx
  (app)/lessons/[id]/page.tsx
  (app)/review/page.tsx
  (app)/capture/page.tsx
  (app)/settings/page.tsx
  (app)/styleguide/page.tsx
  api/...                        # voir section 3
  opengraph-image.tsx
lib/
  auth/          # session, requireUser(), liste des e-mails autorisés
  db/            # client, schéma, migrations, requêtes (toujours filtrées par user_id)
  i18n/          # fr.ts, en.ts, t(), résolution de la langue
  ai/            # client.ts, prompts/, schemas.ts (zod), steps/, trusted-domains.ts
  research/      # wikipedia.ts, web.ts (ancrage + filtre), reader.ts (Jina), chunk.ts
  profile/       # signals.ts (adaptation du profil)
  srs/           # fsrs.ts, levels.ts, queue.ts
  progress/      # week.ts, objective.ts
  usage/         # quotas quotidiens
  content/       # anecdotes.fr.ts, anecdotes.en.ts (banque vérifiée « Le savais-tu ? »)
components/
  carnet/        # Page, Tape, TapeButton, Highlight, MarkerUnderline, PenCircle, PenStrike,
                 # CheckBox, Tally, Note, Spiral, TabDivider, ReadCover (voir DESIGN.md)
  cards/         # CardMcq, CardCloze, CardTrueFalse, SwipeContainer
  lesson/        # LessonBody, FeedbackPicker, TomorrowCard
  today/         # WeekStrip, ObjectiveList, CurrentThemeCard
  themes/        # ProposalCard, SourcesList, PrepareChecklist, FactRotator
  explain/       # ExplainSheet
  landing/       # Hero, PreviewCards, HowItWorks
scripts/
  set-demo.ts
docs/
  PRD.md  SPEC.md  DESIGN.md
```

## 5. Modèle de données

L'identifiant utilisateur est celui de Neon Auth (vérifier son type pendant l'audit). Les suppressions se font en cascade depuis `themes`.

- **`profiles`** : `user_id` (clé primaire), `language` (fr, en), `timezone` (défaut `Europe/Paris`), `answers` (jsonb, réponses au questionnaire), `likes_text` (nullable), `curious_text` (nullable), `signals` (jsonb : poids par domaine et par style), `onboarded_at`, `updated_at`.
- **`captures`** : `id`, `user_id`, `kind` (link, text, image), `url` (nullable), `text` (nullable, texte collé), `idea` (l'idée extraite, 1 à 2 phrases), `domain` (nullable), `status` (pending, ready, failed), `used_in_proposal_id` (nullable), `created_at`. Les images ne sont jamais enregistrées.
- **`proposal_batches`** : `id`, `user_id`, `created_at`, `status` (ready, consumed, discarded).
- **`proposals`** : `id`, `batch_id`, `user_id`, `domain`, `title` (l'angle), `pitch`, `why` (la raison « pour toi »), `lesson_count` (3 à 7), `capture_id` (nullable), `status` (offered, chosen, dismissed).
- **`themes`** : `id`, `user_id` (nullable pour la démo), `proposal_id`, `title`, `domain`, `color_key`, `language`, `status` (preparing, active, paused, abandoned, completed, failed), `plan` (jsonb, caché à l'interface), `anecdotes` (jsonb, 2 ou 3 faits sourcés), `gen_cursor` (étape suivante), `gen_error`, `gen_attempts`, `lock_until`, `lesson_count`, `started_at`, `completed_at`, `is_demo` (bool), `demo_locale` (nullable), `created_at`.
- **`sources`** : `id`, `theme_id`, `url`, `title`, `site`, `license` (nullable, par exemple « CC BY-SA 4.0 »), `position`.
- **`passages`** : `id`, `source_id`, `theme_id`, `position`, `text` (500 à 1200 caractères).
- **`lessons`** : `id`, `theme_id`, `position`, `title` (le titre d'accroche), `key_idea`, `body` (jsonb : paragraphes composés de segments `{ text, highlight }`), `passage_ids` (uuid[]), `status` (pending, drafted, ready, failed), `quality` (jsonb, notes de la relecture), `prompt_version`, `unlocked_at`, `read_at`, `completed_at`, `feedback` (top, meh, error, nullable), `feedback_note` (nullable).
- **`items`** (cartes) : `id`, `lesson_id`, `theme_id`, `kind` (mcq, cloze, tf), `prompt`, `answer`, `choices` (jsonb, pour les QCM : `text`, `correct`), `tf_value` (bool, pour les vrai ou faux), `reasons` (jsonb, pour les vrai ou faux : `text`, `correct`), `explanation`, `passage_id`, `suspended` (bool), `flag_reason` (nullable : wrong, unclear, too_easy), `created_at`.
- **`item_states`** : `item_id`, `user_id`, et les champs de carte de `ts-fsrs` (`due`, `stability`, `difficulty`, `elapsed_days`, `scheduled_days`, `reps`, `lapses`, `state`, `last_review`). Clé primaire (`item_id`, `user_id`).
- **`reviews`** : `id`, `item_id`, `user_id`, `rating`, `correct`, `context` (lesson, review), `duration_ms`, `reviewed_at`.
- **`daily_log`** : `user_id`, `day` (date locale), `lesson_done` (bool), `reviews_done` (int), `objective_done` (bool). Clé primaire (`user_id`, `day`).
- **`usage_counters`** : `user_id`, `day`, `kind` (capture, explain, theme, proposal_refresh), `count`. Clé primaire (`user_id`, `day`, `kind`).

## 6. Génération

- Le modèle vient toujours de `GEMINI_MODEL` et n'est jamais écrit en dur dans le code. La valeur recommandée est `gemini-3.8-flash`.
- Pour Gemini 3, ne pas envoyer `temperature`, `top_p` ni `top_k` : les valeurs par défaut du modèle sont conservées.

### 6.1 Propositions de thèmes

- **Quand** : à la fin du questionnaire, quand le thème en cours arrive à sa dernière leçon (pour être prêt à l'avance), et sur « Me proposer 3 autres idées ».
- **Entrées** : les réponses au questionnaire, les signaux du profil, les idées des captures récentes non utilisées, et les titres des thèmes déjà suivis.
- **Méthode** :
  1. Gemini propose 10 angles candidats, en JSON validé.
  2. Le code en sélectionne 3 : des domaines différents si possible, au moins un issu des intérêts déclarés, et un issu d'une capture s'il en existe une récente. Les angles trop proches d'un thème passé sont écartés.
  3. Chaque proposition reçoit son pitch, sa raison et un nombre de leçons estimé (3 à 7), selon la richesse du sujet.
- **Règle des angles** : un titre précis, formulé comme une question ou un récit, qui promet une histoire. Jamais un sujet large. Le titre affiché sur un ruban de thème contient au plus 55 caractères, espaces compris.

### 6.2 Préparation d'un parcours

**Enchaînement** : `research` → `plan` → `lesson:1` → `review:1` → `cards:1` (la leçon 1 devient disponible) → `lesson:k`, `review:k`, `cards:k` pour les leçons suivantes → `done`.

**Orchestration** :
- **Pilotée par le client tant que l'app est ouverte** : l'écran d'attente, puis la page de leçon, appellent `POST /api/themes/[id]/generate` en boucle. Chaque appel exécute une seule étape et renvoie `{ cursor, lessonsReady, error }`.
- **Une tâche planifiée Vercel, chaque nuit**, appelle `/api/cron/generation`, qui termine les parcours inachevés. Vérifier pendant l'audit la fréquence permise par l'offre gratuite.
- Chaque étape tient dans la durée maximale d'une fonction : fixer `maxDuration` selon le plan (à vérifier), et découper davantage si besoin.

**Règles communes** :
- Chaque étape est idempotente : elle remplace sa sortie précédente, dans une transaction.
- `lock_until` empêche deux exécutions simultanées.
- En cas d'erreur 429 ou 5xx de Gemini : 3 nouvelles tentatives au maximum, avec une attente croissante. Ensuite : `status = failed`, avec un message lisible et « Réessayer », qui reprend à l'étape échouée.
- Les sorties structurées utilisent les schémas zod communs de `lib/content`. Un titre de thème de plus de 55 caractères invalide toute la sortie concernée. Le code effectue une seule nouvelle tentative corrective en transmettant la contrainte échouée. Si cette seconde sortie reste invalide, aucune valeur n'est tronquée ni enregistrée : l'étape passe à `failed` avec un code stable, et « Réessayer » reprend uniquement cette étape. Cette tentative de correction de contenu est distincte des nouvelles tentatives réseau sur 429 ou 5xx.

**`research`** :
1. Chercher d'abord les articles pertinents avec l'API publique de Wikipédia, dans la langue du thème, avec l'anglais en repli si les résultats sont insuffisants.
2. Extraire les liens externes et les références citées par les articles Wikipédia retenus.
3. Ne conserver que les URL dont le domaine figure dans `lib/ai/trusted-domains.ts`, puis lire leur contenu avec Jina Reader. **Liste des domaines à valider par Alexandre au lot 5.**
4. Si `ENABLE_WEB_SEARCH=true`, Gemini peut compléter cette recherche avec l'outil `google_search`. Cette option est désactivée par défaut et nécessite une offre Gemini compatible.
5. Stocker les sources et les passages utiles avec leur provenance et leur licence. Les étapes suivantes travaillent uniquement à partir de ces passages.
6. Découper les pages retenues en passages de 500 à 1200 caractères, puis garder 2 à 4 sources qui contiennent assez de texte utile. Enregistrer leur licence quand elle est connue (Wikipédia : CC BY-SA 4.0).
7. Extraire 2 ou 3 anecdotes courtes et sourcées pour l'écran d'attente.
8. Moins de 2 sources exploitables : échec « sources insuffisantes », et proposition de choisir un autre thème.

**`plan`** :
- JSON validé : `{ lessons: [{ title, keyIdea, passageRefs[] }] }`, de 3 à 7 leçons.
- La leçon 1 accroche, chaque leçon porte une seule idée et s'appuie sur la précédente, et la dernière fait la synthèse.
- **Vérifications dans le code** : des idées clés distinctes, au moins un passage par leçon, et un nombre de leçons conforme.
- **Les titres sont des accroches** : une question intrigante ou une scène, jamais un intitulé plat. Le prompt exige un titre assez court pour tenir sur deux lignes ; le rendu est vérifié en français et en anglais aux largeurs de référence.

**`lesson:k`** :
- Rédaction selon la charte (section 7), en JSON : `{ title, paragraphs: [{ segments: [{ text, highlight? }] }] }`.
- Un segment surligné par leçon, deux au maximum : l'idée clé.

**`review:k`** :
- Une seconde passe note la leçon de 1 à 5 sur chaque critère de la charte.
- Si un critère obtient moins de 3, la leçon est réécrite une fois, avec les remarques. Les notes sont enregistrées dans `lessons.quality`.
- Cette étape peut utiliser `GEMINI_MODEL_CRITICAL` s'il est défini (plan B payant).

**`cards:k`** :
- 2 ou 3 cartes par leçon, de types variés, qui portent sur l'idée clé et ses nuances.
- Validation : voir la section 7.

**Format envoyé à Gemini** : les passages sont numérotés `[P12] texte…`. Gemini répond avec des références `P12`, que le code convertit en identifiants. Une référence inconnue invalide l'élément concerné.

### 6.3 Captures

- **Lien** : validation de l'URL (http ou https uniquement, ni `localhost`, ni adresse privée), lecture avec Jina, puis extraction de l'idée en 1 ou 2 phrases, avec son domaine.
- **Texte** : extraction de l'idée.
- **Image** : compressée dans le navigateur (1600 px de côté maximum, JPEG qualité 0,8, soit moins de 1,5 Mo), envoyée à `/api/captures`, puis transmise directement à Gemini, qui en extrait l'idée. L'image n'est ni enregistrée, ni journalisée.
- Toutes les captures sont limitées à 10 par jour.

### 6.4 Adaptation du profil

Une fonction pure, `lib/profile/signals.ts`, testée, met à jour les poids par domaine et par style :
- **À la hausse** : thème choisi, leçon notée « Top », capture dans un domaine.
- **Légèrement à la baisse** : proposition écartée par un nouveau tirage, leçon notée « Bof ».
- « Il y a une erreur » ne modifie pas les goûts : c'est un signal de qualité.
- Les poids sont bornés, et les signaux anciens perdent progressivement de leur importance.

## 7. Qualité du contenu

Ces règles figurent dans les prompts, avec deux leçons modèles validées par Alexandre et des contre-exemples. Le code vérifie celles qui peuvent l'être.

**Leçon**
- Elle n'utilise que les passages fournis, sans aucune connaissance extérieure.
- **Structure** : une accroche (question ou scène), une seule idée, un exemple concret, puis pourquoi ça compte.
- De 350 à 450 mots, dans la langue du thème, et en deuxième personne du singulier en français.
- Aucune phrase méta (« Dans cette leçon… », « This lesson explores… »).
- Elle reprend le concret des sources : dates, noms, chiffres, lieux.
- Un segment surligné (deux au maximum) : l'idée clé.

**Cartes**
- Elles testent la compréhension (pourquoi, comment, que se passe-t-il si), pas un détail anecdotique.
- La réponse ne se devine pas à partir de la formulation de la question.
- **QCM** : exactement 4 choix, dont un seul correct. Les distracteurs sont plausibles, fondés sur des erreurs de compréhension courantes, et de longueur comparable. Jamais « toutes les réponses ».
- **Texte à trous** : le prompt contient `{{blank}}` une seule fois, sur un terme clé et jamais sur un mot vide. La correction tolère la casse et les accents.
- **Vrai ou faux** : une affirmation nette, puis 3 raisons, dont une seule correcte. Les deux autres sont plausibles.
- Une explication de 60 mots maximum, rattachée à un passage.

**Vérifications dans le code**
- Un QCM a exactement un choix correct, et un vrai ou faux exactement une raison correcte.
- La réponse d'un texte à trous n'apparaît pas dans la question.
- Chaque référence de passage appartient au thème.
- Les éléments invalides sont écartés. S'il reste moins de 2 cartes valides pour une leçon, l'étape est relancée une fois, avec la liste des erreurs.

**Traçabilité** : chaque prompt vit dans `lib/ai/prompts/`, avec une constante `PROMPT_VERSION` enregistrée avec la leçon.

## 8. Révisions, semaine et objectif

- **Première rencontre** : répondre à une carte pendant la leçon crée son `item_state`. C'est sa première révision.
- **Notation** :
  - QCM et texte à trous : mauvaise réponse = Again, bonne réponse = Good.
  - Vrai ou faux : les deux étapes justes = Good ; vrai ou faux juste mais raison fausse = Hard ; vrai ou faux faux = Again.
- **File du jour** (`/review`) : les cartes dues (`due <= maintenant`, non suspendues), tous thèmes confondus, triées par échéance, avec 20 cartes par jour au maximum (`MAX_REVIEWS_PER_DAY`).
- Chaque réponse est enregistrée immédiatement, pour qu'une session interrompue ne perde rien.
- **Niveaux de mémoire** (`lib/srs/levels.ts`), selon la stabilité en jours : carte neuve = 0, moins de 1 = 1, moins de 4 = 2, moins de 10 = 3, moins de 30 = 4, 30 et plus = 5.
- **« Tu retiens X idées sur Y »** : une leçon compte comme une idée retenue quand ses cartes non suspendues atteignent en moyenne le niveau 3.
- **Jour local** : calculé avec `profiles.timezone`, mis à jour depuis le navigateur à chaque visite, ce qui gère les voyages.
- **Objectif du jour** (`lib/progress/objective.ts`) : leçon du jour faite (s'il y en a une), et révisions dues faites (plafond compris). Sans thème actif : un thème choisi, plus les révisions. Le résultat est enregistré dans `daily_log`.
- **Semaine** (`lib/progress/week.ts`) : du lundi au dimanche, dans le fuseau de l'utilisateur.
- **Cas à tester** : changement de fuseau, passage de minuit, jour sans carte due, thème terminé pendant la journée, leçon suivante débloquée en avance.

## 9. Explique-moi

- Le premier contenu affiché est `items.explanation`, sans appel réseau.
- **Question de suivi** : `POST /api/explain` avec `{ itemId, question, history }`. Le serveur vérifie l'utilisateur et le quota, charge la carte, sa leçon et ses passages, puis appelle Gemini.
- **Consignes** : répondre uniquement à partir de la leçon et des passages, en 120 mots maximum, dans la langue du thème. Si ce n'est pas possible, le dire.
- La conversation n'est pas enregistrée. 5 questions de suivi au maximum par carte.

## 10. Landing et démo

- **Thèmes de démo** : deux thèmes générés normalement (un en français, un en anglais), puis marqués avec `npm run demo:set -- <themeId> --locale fr|en`. Le script retire la marque de l'ancien thème de démo de la même langue.
- **`/demo`** : lecture seule de la leçon 1 et de ses cartes, dans la langue du visiteur.
- **`/sign-in`** : conserve le formulaire et ajoute un court message vers la démo. En français : « Grasp est en accès privé pour l'instant. » puis le lien « Essayer la démo ». En anglais : “Grasp is currently private.” puis le lien “Try the demo”. Ces quatre textes vivent dans les dictionnaires.
- **Lien depuis la landing** : dès que `/demo` existe, « La démo jouable arrive bientôt. » et son équivalent anglais deviennent un lien vers `/demo`. Le lien « Se connecter » reste visible dans l'en-tête.
  - L'état reste dans React, sans aucune écriture en base ni appel externe.
  - L'explique-moi n'affiche que l'explication préparée.
  - Les sources et leurs licences sont affichées.
- **Landing** : Server Component, revalidé toutes les heures. Les aperçus viennent du thème de démo. S'il n'y en a pas, des aperçus de secours écrits dans le code prennent le relais, pour que la landing ne casse jamais.
- **Métadonnées** : `metadataBase` depuis `NEXT_PUBLIC_SITE_URL`, titre, description, Open Graph et `app/opengraph-image.tsx`, dans la langue du visiteur.

## 11. Sécurité et accès

- **Inscriptions fermées** : désactiver l'inscription dans Neon Auth ou Better Auth, et vérifier qu'une inscription directe via l'API est refusée.
- **E-mails autorisés** : `requireUser()` vérifie la session et l'appartenance à `OWNER_EMAILS`. Sinon, déconnexion et redirection.
- **Isolation des données** : chaque requête est filtrée par `user_id`. La démo ne lit que `is_demo = true`.
- **Tâche planifiée** : `/api/cron/generation` exige l'en-tête `Authorization: Bearer <CRON_SECRET>`.
- **URL** : uniquement http ou https, sans `localhost` ni adresse privée, pour les captures comme pour les sources.
- **Images** : jamais enregistrées ni journalisées. Taille et type vérifiés côté serveur.
- **Contenu IA** : affiché depuis du JSON structuré, jamais comme du HTML brut.
- **En-têtes** : `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, et interdiction d'affichage dans une iframe.
- **Secrets** : uniquement dans les variables d'environnement Vercel, jamais dans le code, les logs ou une variable `NEXT_PUBLIC_`.

## 12. Variables d'environnement

| Variable | Portée | Rôle |
|---|---|---|
| Variables de la migration Neon (base, auth) | Serveur | À conserver telles quelles |
| `NEON_AUTH_COOKIE_SECRET` | Serveur | Secret d'au moins 32 caractères pour signer le cache de session Next.js |
| `GEMINI_API_KEY` | Serveur | Clé Gemini |
| `GEMINI_MODEL` | Serveur | Modèle Flash utilisé par défaut ; `gemini-3.8-flash` recommandé |
| `GEMINI_MODEL_CRITICAL` | Serveur | Facultatif : modèle du plan B pour le plan et la relecture |
| `ENABLE_WEB_SEARCH` | Serveur | Défaut : `false`. Active l'ancrage `google_search` uniquement avec une offre Gemini compatible |
| `JINA_API_KEY` | Serveur | Facultative |
| `OWNER_EMAILS` | Serveur | E-mails autorisés, séparés par des virgules |
| `CRON_SECRET` | Serveur | Secret de la tâche planifiée |
| `MAX_REVIEWS_PER_DAY` | Serveur | Défaut : 20 |
| `MAX_CAPTURES_PER_DAY` | Serveur | Défaut : 10 |
| `MAX_EXPLAIN_PER_DAY` | Serveur | Défaut : 30 |
| `MAX_THEMES_PER_DAY` | Serveur | Défaut : 1 |
| `MAX_PROPOSAL_REFRESH_PER_DAY` | Serveur | Défaut : 3 |
| `NEXT_PUBLIC_SITE_URL` | Public | `https://grasp-gold.vercel.app` |

Les variables se renseignent dans l'environnement **Production** de Vercel, et dans `.env.local` pour le développement local.

**À supprimer** : `SUPADATA_API_KEY`, `ELEVENLABS_API_KEY`, `NEXT_PUBLIC_SUPABASE_*`, et les variables de stockage de fichiers une fois vérifié qu'elles ne servent plus. Mettre à jour `.env.local.example` avec des valeurs fictives.

## 13. Qualité et tests

- **Scripts** : `lint`, `typecheck` (`tsc --noEmit`), `test` (Vitest) et `build`. Les quatre passent à la fin de chaque lot.
- **Tests unitaires** : `lib/srs`, `lib/progress`, `lib/usage`, `lib/profile/signals`, les vérifications de contenu de `lib/ai`, et la résolution de la langue.
- **Styles** : Stylelint refuse toute nouvelle couleur, longueur de design, espacement ou durée hors de `tokens.css`. Le lot 2a inventorie et fige les violations héritées dans une liste d'exceptions ; elles sont supprimées au lot 2b au fil du remplacement par les composants. Aucun nouveau token sans validation d'Alexandre.
- **PostCSS** : `@custom-media` est compilé et ses définitions sont injectées dans chaque CSS Module. Autoprefixer reste explicitement configuré, car la configuration PostCSS personnalisée remplace celle de Next.js.
- **Références visuelles** : Playwright compare la landing et `/styleguide` sur un build de production (`build`, puis `start`), jamais sur le serveur de développement. Les références Chromium sont produites sur le Mac d'Alexandre à 375, 768 et 1440 px avec version, langue, polices, DPR et mouvement figés. Leur mise à jour est une commande volontaire, exécutée uniquement après validation visuelle. Le lot 2a exige zéro pixel différent sur la landing.
- **Navigateurs** : les contrôles structurels couvrent Chromium aux largeurs prévues et WebKit à 375 px, sans snapshot WebKit.
- **Accessibilité** : la batterie finale du lot 2b exécute axe sur la landing et `/styleguide`, en français et en anglais, puis vérifie directement les contrastes texte/surligneur.
- **Vérification manuelle** en local et, après un push demandé, sur la prévisualisation Vercel à 375 px, à 1024 px et à 1440 px, au clavier et avec les animations réduites.
- **Performance** : LCP inférieur ou égal à 2,5 s sur la landing en build de production au lot 2b ; Lighthouse mobile de 90 ou plus sur `/welcome` et `/demo`, revérifié aux lots 8 et 9.

## 14. Lots de livraison

Chaque lot se termine par :
1. les quatre scripts au vert ;
2. des commits locaux séparés par sujet ;
3. un résumé en langage simple ;
4. la mise à jour de la section « État » d'`AGENTS.md` ;
5. un arrêt, en attente de la validation d'Alexandre ;
6. le tag du lot après validation, puis un push ou une fusion uniquement sur demande explicite.

| Lot | Contenu | Terminé quand |
|---|---|---|
| 0. Audit | Lecture du code sans modification (voir le prompt de refonte) | Rapport et plan du lot 1 validés |
| 1. Socle | Vérification du tag `v1` et de la branche Neon `v1-backup`, suppression de l'ancien produit et de ses dépendances, montée de version si compatible, `@google/genai`, nouvelles dépendances, scripts, inscriptions fermées, `requireUser()`, proxy, langue et dictionnaires, en-têtes, `.env.local.example` | Build OK ; `/` non connecté affiche une page d'accueil provisoire dans l'esprit du carnet (le nom, l'accroche, « Bientôt disponible », les liens Portfolio et LinkedIn) ; `/sign-up` renvoie une 404 ; le bouton FR / EN fonctionne |
| 2a. Fondations visuelles | Documents, références Playwright de la landing, reset minimal, retrait de Tailwind, PostCSS explicite, Stylelint avec exceptions héritées, migration des styles existants vers les CSS Modules | Zéro différence sur les snapshots de la landing ; quatre scripts au vert ; **validation d'Alexandre**, puis tag `v2-lot2a` |
| 2b. Design system | Polices, fonction d'imperfections déterministes, module de tracés, traductions et typographie, tous les composants `carnet/` et `cards/` avec leurs états et animations, page publique `/styleguide`, axe et batterie visuelle finale. La landing adopte les tracés communs comme changement visuel présenté avant toute mise à jour de référence | **Validation visuelle d'Alexandre**, puis tag `v2-lot2` |
| 3. Données | Vérification de la branche Neon `v1-backup`, suppression des tables V1 (avec l'accord d'Alexandre), nouveau schéma et migrations sur la base principale, couche `lib/db` filtrée par utilisateur | Migrations appliquées ; requêtes typées |
| 4. Questionnaire et profil | `/onboarding`, `profiles`, signaux, réglages (langue, refaire le questionnaire) | Questionnaire complet enregistré, en FR et en EN |
| 5. Propositions et parcours | Propositions, recherche, plan, leçons, relecture, cartes, écran d'attente, démarrage anticipé, tâche planifiée, erreurs | **Alexandre juge la qualité de 5 parcours réels** et valide la liste des domaines fiables et les leçons modèles |
| 6. Leçon et révisions | `/lessons/[id]` (« J'ai lu », cartes, gestes, balayage, avis, « Demain »), FSRS, `/review`, Aujourd'hui, semaine, objectif, `/themes` | Une journée complète fonctionne ; tests au vert |
| 7. Capture et explique-moi | `/capture` (lien, texte, image), explique-moi, signalement, adaptation du profil | Une capture apparaît dans les propositions suivantes |
| 8. Landing et démo | Landing FR/EN, aperçus, `/demo`, script `demo:set`, lien de la landing vers la démo, message d'accès privé et lien `/demo` sur `/sign-in`, métadonnées et image d'aperçu | Démo complète sans aucun appel externe, dans les deux langues ; « Se connecter » reste visible dans l'en-tête |
| 9. Finitions et lancement | Revue finale des états, de l'accessibilité et de la performance, README, nettoyage des variables inutiles, création des deux thèmes de démo | Liste finale de vérification au vert en production |
