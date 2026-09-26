# Maquettes de référence : « Le carnet »

Ces fichiers HTML sont les maquettes validées de Grasp V2. Ouvre-les d'un double-clic dans un navigateur (une connexion internet est nécessaire pour charger les polices Fraunces, Caveat et Geist). Elles sont interactives : les gestes, les transitions et le balayage fonctionnent.

**En cas de différence avec `docs/DESIGN.md`, c'est `DESIGN.md` qui fait foi.** Les maquettes montrent l'esprit, les proportions et les animations. Le document fixe les règles, les tokens et les états.

| Fichier | Ce qu'il montre |
|---|---|
| `01-lecon-mobile.html` | Leçon mobile, « J'ai lu » (la page se tourne), carte vrai ou faux en deux temps, gestes (entourer, surligner, barrer, cocher), « Revoir le passage », changement de couleur de thème |
| `02-surligneurs.html` | Les 16 surligneurs, classés par famille |
| `03-ruban-et-balayage.html` | Le ruban noir « Continuer » et le balayage de carte |
| `04-choix-du-theme-et-aujourdhui.html` | Choix parmi 3 thèmes, écran Aujourd'hui (semaine, objectif à cocher, thème en cours), navigation mobile |
| `05-questionnaire-et-preparation.html` | Questionnaire (domaines surlignés, texte libre sur la ligne, bâtons par cinq) et préparation du parcours (étapes, sources, anecdotes, démarrage anticipé) |
| `06-premier-jour-et-landing-mobile.html` | Aujourd'hui le premier jour (objectif atteint, fiche « Demain ») et landing mobile |
| `07-desktop-lecon-et-landing.html` | Desktop : carnet ouvert en double page, spirale, intercalaires, rabat « J'ai lu », puis landing desktop |
| `08-landing-provisoire.html` | Page d'accueil provisoire complète et responsive : premier écran sur toute la hauteur, « la suite, par ici », mur de thèmes, « Comment ça marche » avec son chemin au crayon, pied de page neutre, agrandissement proportionnel sur grand écran. **C'est la référence de la landing** : elle remplace la partie landing des maquettes 06 et 07 |

**Simplifications propres aux maquettes** (à ne pas reproduire telles quelles) :
- Les couleurs, tailles et durées sont écrites en dur. Dans l'app, elles passent toutes par les tokens de `DESIGN.md`.
- Les textes sont en dur et en français. Dans l'app, ils passent par `lib/i18n`.
- Les découpes et angles des rubans sont écrits à la main. Dans l'app, ils sont tirés d'une graine fixe par élément.
- Les zones tactiles de certaines réponses sont plus petites que 44 px. Dans l'app, elles font 44 px minimum.
- Les états d'erreur, les états vides et les versions desktop de tous les écrans ne sont pas tous dessinés : `DESIGN.md` les décrit.
