# Grasp V2 : PRD

> Propriétaire : Alexandre Andurand
> Statut : validé, prêt pour le développement
> Mise à jour : 26/09/2026
> Production : https://grasp-gold.vercel.app
> Documents liés : `SPEC.md` (comment on construit), `DESIGN.md` (direction « Le carnet »), `../AGENTS.md` (règles de travail)

## 1. Contexte

Grasp V1 transformait une source importée (vidéo YouTube, article, PDF) en résumé, flashcards, podcast et chat. Le bilan :

- **Trop de features, aucune aboutie.**
- **Des résultats IA génériques** : résumés plats, questions de surface.
- **Un design interchangeable**, identique à celui de la plupart des SaaS IA.
- **Aucune différence nette avec NotebookLM**, qui propose le même ensemble gratuitement.
- **Une dépendance à l'import** : sans contenu importé régulièrement, l'app ne sert à rien, et importer demande un effort qu'on finit par ne plus faire.
- **Une vitrine fermée** : un recruteur qui clique sur le lien du CV tombe sur un écran de connexion.

## 2. Vision

**Grasp t'aide à développer ta culture générale, un thème à la fois, et à t'en souvenir vraiment.**

Grasp apprend à te connaître, te propose des thèmes qui te ressemblent, te les raconte en courtes leçons quotidiennes, puis te fait réviser chaque idée juste avant que tu l'oublies.

- **Accroche (FR)** : « Un thème par semaine, quelques minutes par jour, et tu t'en souviens vraiment. »
- **Accroche (EN, à relire)** : « One topic a week, a few minutes a day, and it actually sticks. »

**Ce qui différencie Grasp** des apps d'apprentissage en petites doses (Headway, Imprint, Brilliant…) :

1. **Un parcours adapté à ton profil**, nourri par un questionnaire, tes avis et tes captures.
2. **Une vraie mémorisation** : rappel actif et répétition espacée (FSRS).
3. **Des contenus sourcés**, écrits uniquement à partir de sources fiables, plutôt qu'inventés par l'IA.
4. **Une expérience unique** : un carnet d'étude vivant (voir `DESIGN.md`).

## 3. Objectifs et indicateurs

**Objectif 1 : une vitrine qui convainc un recruteur en moins d'une minute, sans compte.**
- La landing explique Grasp et mène à la démo en un clic, sur mobile comme sur desktop.
- La démo fonctionne sans compte et sans aucun appel à l'IA : elle est toujours disponible et ne coûte rien.
- Lighthouse mobile : score de 90 ou plus en performance et en accessibilité, sur la landing et la démo.

**Objectif 2 : un produit dont Alexandre est fier et qu'il utilise vraiment.**
- **Rétention** : objectif du jour atteint au moins 5 jours sur 7, pendant les 4 semaines qui suivent le lancement.
- **Qualité** : au moins 70 % des leçons notées « Top », et moins de 5 % signalées « Il y a une erreur ».
- **Fiabilité** : au moins 90 % des parcours générés sans erreur.
- **Rapidité** : la leçon 1 est disponible en 60 secondes au plus après le choix du thème, et le parcours complet en 3 minutes au plus.

## 4. Utilisateurs

**Principal : Alexandre.** Curieux, il veut développer une vraie culture générale, mais ne sait pas par où commencer, et les formats existants l'ennuient. Il se connecte aux sujets par le récit et par ce qui le touche. Il révise sur son téléphone, quelques minutes par jour, souvent en déplacement. Il développe et teste sur desktop.

**Secondaire : le recruteur ou le manager produit.** Il clique sur le lien du CV, souvent depuis son téléphone, et passe 30 à 90 secondes sur le site. Il juge la réflexion produit et la qualité d'exécution. Il ne créera pas de compte.

## 5. La boucle produit

1. **Questionnaire d'accueil** (environ 3 minutes) : le profil de départ.
2. **3 thèmes proposés**, adaptés au profil. L'utilisateur en choisit un.
3. **Préparation du parcours** : la leçon 1 est prête en moins d'une minute, la suite s'écrit pendant qu'il lit.
4. **Chaque jour** : une leçon de 3 minutes, ses cartes, et les révisions arrivées à échéance.
5. **Fin du thème** : 3 nouvelles propositions. Les cartes des thèmes passés continuent de revenir en révision.
6. **En continu** : les avis, les choix et les captures font évoluer le profil.

