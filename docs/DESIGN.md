# Grasp V2 : DESIGN, « Le carnet »

> **Grasp est un carnet d'étude vivant.** Du papier, des lignes de cahier, du ruban adhésif, des surligneurs, et des gestes de stylo animés, avec des notes manuscrites en marge.
> Maquettes validées : `docs/mockups/` (HTML interactif, à ouvrir dans un navigateur). En cas de différence, ce document fait foi.
> Toute couleur, police, taille, marge ou durée passe par les tokens ci-dessous. Aucun écran ne redessine un élément du carnet : il utilise les composants de la section 6, présentés sur `/styleguide`.

## 1. Principes

1. **Tout vient du carnet.** Papier, lignes, marge, ruban, surligneur, stylo, écriture à la main. Aucun élément « d'interface générique » (ombre grise, carte arrondie standard, dégradé) ne s'y mêle.
2. **Chaque geste a un sens, toujours le même** :
   - **surligné** = une idée clé, ou une réponse juste ;
   - **barré** = une réponse fausse ;
   - **entouré** = ton choix ;
   - **coché** = une tâche faite.
3. **Les rubans ont deux rôles** : le ruban **coloré étiquette** (un thème, un domaine, une rubrique), le ruban **noir agit** (le bouton principal).
4. **Une imperfection contrôlée.** Légères inclinaisons, découpes de ruban variées, traits un peu irréguliers. Chaque variation est tirée au hasard une fois, puis fixée pour l'élément : rien ne bouge d'un affichage à l'autre.
5. **Le charme sans sacrifier la lecture.** L'écriture manuscrite reste partout où elle a sa place, mais toujours assez grande et assez contrastée.
6. **Encourager sans culpabiliser.** Une erreur se barre, elle ne se punit pas. Une absence ne se perd pas.
7. **Mobile d'abord pour réviser, desktop en carnet ouvert.**

**À éviter** : fond sombre, violet ou indigo, dégradés, lueurs, ombres grises sous les cartes, vert pour « juste », rouge pour « faux », emoji, confettis, animations d'entrée sur chaque bloc, étiquettes en majuscules.

## 2. Couleurs

### 2.1 Matière et encre

