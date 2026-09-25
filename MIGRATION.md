# Plan de Migration Grasp : Supabase ➔ Neon (Région Francfort)

> **Document de référence pour la migration complète de l'infrastructure de Grasp.**  
> *Rédigé pour être clair, exhaustif et directement compréhensible sans prérequis technique avancé.*

---

## 1. Vue d'ensemble & Objectifs

L'application **Grasp** (Next.js hébergée sur Vercel) utilise actuellement Supabase pour 3 piliers :
1. **Base de données relationnelle** : PostgreSQL
2. **Authentification** : Supabase Auth (Email/Mot de passe + Google OAuth)
3. **Stockage de fichiers** : Supabase Storage (PDFs privés et fichiers audio MP3 publics)

### La cible : Neon (100% hébergé à Francfort / `eu-central-1`)
* **Base de données** : Neon Serverless Postgres (région Francfort).
* **Authentification** : Neon Auth (Managed Better Auth intégré directement dans Postgres dans le schéma `neon_auth`).
* **Stockage de fichiers** : Neon Object Storage (compatible standard AWS S3, région Francfort).
* **Serveurs d'application Vercel** : Fonctions serverless configurées sur la région `fra1` (Francfort) pour garantir une latence minimale (< 2ms) avec la base de données.

---

## 2. Réponse prioritaire : Conservation des mots de passe utilisateurs

> [!IMPORTANT]
> **Bonne nouvelle : Les mots de passe existants de tes utilisateurs peuvent être conservés sans obliger les utilisateurs à réinitialiser leur mot de passe.**

### Comment cela fonctionne-t-il simplement ?
1. **Supabase** protège les mots de passe avec l'algorithme standard de hachage **bcrypt** (les empreintes commencent par `$2a$` ou `$2b$`). Supabase ne connaît pas le mot de passe en clair, mais stocke cette empreinte chiffrée dans la colonne `auth.users.encrypted_password`.
2. **Neon Auth** est basé sur **Better Auth**, qui supporte nativement la vérification des empreintes `bcrypt`.
3. **Mécanisme de "Silent Rehash" (Transition invisible)** :
   - Lorsque nous exporterons les utilisateurs de Supabase, nous récupérerons leurs emails, leurs identifiants (`id`) et leurs empreintes de mot de passe (`encrypted_password`).
   - Nous injecterons ces données dans le schéma d'authentification de Neon (`neon_auth.user` et `neon_auth.account`).
   - Lors de sa prochaine connexion, l'utilisateur tapera son mot de passe habituel. Better Auth reconnaîtra l'empreinte bcrypt, validera la connexion sans aucune friction, puis ré-encodera en arrière-plan le mot de passe vers le format moderne de Neon sans que l'utilisateur ne s'aperçoive de quoi que ce soit.

---

## 3. Inventaire complet de l'usage de Supabase dans Grasp (Audit)

Voici le recensement exhaustif de tous les composants Supabase actuellement utilisés dans l'application :

### A. Base de données & Données applicatives

L'application utilise **3 tables principales** dans le schéma `public` :

| Table | Rôle dans l'application | Colonnes principales | Relations & Contraintes |
| :--- | :--- | :--- | :--- |
| `contents` | Stocke les contenus importés (articles, vidéos YouTube, PDFs) | `id` (UUID), `user_id` (UUID), `title`, `type`, `source_url`, `raw_text`, `summary`, `is_public`, `created_at`, `share_token` (UUID unique), `audio_url` (TEXT) | Lié à l'utilisateur (`user_id`). Possède un token de partage public optionnel (`share_token`). |
| `flashcards` | Cartes mémoire générées par l'IA Gemini | `id` (UUID), `content_id` (UUID), `question`, `answer`, `status` (`new`, `known`, `review`), `created_at` | Lié à `contents.id` (suppression en cascade). |
| `messages` | Historique de chat contextuel avec l'IA sur un contenu | `id` (UUID), `content_id` (UUID), `user_id` (UUID), `role` (`user`, `assistant`), `body`, `created_at` | Lié à `contents.id` et `user_id`. |

### B. Contrôles d'accès & Règles RLS (Row Level Security)

Actuellement, Supabase applique des règles RLS en se basant sur la fonction `auth.uid()` :