## 6. Périmètre

### P0 : indispensable pour la V2

| ID | Feature | Résumé |
|---|---|---|
| F1 | Questionnaire d'accueil | 8 à 10 questions, 4 dimensions et la langue, deux textes libres facultatifs |
| F2 | Profil adaptatif | Évolue seul avec les avis, les choix et les captures ; « Refaire le questionnaire » dans les réglages |
| F3 | Propositions de thèmes | 3 angles précis, préparés à l'avance, avec leur raison d'être ; nouveau tirage possible |
| F4 | Préparation du parcours | Sources fiables, plan caché, 3 à 7 leçons, démarrage anticipé, écran d'attente |
| F5 | Leçon quotidienne | 3 minutes, une idée clé surlignée, « J'ai lu », cartes, avis, accroche du lendemain |
| F6 | Cartes | QCM, texte à trous, vrai ou faux en deux temps, gestes de stylo, balayage |
| F7 | Révisions | FSRS sur tous les thèmes, 20 cartes par jour au maximum |
| F8 | Aujourd'hui | Semaine, objectif du jour à cocher, thème en cours, accroche du lendemain |
| F9 | Thèmes | Thème en cours et thèmes passés, sources, pause ou abandon |
| F10 | Capture | Lien, texte ou capture d'écran, qui nourrit les propositions |
| F11 | Explique-moi | Explication fondée sur la leçon et ses sources, puis questions de suivi |
| F12 | Avis et signalement | « Top », « Bof » ou « Il y a une erreur » par leçon ; signalement d'une carte |
| F13 | Gamification légère | Objectif du jour, jauge de mémoire par thème, régularité de la semaine |
| F14 | Langue | Français par défaut, anglais disponible ; un seul réglage pour tout |
| F15 | Landing | Promesse, aperçus du produit, mur de thèmes, fonctionnement, accès à la démo et pied de page neutre |
| F16 | Démo | Un thème pré-généré (une leçon et ses cartes), en français et en anglais, sans compte |
| F17 | Accès restreint | Inscriptions fermées, app réservée aux e-mails autorisés |

### P1 : si le temps le permet

- Réponses de l'explique-moi affichées au fil de l'eau (streaming).
- Script d'évaluation de la génération sur une série de thèmes de test.
- Revoir une leçon d'un thème terminé.

### Hors périmètre V2