| Token | Hex | Usage |
|---|---|---|
| `--desk` | `#EFE8DA` | Fond « bureau » autour du carnet (desktop) |
| `--paper` | `#F7F2E8` | Fond de l'app (mobile) et de la landing |
| `--page` | `#FFFDF8` | Pages du carnet, fiches |
| `--rule` | `#EFE6D6` | Lignes de cahier |
| `--edge` | `#E3D9C6` | Bords des pages, séparateurs en pointillés |
| `--pencil` | `#CFC3AB` | Contours vides (cases, segments de jauge) |
| `--ink` | `#1F1B16` | Texte, gestes de stylo, ruban noir (action) |
| `--ink-soft` | `#6B6254` | Texte secondaire, annotations secondaires |
| `--ink-faint` | `#8C8170` | Texte barré, jours à venir (contraste d'au moins 3:1 sur `--page`) |
| `--on-ink` | `#F7F2E8` | Texte sur le ruban noir |

### 2.2 Les 16 surligneurs (un par thème)

| Famille | Surligneurs |
|---|---|
| Jaunes | Beurre `#FFE27A`, Citron `#FFF3A3`, Miel `#F9CF6B` |
| Chauds | Sable `#EFD5A8`, Abricot `#FFD3AE` |
| Rosés | Rose poudré `#F6C9D0`, Brique douce `#E9B8A8` |
| Bleus | Ciel `#A5D8FF`, Glacier `#CFE8F7`, Lagon `#9ED6E3`, Pervenche `#B9C3FF` |
| Violets | Lilas `#D9C4FF`, Mauve `#E3C6EA`, Lavande grise `#CFC7E8` |
| Verts | Sauge `#CFE0B8`, Menthe `#C4ECD9` |

- Chaque thème reçoit un surligneur à sa création (`themes.color_key`). **Deux thèmes qui se suivent ne tirent jamais dans la même famille.**
- La couleur du thème colore : son ruban, la marge de ses pages, le trait sous le titre de ses leçons, ses surlignages, ses bonnes réponses et sa jauge de mémoire.
- Les écrans hors thème (Aujourd'hui, questionnaire, landing) utilisent Beurre par défaut.
- Le texte posé sur un surligneur est toujours en `--ink`.
- **Pas de mode sombre en V2.**

## 3. Typographie

| Rôle | Police | Usage |
|---|---|---|
| Écrit | **Fraunces** (`next/font/google`, graisses 400 et 500) | Titres, leçons, questions, réponses, accroche de la landing |
| Manuscrit | **Caveat** (`next/font/google`, graisse 500 uniquement) | Annotations, retours, étiquettes de ruban, bouton ruban, intercalaires, « Comment ça marche » |
| Interface | **Geist Sans** (déjà installé) | Métadonnées (« Leçon 1 sur 5, 3 min »), compteurs, labels de navigation mobile, formulaires |

- Caractères latins uniquement, `display: swap`. Pas de quatrième famille.
- **Manuscrit** : 18 px minimum en mobile, 22 px minimum en desktop. 16 px est toléré sur une étiquette de ruban d'un ou deux mots. En `--ink` pour une annotation importante (retour de réponse), en `--ink-soft` pour une annotation secondaire.

| Token | Mobile | Desktop | Police |
|---|---|---|---|
| `display` | 26/32 | 46/56 | Fraunces 400 (accroche de la landing) |
| `title` | 20/24 | 27/32 | Fraunces 500 (titre d'écran, de leçon) |
| `question` | 16/24 | 19/32 | Fraunces 400 |
| `reading` | 15/24 | 17/32 | Fraunces 400 (corps de leçon) |
| `answer` | 18/24 | 23/32 | Fraunces 400 (Vrai, Faux) |
| `note` | 19/24 | 25/32 | Caveat 500 |
| `note-small` | 18/24 | 22/32 | Caveat 500 |
| `meta` | 12/24 | 14/32 | Geist 400 |

## 4. Grille, pages et espacements

- **Grille de page** : 24 px en mobile, 32 px en desktop. La landing fait exception et conserve une grille de 32 px à toutes les tailles. À l'intérieur d'une page, **tout est un multiple de la grille** : marges internes, hauteurs de lignes, hauteurs des composants, écarts. Les lignes de cahier démarrent exactement au début du texte. **Le texte doit toujours reposer sur une ligne.** À vérifier visuellement sur chaque écran.
- **Position des lignes** : token `--rule-baseline-mobile` à 17 px dans chaque cellule mobile, token `--rule-baseline-desktop` à 22 px dans chaque cellule desktop, comme dans les maquettes validées.
- **Répartition du papier ligné** : les lignes de cahier apparaissent uniquement sur les pages et les fiches. Les zones de composition larges restent sur papier uni. Les grands titres utilisant le token `display` sont toujours posés sur papier uni, jamais directement sur des lignes.
- **Page** : fond `--page`, lignes `--rule` de 1 px, bordure 1 px `--edge`, rayon de 6 px, marge verticale de 1,5 px dans la couleur du thème, à 22 px du bord en mobile (44 px en desktop). Le contenu commence à 34 px du bord (72 px en desktop).
- **Inclinaisons** : de -1,5° à +1,5° pour les fiches et les rubans, jusqu'à 3° pour un ruban. Les fiches décoratives superposées de la landing peuvent exceptionnellement aller de -2° à +3,5°. Leur inclinaison reste fixe. Aucune inclinaison sur le corps d'une leçon en lecture.
- **Espacements hors page** : multiples de 4 (4, 8, 12, 16, 24, 32, 48, 64).
- **Aucune ombre**, sauf la feuille de l'explique-moi et le rabat de « J'ai lu » (ombre douce `0 -6px 20px rgba(31, 27, 22, 0.08)`).

### Composition et densité

- Chaque écran remplit la fenêtre : à 1440 × 900 comme sur mobile, le premier écran montre l'essentiel, sans moitié vide. Les pages courtes, notamment la landing et les états vides, occupent toute la hauteur de la fenêtre avec une composition équilibrée.
- Pas de bloc de texte seul : chaque section associe un texte à un objet du carnet — fiche, bande lignée, ruban ou annotation.
- En deux colonnes, les deux côtés pèsent autant : face à un grand titre, la colonne visuelle porte assez de matière.
- Une annotation désigne toujours quelque chose : sa flèche part du texte et va vers l'élément qu'elle commente.
- Le vide est un choix : il est réservé à la respiration autour de l'accroche, pas laissé par défaut.
- **Grands écrans** : toutes les pages utilisent la même taille racine progressive. À partir de 1600 px de large, elle grandit de 16 px à 22 px à 2560 px, selon `clamp(16px, calc(16px + (100vw - 1600px) * 0.00625), 22px)`. Toutes les dimensions utilisent des `rem` afin que l'interface, les fiches et la grille du carnet grandissent proportionnellement sans perdre l'alignement des lignes. Le carnet ouvert sur desktop mesure au maximum `68,75rem`, soit 1100 px à la taille de base. La landing utilise une largeur maximale propre de `81rem`.
- **Étapes en colonnes** : à partir de 1024 px, les étapes de « Comment ça marche » utilisent une sous-grille CSS (`grid-template-rows: subgrid`). Les numéros, les titres et les fragments du produit occupent les mêmes rangées d'une colonne à l'autre, même lorsqu'un titre passe sur plusieurs lignes. En dessous de 1024 px, les étapes s'empilent et le chemin passe verticalement dans la colonne des numéros.

### Petits écrans et adaptation

- Sur petit écran, la page se réorganise, elle ne rétrécit pas : la taille racine ne descend jamais sous 16 px. Chaque composant a une disposition prévue pour trois plages : téléphone (moins de 640 px), tablette (640 à 1023 px) et desktop (1024 px et plus).
- Les tailles de l'accroche et des titres de section sont fluides entre 320 et 1023 px (`clamp`), sans jamais passer sous les minimums : 15 px pour le texte courant, 12 px pour les métadonnées et 18 px pour le manuscrit.
- Une annotation reste attachée à ce qu'elle désigne : elle se trouve à 1rem au plus de sa cible et sa flèche mesure 3rem au plus. Une annotation n'est jamais isolée au milieu d'un espace vide. Si la place manque, elle passe juste sous sa cible ou elle est masquée, comme « la suite, par ici ».
- **Étapes empilées, sous 1024 px** : chaque étape utilise deux colonnes, avec le cercle de 2,75rem puis le contenu. Le titre est immédiatement suivi de ses éléments, sans ligne vide. Une seule ligne vide sépare deux étapes. Le chemin est une ligne en pointillés continue, placée dans l'axe des cercles, qui part juste sous un cercle et arrive juste au-dessus du suivant.
- **Grille de la landing** : les lignes restent espacées de 2rem à toutes les tailles. Aucune ligne vide n'est ajoutée et chaque élément occupe un nombre entier de lignes.
- Aucun défilement horizontal n'est accepté à partir de 320 px. Aucun élément ne dépasse la largeur de l'écran : les mini-rubans et les rubans passent à la ligne, et les fiches inclinées restent dans la page.
- **Espacements sur petit écran** : l'espace entre les sections utilise `clamp(4.5rem, 14vw, 6rem)`. Sous 640 px, le premier écran n'est pas forcé à pleine hauteur et il reste au plus 4rem sous les fiches.
- Sur téléphone, les inclinaisons sont limitées à ±2°. Lorsque des fiches sont superposées, le contenu clé de la fiche arrière reste visible.

## 5. Mouvement

| Token | Durée | Courbe | Usage |
|---|---|---|---|
| `--dur-press` | 120 ms | ease-out | Appui |
| `--dur-check` | 350 ms | `cubic-bezier(.2,.8,.2,1)` | Coche, trait qui barre |
| `--dur-sweep` | 450 ms | `cubic-bezier(.2,.8,.2,1)` | Surlignage qui balaie de gauche à droite |
| `--dur-circle` | 500 ms | ease-out | Trait qui entoure (tracé progressif) |
| `--dur-card` | 400 ms | `cubic-bezier(.2,.8,.2,1)` | Carte qui s'envole, carte suivante qui arrive |
| `--dur-page` | 500 ms | `cubic-bezier(.2,.8,.2,1)` | Page qui se tourne, rabat |
| `--ease-pop` | 250 ms | `cubic-bezier(.3,1.6,.5,1)` | Ruban noir qui se soulève à l'appui |

**Séquences** :
- **Bonne réponse** : le choix est entouré, puis surligné dans la couleur du thème, et un segment de la jauge se remplit. Le retour manuscrit apparaît.
- **Mauvaise réponse** : le choix est barré d'un trait et passe en `--ink-faint`. 350 ms plus tard, la bonne réponse est entourée et surlignée.
- **Vrai ou faux** : l'étape « Pourquoi ? » est grisée (opacité 0,35) jusqu'à la première réponse, puis s'active.
- **Case à cocher** : la coche se trace, et le texte de la tâche est barré.
- **Carte suivante** : la carte s'envole vers la gauche en tournant de -10°, et la suivante arrive depuis la droite.
- **« J'ai lu »** : sur mobile, la page de leçon se tourne vers la gauche. Sur desktop, un rabat de papier glisse sur la page de gauche, avec la note « De mémoire, cette fois ».
- **Bouton ruban** : à l'appui, il se soulève (rotation de -7°, montée de 5 px) puis se repose.
- **Attente** : les étapes se cochent au fil de l'eau. Les anecdotes s'enchaînent avec un fondu de 350 ms. Chacune reste affichée au moins 6 secondes, plus 1 seconde par tranche de 12 mots, et un toucher passe à la suivante.
- **Aucune animation spontanée**, en dehors de l'écran d'attente, de la mise à jour de la jauge et des tracés au crayon décrits ci-dessous.
- **Tracé au crayon à l'apparition** : le chemin de « Comment ça marche » et la flèche « la suite, par ici » peuvent se dessiner une seule fois lorsqu'ils apparaissent dans la fenêtre. L'animation utilise le token `--dur-circle` et ne se rejoue pas pendant la même visite de la page.
- **`prefers-reduced-motion`** : les tracés au crayon, cercles et balayages s'affichent directement. Les envols et pages qui tournent deviennent des fondus de 150 ms.

**Balayage (mobile)** : une fois la réponse donnée, glisser la carte horizontalement de plus de 70 px la fait passer à la suivante. En dessous, elle revient en place avec un léger rebond. Le geste ne démarre pas à moins de 24 px des bords de l'écran, pour ne pas entrer en conflit avec le retour arrière du système. Le bouton « Continuer » reste toujours disponible.

## 6. Composants

| Composant | Description et états |
|---|---|
| `Page` | Page lignée avec sa marge colorée. Props : `color`, `grid` (24 ou 32), `tilt` |
| `Tape` | Ruban adhésif coloré, avec son texte en manuscrit. Longueur, angle et découpe des bords (`clip-path` en dents irrégulières) sont tirés d'une graine fixe (`seed`). Semi-opaque (opacité de 0,9) |
| `TapeButton` | Le bouton principal : ruban noir, texte `--on-ink` en Caveat 22 px (26 px en desktop), 44 px de haut minimum, légèrement incliné. États : repos, appui, focus (contour pointillé `--ink` décalé de 3 px), chargement (« … » manuscrit). Un seul par écran |
| `MarkerUnderline` | Trait de marqueur de 5 px, légèrement ondulé, sous un titre, sur 55 à 62 % de sa largeur, dans la couleur du thème |
| `Highlight` | Surlignage sur 60 % de la hauteur de la ligne, rayon de 3 px, avec `box-decoration-break: clone` pour qu'un surlignage sur plusieurs lignes garde ses bords sur chaque ligne. Variante animée (balayage) |
| `PenCircle` | Ellipse tracée à la main autour d'un mot, tracé progressif (`stroke-dasharray`), trait de 1,6 px |
| `PenStrike` | Trait qui barre, de 2 px, avec un tracé progressif |
| `CheckBox` | Case dessinée à la main, un peu de travers, et coche tracée. Zone tactile de 44 × 44 px |
| `Tally` | Décompte en bâtons par paquets de cinq, le cinquième en diagonale. Sert à la progression du questionnaire |
| `WeekStrip` | L à D : jours réussis surlignés, aujourd'hui entouré, jours à venir en `--ink-faint`, avec « 4 sur 7 cette semaine » en manuscrit |
| `MemoryMeter` | 5 segments de 16 × 7 px (20 × 8 en desktop) : pleins dans la couleur du thème, vides avec un contour `--pencil` |
| `Note` | Annotation manuscrite (tailles `note` et `note-small`) |
| `ReadCover` | Transition « J'ai lu » : page qui tourne (mobile) ou rabat (desktop). « Revoir le passage » le relève |
| `CardMcq`, `CardCloze`, `CardTrueFalse` | Cartes-pages : un en-tête (type de carte à gauche, « 1 / 3 » à droite, en `meta`), la question, les réponses, puis le retour manuscrit dans la carte. Chaque réponse a une zone tactile de 44 px minimum. Les réponses ne sont pas des boîtes : ce sont des lignes de texte, qu'on entoure, surligne ou barre |
| `SwipeContainer` | Porte la carte et gère le balayage |
| `ProposalCard` | Fiche scotchée : ruban du domaine, titre de l'angle, pitch en `meta`, raison « pour toi » en `note-small`, nombre de leçons. Choisie : elle se redresse, se soulève de 2 px, reçoit une coche dans la marge, et les autres passent à une opacité de 0,55 |
| `ObjectiveList` | Fiche « Objectif du jour » : un ruban coloré (jamais noir), les tâches à cocher, la durée estimée |
| `TomorrowCard` | Fiche « Demain » : titre d'accroche de la leçon suivante, puis « Leçon 2 sur 5 » |
| `PrepareChecklist` | Étapes de préparation qui se cochent, avec les sources trouvées en note sous la première étape |
| `FactRotator` | Fiche « Le savais-tu ? » : d'abord la banque d'anecdotes sur l'apprentissage, puis celles du thème |
| `ExplainSheet` | Feuille du bas (mobile) ou panneau sur la page de droite (desktop) : explication, puis champ « Pose ta question » |
| `SourcesList` | Liste discrète : titre, site, licence, lien |
| `Spiral` | Spirale du carnet ouvert (desktop) : un anneau tous les 32 px, chacun traversant une perforation sur le bord des deux pages |
| `TabDivider` | Intercalaire de navigation (desktop), sur le bord droit du carnet |
| `BottomNav` | Navigation mobile : Aujourd'hui, Thèmes, Capturer. Icônes au trait et labels, séparés du contenu par un trait en pointillés `--edge` |
| `ErrorPage` | Page raturée : un titre barré, l'explication en manuscrit, et un bouton ruban « Réessayer » |
| `EmptyState` | Une invitation en manuscrit, et un bouton ruban |

## 7. Écrans

### 7.1 Mobile

**Questionnaire** : le décompte en bâtons et « Question 3 sur 9 ». Le titre en Fraunces avec son trait de marqueur, et une consigne manuscrite (« Choisis-en autant que tu veux »). Les réponses sont des mots sur une page lignée, qui se surlignent chacun dans sa propre couleur quand on les choisit. Sous la page, un compteur manuscrit (« 2 choisis ») et le ruban noir « Suivant ». Les textes libres s'écrivent directement sur les lignes, avec des exemples en `--ink-faint`. Il n'y a pas de bouton « Passer ».

**Choix du thème**
```
Ton prochain thème                    (title + trait)
Trois idées choisies pour toi.        (note)
 ┌[Histoire]──────────────────┐       ruban du domaine, fiche -1°
 │✓ Comment le Japon s'est    │       coche dans la marge si choisie
 │  fermé au monde…           │
 │  Le sakoku, ou comment…    │       pitch (meta)
 │  Parce que tu aimes…  5 l. │       raison (note-small), nb de leçons
 └────────────────────────────┘
 (2 autres fiches, inclinaisons différentes)
     [ Commencer ce thème ]           ruban noir
     Me proposer 3 autres idées       note soulignée
```

**Préparation** : le titre « Je prépare ton parcours » et l'angle en note. Une fiche avec la `PrepareChecklist` : « Trouver des sources fiables » (avec la note des sources), « Tracer le parcours », « Écrire ta première leçon », « Préparer tes cartes ». Puis la fiche « Le savais-tu ? ». Dès que la leçon 1 et ses cartes sont prêtes, le ruban « Commencer la leçon 1 » apparaît, avec « La suite s'écrit pendant que tu lis. ».

**Leçon**
```
Leçon 1 sur 5, 3 min                  meta
Le jour où le Japon a fermé           title + trait (couleur du thème)
ses portes
Paragraphe… [idée clé surlignée]…     reading, sans inclinaison
        [ J'ai lu ]                   ruban noir
── la page se tourne ──
 ┌[Sakoku]────────────────────┐       carte-page
 │Vrai ou faux ?         1 / 3│
 │Pendant le sakoku, le Japon │
 │a coupé tout contact…       │
 │  Vrai        (Faux)         │       Vrai barré, Faux entouré et surligné
 │Pourquoi ?                  │       note
 │☑ Des Hollandais… (surligné)│
 │Exactement. Cette idée      │       note, en encre
 │tient mieux.                │
 └────────────────────────────┘
Mémoire ■■■□□   Revoir le passage
        [ Continuer ]                 ruban noir (ou balayage)
```
Après la dernière carte : « Top / Bof / Il y a une erreur » en manuscrit, puis la `TomorrowCard` et « Envie de continuer ? Lire la leçon 2 maintenant ».

**Aujourd'hui** : « Bonjour Alexandre » et la date, la `WeekStrip`, la fiche « Objectif du jour », le ruban « Commencer », puis la fiche du thème en cours (ruban du thème, « Leçon 2 sur 5 », jauge, « Tu retiens 3 idées sur 4 »), et la `BottomNav`. Quand l'objectif est atteint, les tâches sont cochées et barrées, avec « Objectif atteint. À demain. », puis la `TomorrowCard`. Le premier jour, la semaine n'a qu'un jour surligné, avec « 1 sur 7, un bon début ».

**Révisions** : le même format de cartes, avec le ruban du thème d'origine de chaque carte. En fin de série : « 12 cartes revues. 3 idées tiennent mieux. »

**Thèmes** : la fiche du thème en cours, puis les thèmes passés, chacun avec son ruban et sa jauge. La page d'un thème : sa progression, la `SourcesList`, « Mettre en pause » et « Abandonner » en liens manuscrits.

**Capturer** : trois onglets manuscrits (Lien, Texte, Capture d'écran), une page lignée pour coller ou écrire, le ruban « Garder cette idée », puis la liste des captures, supprimables. Une note discrète : « Évite ce qui est confidentiel. »

### 7.2 Desktop (1024 px et plus)

- **Le carnet ouvert** : une double page centrée, de 1100 px de large au maximum, posée sur le fond `--desk`. La `Spiral` au milieu, et une grille de 32 px.
- **Les intercalaires** (`TabDivider`) sur le bord droit : Aujourd'hui, Thèmes, Capturer, chacun dans un surligneur. Ils mesurent au moins 88 × 44 px, avec le texte en manuscrit. L'intercalaire actif prend la couleur `--page` et se fond avec la page, comme un intercalaire ouvert. Navigation au clavier, avec un focus visible.
- **La barre du haut** : le logo « Grasp » avec son trait de marqueur à gauche, la `WeekStrip` à droite.
- **La leçon** : la leçon occupe la page de gauche, les cartes celle de droite. Pendant les cartes, le rabat « J'ai lu » recouvre la page de gauche.
- **Les raccourcis clavier**, rappelés en note dans la marge (« ou appuie sur Entrée ») : 1 à 4 pour choisir, V et F pour vrai ou faux, Entrée pour continuer, E pour l'explique-moi, Échap pour quitter.
- **Les autres écrans** se répartissent sur la double page. Par exemple, pour Aujourd'hui : l'objectif à gauche, le thème en cours et « Demain » à droite. Pour le choix du thème : l'introduction à gauche, les 3 fiches à droite.
- **Entre 560 et 1023 px** : la page simple du mobile, centrée, sur 560 px de large au maximum.

### 7.3 Landing et démo

**Règle de surface** : les accroches de la landing et de la démo sont posées sur papier uni. Les lignes de cahier sont réservées aux fiches d’aperçu, aux exercices, aux leçons et aux autres véritables pages du carnet.

**Structure commune** :
- Sur desktop, le premier écran occupe exactement toute la hauteur visible (`100svh`). L'en-tête, le contenu principal et l'indication « la suite, par ici » sont répartis dans cette hauteur. Sur mobile, sa hauteur suit le contenu : elle n'est pas forcée à `100svh` et l'espace sous les fiches reste réduit.
- L'accroche reste sur papier uni. Les aperçus, exercices et démonstrations du produit utilisent des fiches ou des bandes lignées.
- La landing se poursuit avec un mur de thèmes, puis « Comment ça marche », puis un pied de page neutre.
- Jusqu'à l'arrivée de la démo, les aperçus sont statiques et la note indique « La démo jouable arrive bientôt. ». Au lot 8, le ruban noir « Essayer la démo » et la mention « Sans compte, en 2 minutes » s'ajoutent, et les aperçus peuvent ouvrir `/demo`.

**Premier écran, mobile** :
- En haut : le logo avec son trait, le bouton `FR EN` et « Se connecter » en lien discret.
- Le ruban coloré « Bientôt disponible », puis l'accroche en `display`, avec « tu t'en souviens vraiment. » surligné, le sous-titre et la note « La démo jouable arrive bientôt. ».
- Sous le texte, deux fiches lignées, superposées et inclinées. La fiche Psychologie se trouve derrière ; la fiche Sakoku, déjà répondue, se trouve devant.
- Sous les fiches, l'annotation « une vraie carte de révision » désigne la fiche Sakoku avec une flèche courbe remontante.
- L'annotation « la suite, par ici » n'apparaît pas sur mobile.

**Premier écran, desktop** :
- Une composition équilibrée en deux colonnes : l'accroche sur papier uni à gauche et les deux fiches lignées, plus grandes, à droite.
- La fiche Psychologie, derrière, est inclinée d'environ +3,5°. Son ruban Ciel indique « Psychologie ». Elle présente « Leçon 2 sur 4 », « Pourquoi on procrastine, même quand on sait » et l'idée « préfère une récompense immédiate » surlignée.
- La fiche Sakoku, devant, est inclinée d'environ -2°. Son ruban Lilas indique « Sakoku ». Elle présente un vrai ou faux déjà répondu : « Vrai » barré, « Faux » entouré et surligné, puis « Exactement. Cette idée tient mieux. » en manuscrit.
- Sous les fiches, l'annotation « une vraie carte de révision » et sa flèche courbe remontante désignent la fiche Sakoku.
- À partir de 1024 px de large et 700 px de haut, l'annotation « la suite, par ici » apparaît sous la colonne de texte. Sa flèche se trace une fois vers le bas. L'ensemble disparaît en fondu dès que le défilement commence.

**Mur de thèmes** :
- Le titre « Chaque semaine, un thème choisi pour toi » en Fraunces, puis la note « Des angles précis, jamais des sujets fourre-tout. ».
- Huit rubans colorés présentent huit angles précis. Leurs couleurs utilisent les 16 surligneurs, sans deux rubans voisins de la même famille.
- Leurs inclinaisons et découpes sont variées, mais fixées par une graine propre à chaque ruban.

**Comment ça marche** :
- Une bande lignée porte quatre étapes. Chaque numéro est entouré à la main et relié au suivant par un chemin en pointillés tracé au crayon.
- Chaque étape montre un fragment réel du produit, sans icône :
  1. des centres d'intérêt surlignés ou non ;
  2. trois mini-rubans de thèmes, dont un choisi et coché ;
  3. les métadonnées et une ligne réelle de leçon avec son idée clé surlignée ;
  4. une jauge de mémoire et le nombre de cartes prévues le lendemain.
- Sur desktop, les quatre étapes sont disposées en colonnes et reliées horizontalement.
- Sur mobile, elles s'empilent et le chemin devient vertical dans la marge.
- Le chemin se dessine une seule fois lorsque la section apparaît. Avec `prefers-reduced-motion`, il est immédiatement visible.

**Pied de page** :
- Le pied de page est neutre : « grasp » et « © 2026 ».
- Il ne contient ni nom personnel, ni lien vers un portfolio ou un réseau social.

**Démo** : l'écran de leçon, identique à celui de l'app, sans navigation, avec un bandeau manuscrit discret (« Démo, rien n'est enregistré »). La fin de démo tient sur une page : « C'est Grasp. », une phrase, les liens de l'auteur et un ruban « Retour à l'accueil ».

## 8. Ton et micro-copie

- **En français** : tutoiement, chaleureux, direct, phrases courtes. **En anglais** : même ton, deuxième personne.
- Pas de « avec succès », pas de « veuillez », pas de point d'exclamation dans les messages système.
- Les retours manuscrits peuvent être un peu plus personnels, tout en restant sobres.

| Moment | Français | English |
|---|---|---|
| Bonne réponse | Exactement. Cette idée tient mieux. | Exactly. This one's sticking. |
| Bonne réponse (variante) | Bien vu. | Nicely done. |
| Première étape juste (vrai ou faux) | Bien vu. Maintenant, pourquoi ? | Right. Now, why? |
| Mauvaise réponse | Presque. Tu la reverras bientôt. | Almost. You'll see it again soon. |
| Première étape fausse | Pas tout à fait. Mais pourquoi ? | Not quite. But why? |

| « J'ai lu » (rabat) | De mémoire, cette fois. | From memory this time. |
| Objectif atteint | Objectif atteint. À demain. | Goal done. See you tomorrow. |
| Premier jour | 1 sur 7, un bon début. | 1 of 7, a good start. |
| Retour après une absence | Content de te revoir. | Good to see you again. |
| Capture enregistrée | Noté. Ça pourrait devenir un de tes prochains thèmes. | Noted. This could become one of your next topics. |
| Attente | La suite s'écrit pendant que tu lis. | The rest is being written while you read. |
| Sources insuffisantes | Pas assez de sources fiables sur ce sujet. Choisis-en un autre ? | Not enough reliable sources on this one. Pick another? |
| Erreur de génération | Ça n'a pas marché cette fois. On réessaie ? | That didn't work this time. Try again? |
| Avis sur une leçon | Top / Bof / Il y a une erreur | Great / Meh / Something's wrong |

(Dans le dernier cas, les trois avis sont affichés comme trois mots manuscrits séparés, à entourer.)

## 9. Accessibilité

- Contrastes AA pour tout le texte, et 3:1 au moins pour le texte inactif (`--ink-faint`) et les contours utiles.
- Zones tactiles de 44 × 44 px minimum, même quand le dessin est plus petit.
- Focus visible partout : contour en pointillés `--ink`, décalé de 3 px.
- Les retours de réponse sont annoncés via `aria-live="polite"`.
- Un geste n'est jamais le seul signal : le texte du retour dit toujours si c'est juste ou faux.
- Les éléments décoratifs (lignes, spirale, rubans purement décoratifs) sont masqués aux lecteurs d'écran.

## 10. Checklist de revue design (à chaque lot)

- [ ] Aucune couleur, taille, marge ou durée en dur : uniquement des tokens.
- [ ] Le texte repose sur les lignes (grille de 24 ou 32 px respectée).
- [ ] Les gestes gardent leur sens (surligné, barré, entouré, coché).
- [ ] Un seul ruban noir par écran. Les rubans colorés étiquettent, ils n'agissent pas.
- [ ] Les imperfections sont variées, mais fixes d'un affichage à l'autre.
- [ ] Le manuscrit respecte ses tailles minimales.
- [ ] Écran vérifié à 375 px, à 1024 px et à 1440 px.
- [ ] Clavier, focus visible et `prefers-reduced-motion` testés.
- [ ] Textes en français et en anglais, sans formulation culpabilisante.
- [ ] L'écran utilise les composants de `/styleguide`, sans rien redessiner.

### Robustesse, quels que soient l'écran et l'appareil

- [ ] **Polices** : Fraunces, Caveat et Geist sont servies par `next/font`, hébergées avec l'app et préchargées. Leurs polices de secours conservent des dimensions compatibles. Avec une connexion lente simulée, aucun contenu ne déborde et aucun élément ne se chevauche pendant leur chargement.
- [ ] **Gestes** : les cercles, traits barrés et surlignages s'adaptent aux dimensions réelles du texte. Ils ne dépendent jamais d'une boîte de taille fixe.
- [ ] **Sans JavaScript** : tout le contenu reste visible et lisible. Seuls les tracés animés peuvent être absents.
- [ ] **Mode clair** : `color-scheme: light` est forcé, même si l'appareil utilise un thème sombre.
- [ ] **Tailles d'écran** : vérifier les largeurs 320, 375, 390, 768, 1024, 1280, 1440, 1920 et 2560 px, ainsi que les hauteurs 667, 700, 900 et 1440 px. Vérifier aussi téléphone et tablette en orientation paysage.
- [ ] **Navigateurs** : vérifier Safari sur Mac et iPhone, Chrome et Firefox.
- [ ] **Zoom et texte agrandi** : à 200 % de zoom et avec une grande taille de texte, aucun élément ne se chevauche.
- [ ] **Variations de texte** : les textes français et anglais, plus courts ou plus longs, passent correctement à la ligne dans les titres, les annotations et les rubans.
- [ ] **Traits fins** : aucune ligne de 1 px n'est rendue floue sur un écran non Retina.

## Logo

Le logo est l'élément stable de la DA « Le carnet » : sobre, à l'encre, sans effet. Le carnet vit dans le logo complet à travers un seul geste, le coup de surligneur. Le symbole, le mot vectorisé et ce geste forment un SVG unique, dimensionné par le token `--logo-height` et réutilisé sans recomposition dans l'interface, le favicon et l'image d'aperçu.

### Symbole

Demi-G + point. Le fichier `public/brand/grasp-symbol.svg` conserve le tracé source, avec un `viewBox` recadré au plus près du dessin.

- Couleur unique : encre `#1F1B16` (token encre de ce document s'il existe). Sur fond encre, utiliser le papier `#F7F2E8`.
- Jamais en couleur de surligneur, jamais d'indigo (l'ancien `#4F46E5` de la V1 est retiré).
- Largeur minimale : 16 px.

### Logo complet

Symbole + mot « grasp », en minuscules vectorisées depuis Fraunces 500, couleur encre.

- Alignement : le bas du symbole repose sur la ligne de base du mot. Son haut suit la hauteur d'x avec un dépassement optique compris entre 2 et 4 %. Il n'est jamais centré verticalement sur la boîte du mot, car les jambages du `g` et du `p` fausseraient cet alignement.
- Espace entre le symbole et le mot : environ `0,3em`.
- Le symbole et le mot utilisent exactement l'encre `--ink`. L'épaisseur du symbole reste visuellement cohérente avec Fraunces 500.
- Approche du mot légèrement serrée (letter-spacing ≈ −0,02 em).
- Coup de surligneur lavande `#CFC7E8` derrière le mot uniquement, jamais derrière le symbole. Épaisseur ≈ 50 % de la taille du texte, posé sur la moitié basse des lettres, débordant d'environ 0,15 em de chaque côté. Tracé légèrement ondulé, extrémités arrondies :
  `<svg viewBox="0 0 200 20" preserveAspectRatio="none"><path d="M3 12 C 60 7, 130 15, 197 9" stroke="#CFC7E8" stroke-width="12" fill="none" stroke-linecap="round"/></svg>`
- La couleur du surligneur du logo est fixe : elle ne suit pas le thème actif.
- Le nom « grasp » n'est jamais écrit en Caveat : l'écriture manuscrite reste la voix des annotations.
- Le logo n'est jamais incliné et ne reçoit pas de ruban adhésif.

### Favicon et icônes

Le favicon et l'icône Apple réutilisent le SVG complet `public/brand/grasp-logo.svg`. Aucune variante recomposée du logo n'est maintenue séparément.