1. **Table `contents`** :
   - Lecture, modification, suppression : réservées au propriétaire (`auth.uid() = user_id`).
   - Lecture publique : autorisée pour n'importe qui si `share_token IS NOT NULL` (permet le partage public d'un résumé sans compte).
2. **Table `flashcards`** :
   - Lecture, modification, suppression : réservées au propriétaire du contenu parent.
   - Lecture publique : autorisée si le contenu parent a un `share_token` public (`share_token IS NOT NULL`).
3. **Table `messages`** :
   - Lecture, insertion, suppression : strictement restreintes à l'utilisateur connecté (`auth.uid() = user_id`).
4. **Vérifications applicatives (défense en profondeur)** :
   - Toutes les routes API de Grasp (`/api/content/[id]`, `/api/chat/messages`, `/api/flashcards`, `/api/audio/generate`, etc.) filtrent déjà explicitement par `user_id = user.id`. Ce double verrou garantit une transition parfaitement sécurisée.

### C. Authentification

L'authentification est présente dans **6 points névralgiques** :
1. **Page de connexion (`/sign-in`)** : Connexion Email + Mot de passe (`signInWithPassword`) et bouton Google OAuth (`signInWithOAuth`).
2. **Page d'inscription (`/sign-up`)** : Création de compte Email + Mot de passe (`signUp`) et bouton Google OAuth.
3. **Redirection OAuth (`/auth/callback`)** : Échange du code OAuth Google contre une session utilisateur (`exchangeCodeForSession`).
4. **Déconnexion (`app/actions/auth.ts`)** : Server Action de déconnexion (`signOut`).
5. **Protection globale (`middleware.ts`)** : Vérifie la session sur chaque requête, redirige vers `/sign-in` si non connecté, et empêche un utilisateur connecté d'accéder aux pages d'auth.
6. **Vérification de session serveur** : Appel à `supabase.auth.getUser()` dans le layout principal (`app/(app)/layout.tsx`), les pages dashboard et bibliothèque, et chaque route API.

### D. Stockage de fichiers (Buckets Storage)

Deux buckets distincts sont utilisés dans Supabase Storage :

| Bucket | Visibilité | Rôle | Règle d'accès actuelle | Équivalent Neon Storage |
| :--- | :--- | :--- | :--- | :--- |
| **`pdfs`** | **Privé** | Stocke les fichiers PDF téléversés par l'utilisateur lors d'un import. | Chemin : `{user_id}/{content_id}.pdf`. Accès via des **URLs signées temporaires** (durée de validité : 1 heure). | Bucket `pdfs` avec accès `private`. Les URLs signées seront générées via l'API S3 standard (`getSignedUrlPromise`). |
| **`audio`** | **Public** | Stocke les synthèses vocales générées en MP3. | Chemin : `{user_id}/{content_id}.mp3`. Accès via des **URLs publiques directes** (`audio_url`). | Bucket `audio` avec accès `public_read`. Les fichiers sont lisibles directement via leur URL publique HTTPS. |

### E. Realtime & Edge Functions
* **Realtime (Websockets)** : **Aucun.** Grasp n'utilise pas les abonnements temps réel de Supabase ; la génération de flashcards utilise un système de scrutation (polling client via `flashcards-poller.tsx`).
* **Edge Functions Supabase** : **Aucune.** Tout le code tourne dans les routes Next.js hébergées sur Vercel.

### F. Variables d'environnement actuelles
* `NEXT_PUBLIC_SUPABASE_URL` : URL de l'instance Supabase.
* `NEXT_PUBLIC_SUPABASE_ANON_KEY` : Clé publique anonyme Supabase.

---

## 4. Plan de migration détaillé étape par étape

### Phase 1 : Préparation & Infrastructure Neon *(Déjà initiée)*
- [x] Créer la branche Git dédiée `migration-neon`.
- [x] Installer la CLI Neon et connecter le compte administrateur.
- [x] Lier le projet Neon `lingering-water-40387447` (branche `production`).
- [x] Initialiser `neon.ts` avec Neon Auth et les buckets Object Storage.
- [ ] Configurer dans `neon.ts` les deux buckets requis : `pdfs` (privé) et `audio` (public) au lieu du seul bucket `uploads`.
- [ ] Déployer la configuration via `neon deploy`.