- L'import complet de contenus à résumer (PDF, articles, vidéos YouTube).
- Le podcast audio et toute synthèse vocale.
- Le chat autonome (remplacé par l'explique-moi).
- Le partage public de contenus.
- L'inscription publique, le multi-utilisateur, la collaboration.
- Les XP, les séries de jours, les badges, les classements.
- Les notifications push, le mode sombre, l'app native, le mode hors ligne.
- Plusieurs thèmes actifs en parallèle.
- L'historique de l'explique-moi.

## 7. Exigences fonctionnelles

**F1. Questionnaire d'accueil**
- 8 à 10 questions (le brouillon de l'annexe A en compte 8), une par écran, qui couvrent les centres d'intérêt (domaines), les sujets précis aimés, ce qu'on veut mieux comprendre, le style préféré (récits, faits surprenants, mécanismes), le niveau d'approfondissement et la langue.
- Deux textes libres facultatifs :
  - « Et plus précisément ? », sous la question des domaines, avec des exemples en gris (« les samouraïs, les jeux vidéo, l'histoire du jazz »).
  - « Qu'aimerais-tu mieux comprendre ? », avec une réponse « Je ne sais pas encore ».
- Toutes les autres questions sont obligatoires. Il n'y a pas de bouton « Passer ».
- La progression s'affiche en bâtons, par paquets de cinq.
- À la fin, les 3 premières propositions sont générées, puis affichées.
- Brouillon des questions : voir l'annexe A.

**F2. Profil adaptatif**
- Le profil combine les réponses au questionnaire et des signaux : domaines choisis ou écartés, avis sur les leçons, captures.
- Il s'adapte seul, sans réglage manuel.
- « Refaire le questionnaire » dans les réglages remplace les réponses et conserve l'historique des thèmes.

**F3. Propositions de thèmes**
- 3 propositions, chacune avec :
  - un **angle précis**, formulé comme un titre (« Comment le Japon s'est fermé au monde pendant 200 ans », pas « L'histoire du Japon ») ;
  - un **pitch** d'une ligne ;
  - une **raison** « pourquoi pour toi » (« Parce que tu aimes les récits d'histoire », « Tu as capturé un article là-dessus ») ;
  - un **domaine** et un **nombre de leçons**.
- Les 3 propositions sont variées : trois domaines différents quand c'est possible, et une proposition issue d'une capture s'il y en a une récente.
- Aucun thème déjà suivi n'est reproposé.
- Les propositions sont préparées à l'avance, pour que l'écran s'affiche instantanément.
- « Me proposer 3 autres idées » lance un nouveau tirage, avec une limite quotidienne.

**F4. Préparation du parcours**
- Au choix du thème, Grasp rassemble 2 à 4 sources fiables, écrit le plan complet (caché), puis la leçon 1 et ses cartes.
- **Démarrage anticipé** : « Commencer la leçon 1 » apparaît dès que la leçon 1 et ses cartes sont prêtes. La suite s'écrit pendant la lecture.
- **Écran d'attente** : les étapes se cochent au fil de l'eau, les sources trouvées s'affichent, et des anecdotes « Le savais-tu ? » défilent.
- Si l'app est fermée avant la fin, une tâche automatique termine le parcours pendant la nuit.
- En cas d'échec, un écran explique ce qui s'est passé et propose « Réessayer ». Si les sources fiables sont insuffisantes, Grasp propose de choisir un autre thème.
- Un seul nouveau thème par jour.

**F5. Leçon quotidienne**
- Une leçon par jour, d'environ 3 minutes (350 à 450 mots) : une accroche (une question ou une scène), une seule idée, un exemple concret, et pourquoi ça compte.
- L'idée clé est surlignée dans le texte.
- **« J'ai lu »** : la leçon se cache (la page se tourne sur mobile, un rabat la recouvre sur desktop), puis 2 ou 3 cartes suivent. Une fois la réponse donnée, « Revoir le passage » redevient disponible.
- **Après les cartes** : l'avis sur la leçon, puis la fiche « Demain », avec le titre d'accroche de la leçon suivante.
- **« Lire la leçon suivante maintenant »** débloque la suite pour ceux qui veulent aller plus vite.
- La progression est visible (« Leçon 2 sur 5 »). Les titres des leçons suivantes, eux, restent cachés.

**F6. Cartes**
- **QCM** : 4 choix, une seule bonne réponse.
- **Texte à trous** : un terme clé à compléter.
- **Vrai ou faux en deux temps** : vrai ou faux, puis la bonne raison parmi 3.
- **Gestes** : on entoure son choix ; la bonne réponse se surligne, la mauvaise se barre.
- Une mauvaise réponse montre la bonne et son explication, sans ton punitif.
- Après la réponse, on passe à la suite avec le bouton « Continuer » ou en balayant la carte.
- Sur desktop, tout se joue au clavier.

**F7. Révisions**
- Les cartes de tous les thèmes (en cours et passés) reviennent selon FSRS.
- 20 cartes par jour au maximum. Le retard éventuel se rattrape sur les jours suivants.
- Les révisions font partie de l'objectif du jour.

**F8. Aujourd'hui**
- Une salutation et la date.
- La semaine du lundi au dimanche : les jours où l'objectif est atteint sont surlignés, et aujourd'hui est entouré (« 4 sur 7 cette semaine »).
- L'objectif du jour en liste à cocher : la leçon du jour et les cartes à réviser, avec une durée estimée. Chaque tâche faite est cochée puis barrée.
- Un bouton « Commencer ».
- La fiche du thème en cours : sa progression et « Tu retiens 3 idées sur 4 ».
- Une fois l'objectif atteint : « Objectif atteint. À demain. », la fiche « Demain » et le lien vers la leçon suivante.
- Sans thème actif : l'objectif devient « Choisir mon prochain thème », plus les révisions.

**F9. Thèmes**
- La liste du thème en cours et des thèmes passés, avec leur jauge de mémoire.
- La page d'un thème : sa progression, une section « Sources » discrète (titre, site, lien), et les actions « Mettre en pause » et « Abandonner ».
- Abandonner un thème le retire de la progression, mais ses cartes déjà vues restent en révision.

**F10. Capture**
- Trois formats : un lien, un texte, ou une capture d'écran.
- La capture d'écran est lue puis supprimée : seule l'idée extraite est conservée.
- Rien n'est généré sur le moment. L'idée pourra devenir l'une des prochaines propositions (« Noté. Ça pourrait devenir un de tes prochains thèmes. »).
- La liste des captures est consultable, et chacune peut être supprimée.
- 10 captures par jour au maximum.
- Un avertissement discret rappelle de ne rien capturer de confidentiel.

**F11. Explique-moi**
- Disponible après chaque réponse.
- Il affiche d'abord l'explication préparée avec la carte, sans attente.
- Il permet ensuite de poser des questions de suivi : les réponses sont courtes et fondées uniquement sur la leçon et ses sources. Si les sources ne permettent pas de répondre, il le dit.
- Rien n'est conservé.
- 30 questions par jour au maximum.

**F12. Avis et signalement**
- Après chaque leçon : « Top », « Bof » ou « Il y a une erreur ». Ce dernier choix propose un champ facultatif pour préciser.
- Sur chaque carte : « Signaler » (fausse, floue, trop facile). La carte est alors retirée des révisions.

**F13. Gamification légère**
- Voir la section 8.

**F14. Langue**
- Un seul réglage dans le profil, en français par défaut. Il s'applique à l'interface et aux contenus générés.
- Changer de langue ne traduit pas les thèmes déjà générés : seuls les suivants suivent la nouvelle langue.
- Les visiteurs arrivent dans la langue de leur navigateur (français si le navigateur est en français, anglais sinon), avec un bouton FR / EN toujours visible.

**F15. Landing**
- Un visiteur non connecté qui ouvre `/` voit la landing, et l'URL reste `/`.
- Sur desktop, le premier écran occupe toute la hauteur visible. Sur mobile, sa hauteur suit le contenu, sans espace artificiel sous les fiches. Il associe l'accroche et le bouton « Essayer la démo » à deux fiches réelles du produit, superposées et inclinées.
- **Contenu** :
  - l'accroche et un sous-titre ;
  - le bouton « Essayer la démo », avec la mention « Sans compte, en 2 minutes » ;
  - deux aperçus de leçons ou de cartes, qui ouvrent la démo quand on clique dessus ;
  - un mur de huit angles précis montrant la variété des thèmes ;
  - « Comment ça marche » en quatre étapes, avec des fragments réels du questionnaire, du choix de thème, d'une leçon et des révisions ;
  - un pied de page neutre affichant uniquement « grasp » et « © 2026 ».
- « Se connecter » reste un lien discret.
- Les métadonnées et l'image d'aperçu donnent un rendu propre quand le lien est partagé sur LinkedIn.

**F16. Démo**
- Un thème pré-généré, en français et en anglais, dont on joue la leçon 1 et ses cartes, y compris « J'ai lu », les gestes et l'explique-moi (avec l'explication préparée uniquement).
- Aucun compte, aucun appel à l'IA, aucune écriture en base.
- La démo s'affiche dans la langue du visiteur.
- La fin de la démo présente l'auteur, avec ses liens.

**F17. Accès restreint**
- Aucune page ni aucun lien d'inscription.
- Une tentative d'inscription directe est refusée.
- Seuls les e-mails autorisés peuvent utiliser l'app.

## 8. Règles de rythme et de gamification

- **Rythme** :
  - une leçon par jour, et la suivante peut être débloquée à la demande ;
  - un seul thème actif à la fois ;
  - un nouveau thème par jour au maximum ;
  - 20 révisions par jour au maximum.
- **Objectif du jour** : la leçon du jour, s'il y en a une, et les révisions dues. Sans thème actif : choisir un thème, plus les révisions.
- **Régularité de la semaine** : 7 pastilles, du lundi au dimanche, qui se remplissent chaque jour où l'objectif est atteint. Chaque semaine repart de zéro, donc il n'y a jamais rien à perdre. Les jours suivent le fuseau horaire de l'appareil.
- **Jauge de mémoire** : 5 niveaux par carte, selon la solidité du souvenir. Pour un thème, « Tu retiens X idées sur Y » : une idée (une leçon) est retenue quand ses cartes atteignent en moyenne le niveau 3.
- **Ton** : jamais culpabilisant. Après une absence, le message est « Content de te revoir », jamais une perte.
- **Pas d'XP, pas de série, pas de classement.**

## 9. Qualité du contenu

C'est le premier risque du produit. Six leviers, détaillés dans la SPEC (section 7) :

1. **Des angles précis** plutôt que des sujets larges.
2. **Des sources réelles avant d'écrire** : Wikipédia, et des sites issus d'une liste de domaines fiables.
3. **Le plan d'abord**, avec une progression vérifiée.
4. **Une charte éditoriale stricte**, avec des leçons modèles validées par Alexandre.
5. **Une relecture automatique** de chaque leçon, et sa réécriture si besoin.
6. **Les avis des utilisateurs**, qui permettent de régénérer une leçon et d'ajuster les thèmes proposés.

## 10. Parcours clés

- **Le recruteur** : lien du CV → landing (dans sa langue) → « Essayer la démo » → leçon 1 → « J'ai lu » → 3 cartes avec leurs gestes → fin de démo avec l'auteur et ses liens.
- **Le premier jour** : connexion → questionnaire → 3 propositions → choix → attente d'environ 40 secondes → leçon 1 → cartes → avis → « Demain » → Aujourd'hui (« 1 sur 7, un bon début »).
- **Un jour normal** : Aujourd'hui → « Commencer » → leçon du jour → cartes → révisions → objectif atteint.
- **La fin d'un thème** : dernière leçon (synthèse) → « Thème terminé » → 3 nouvelles propositions.

## 11. Risques

| Risque | Impact | Parade |
|---|---|---|
| Offre gratuite Gemini limitée aux modèles Flash, et conditions changeantes | Qualité ou disponibilité | Modèle configurable ; plan B payant pour le plan et la relecture ; quotas internes |
| Données envoyées à Google en offre gratuite | Confidentialité | Avertissement sur la capture ; aucune donnée sensible demandée |
| Qualité des parcours insuffisante | Produit décevant | Les six leviers de la section 9 ; point de contrôle qualité au lot 5 |
| Sources fiables introuvables sur un angle | Parcours impossible | Message clair et proposition d'un autre thème |
| Limites des tâches planifiées et de la durée des fonctions Vercel | Parcours inachevés | Étapes courtes et reprenables ; vérification pendant l'audit |
| Compatibilité de Neon Auth avec Next.js 16 | Montée de version bloquée | Vérification pendant l'audit, repli sur Next.js 14 |
| Richesse de la direction « carnet » | Incohérences d'un écran à l'autre | Composants uniques et page `/styleguide` |

## 12. Points à valider pendant le développement

- La liste des domaines fiables pour la recherche web (lot 5).
- Deux leçons modèles, qui servent d'exemples dans les prompts (lot 5).
- L'accroche en anglais.

## Annexe A. Brouillon du questionnaire (à affiner au lot 4)

1. **Dans quelle langue veux-tu apprendre ?** Français, anglais.
2. **Qu'est-ce qui t'attire le plus ?** Choix multiple parmi 12 domaines : Histoire, Psychologie, Sciences, Arts, Philosophie, Économie, Nature, Technologie, Société, Géographie, Musique, Cuisine.
   - **Et plus précisément ?** Texte libre facultatif.
3. **Qu'aimerais-tu mieux comprendre ?** Texte libre facultatif, ou « Je ne sais pas encore ».
4. **Qu'est-ce qui te fait retenir quelque chose ?** Une bonne histoire, un fait surprenant, comprendre comment ça marche.
5. **Tu préfères découvrir ou approfondir ?** Survoler beaucoup de sujets, un bon équilibre, creuser à fond.
6. **Ton niveau de départ, en général ?** Je pars de zéro, j'ai des bases, je m'y connais déjà.
7. **Pourquoi veux-tu apprendre ?** Culture générale, curiosité, conversations, travail, plaisir (choix multiple).
8. **Quels sujets préfères-tu éviter ?** Choix multiple parmi les domaines, ou « Aucun ».