### Phase 2 : Migration des données (Base de données & Fichiers)
1. **Structure des tables Postgres** :
   - Exporter le schéma DDL depuis Supabase (ou exécuter les scripts de création des tables `contents`, `flashcards`, `messages`).
   - Adapter les clés étrangères : au lieu de référencer `auth.users(id)` de Supabase, référencer `neon_auth.user(id)` ou conserver des colonnes UUID/TEXT standard compatibles.
2. **Migration des utilisateurs et mots de passe** :
   - Exécuter la fonction SQL d'extraction dans Supabase pour récupérer les emails, IDs et hashs de mots de passe.
   - Insérer ces comptes dans les tables `neon_auth.user` et `neon_auth.account` de Neon.
   - Les utilisateurs conserveront exactement le même identifiant (`id`) pour que tous leurs contenus existants restent associés.
3. **Migration des données applicatives** :
   - Exporter le contenu des tables `contents`, `flashcards`, `messages` depuis Supabase.
   - Les importer dans Neon Postgres.
4. **Migration des fichiers de stockage** :
   - Télécharger les fichiers des buckets Supabase `pdfs` et `audio`.
   - Les téléverser dans les buckets correspondants de Neon Object Storage (en préservant l'arborescence `{user_id}/{content_id}.ext`).
   - Mettre à jour les URLs dans la colonne `audio_url` de la table `contents` pour pointer vers le nouvel endpoint Neon.

### Phase 3 : Adaptation du code de l'application Grasp
*(Aucun fichier de l'application n'est modifié avant validation explicite)*
1. **Client Base de données** :
   - Remplacer les appels `supabase.from(...)` par un client Postgres moderne et performant pour Neon (soit `@neondatabase/serverless` avec un wrapper type-safe léger, soit Drizzle ORM).
2. **Client Authentification** :
   - Créer un module d'authentification centralisé utilisant `@neondatabase/auth` (Better Auth).
   - Adapter les pages `/sign-in` et `/sign-up` pour appeler le client Neon Auth.
   - Adapter `/auth/callback` pour gérer la redirection Google OAuth de Better Auth.
   - Adapter `middleware.ts` pour valider la session via le cookie de session de Better Auth.
   - Remplacer les appels `supabase.auth.getUser()` par `auth.api.getSession()`.
3. **Client Stockage de fichiers** :
   - Remplacer `supabase.storage.from("pdfs").createSignedUrl()` par une fonction utilitaire utilisant le client standard S3 AWS (`@aws-sdk/client-s3` et `@aws-sdk/s3-request-presigner`) configuré avec les identifiants Neon Storage (`AWS_ENDPOINT_URL_S3`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`).
   - Remplacer `supabase.storage.from("audio").upload()` par un upload S3 `PutObjectCommand`.
4. **Optimisation Vercel (Francfort)** :
   - Créer le fichier `vercel.json` à la racine pour forcer l'exécution de toutes les fonctions serverless sur Francfort :
     ```json
     {
       "regions": ["fra1"]
     }
     ```
5. **Nettoyage des dépendances** :
   - Désinstaller `@supabase/ssr` et `@supabase/supabase-js`.
   - Nettoyer le dossier `lib/supabase/`.

### Phase 4 : Tests & Validation locale
- Tester l'inscription d'un nouvel utilisateur.
- Tester la connexion d'un utilisateur existant (validation du mot de passe Supabase préservé).
- Tester la connexion avec Google OAuth.
- Tester l'import d'un article, d'une vidéo YouTube, et d'un PDF (téléversement dans Neon Storage).
- Tester la génération et la révision des flashcards.
- Tester le lecteur audio (lecture du fichier MP3 hébergé sur Neon Storage).
- Tester le partage public d'un contenu via `/share/[token]`.

### Phase 5 : Déploiement Vercel & Bascule en Production
- Renseigner les nouvelles variables d'environnement dans le dashboard Vercel.
- Merger la branche `migration-neon` sur `main` (ou déployer un Preview Vercel pour tester en conditions réelles).
- Vérifier le bon fonctionnement global en production.

---

## 5. Guide d'actions pour Alexandre (Ce que tu dois faire toi-même)

En tant que propriétaire des comptes et des services tiers, voici les quelques actions que tu auras à réaliser :

### 1. Configuration Google Cloud Console (Pour Google OAuth)
* Dans la [Google Cloud Console](https://console.cloud.google.com/), section **APIs & Services > Credentials** :
* Sélectionne ton identifiant client OAuth 2.0.
* Dans **Authorized redirect URIs**, ajoute l'URL de callback de Neon Auth :
  `https://ep-dark-firefly-b2vec42o.neonauth.c-6.eu-central-1.aws.neon.tech/neondb/auth/callback/google`
  *(ainsi que l'URL locale `http://localhost:3000/api/auth/callback/google` pour les tests)*.
* Tu renseigneras l'ID client et le Secret Google dans les paramètres Neon Auth (console Neon).

### 2. Export des utilisateurs depuis Supabase (Au moment de la migration des données)
* Rendez-vous dans le tableau de bord Supabase > **SQL Editor**.
* Tu exécuteras une requête d'export sécurisée (que nous te fournirons clé en main) pour extraire la liste des utilisateurs avec leurs hashs de mots de passe.

### 3. Variables d'environnement sur Vercel
Dans les paramètres de ton projet sur **Vercel** (**Settings > Environment Variables**) :
* **Ajouter les variables Neon** :
  - `DATABASE_URL` (URL de connexion avec pooler)
  - `DATABASE_URL_UNPOOLED` (URL de connexion directe)
  - `NEON_AUTH_BASE_URL`
  - `NEON_AUTH_JWKS_URL`
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - `AWS_ENDPOINT_URL_S3`
  - `AWS_REGION` (`eu-central-1`)
* **Supprimer les anciennes variables Supabase** :
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
* **Vérifier la région Vercel** :
  - Dans **Settings > Functions**, vérifier que la région par défaut est bien **Frankfurt, Germany (fra1)**.

---

## 6. Analyse des risques & Mesures d'atténuation

| Risque identifié | Niveau | Impact | Solution & Atténuation |
| :--- | :--- | :--- | :--- |
| **Incompatibilité de session active** | Faible | Les utilisateurs connectés lors du déploiement devront se reconnecter. | Inévitable lors d'un changement de système d'authentification (changement de format de cookie JWT Supabase ➔ Better Auth). Les utilisateurs saisiront leur mot de passe habituel et seront connectés immédiatement. |
| **Erreur de mapping d'identifiants (`user_id`)** | Élevé | Perte apparente des contenus si les IDs changent. | **Atténuation stricte** : Nous forcerons l'import des utilisateurs dans Neon en réutilisant exactement les mêmes UUIDs que dans Supabase (`id` conservé à l'identique). Aucun contenu ne sera orphelin. |
| **URLs audio rompues** | Moyen | Les anciens audios ne se liraient plus. | **Atténuation** : Un script SQL mettra à jour en une seule commande la colonne `audio_url` de la table `contents` pour remplacer le préfixe du domaine Supabase par l'endpoint Neon Storage. |
| **Latence réseau** | Nul | Aucun impact négatif. | En plaçant la base Neon à Francfort (`eu-central-1`) et les fonctions Vercel à Francfort (`fra1`), la latence sera encore meilleure qu'auparavant. |

---

## 7. Plan de retour en arrière (Rollback Plan)

> [!CAUTION]
> **Règle absolue : L'instance Supabase reste 100% active et intacte tout au long de la migration.**

Si le moindre imprévu survient lors du déploiement ou des tests :
1. **Annulation immédiate sur Git** : On conserve la branche `main` intacte jusqu'à validation finale. Si un test échoue, on revient sur `main` en 1 commande.
2. **Rollback sur Vercel en 2 minutes** :
   - Réassigner les variables d'environnement Supabase (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
   - Redéployer le commit précédent depuis le dashboard Vercel ("Promote to Production").
   - L'application retrouve instantanément son fonctionnement exact sur Supabase, sans aucune perte de données.
3. Le projet Supabase ne sera supprimé ou arrêté qu'après **plusieurs semaines** de fonctionnement parfait sur Neon.
