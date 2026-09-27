# État de reprise

## Lot et étape

- Branche `lot-2`, jamais fusionnée dans `main` sans accord explicite.
- Lot 2a validé et marqué `v2-lot2a` ; lot 2b en cours.
- Tracés et primitives `carnet/` validés ; références landing et `/styleguide` actualisées.
- Références : `docs/SPEC.md` §14, `docs/DESIGN.md`, `docs/VISUAL_TESTS.md` et `docs/mockups/README.md`.

## Décisions du lot 2

- CSS Modules sémantiques ; tokens, reset et base seuls globaux ; aucun nouveau token sans accord.
- Dette : module hérité à 1 573 lignes ; 6 violations Stylelint figées, soit 4 signatures ; ces nombres doivent baisser.
- `/styleguide` public avec `noindex`, absent de `robots.txt` ; références Chromium à 375, 768 et 1440 px sur build de production.
- Playwright : navigateur seul hors bac à sable, un worker, WebKit structurel à 375 px, batterie complète sans arrêt anticipé.
- Auth validée au premier appel ; preview publique sans secrets ; production stricte au build.
- FR/EN typés, aucune concaténation de fragments ; pluriels `Intl.PluralRules` ; typographie et nombres-unités insécables.
- Tracés centralisés, déterministes par identifiant métier ; `DrawOnce` à l’apparition et statique en mouvement réduit ; chargement bouclé séparé.
- `Tally` et autres tracés ont des invariants géométriques testés sur au moins 500 identifiants.
- `PenCircle` : jonction continue, variante libre pour les mots, ronde compacte pour chiffres et jours.
- `MemoryMeter` distingue plein/continu et vide/pointillé, avec libellé accessible ; 16 couleurs documentées par familles.
- Des thèmes affichés ensemble utilisent des familles de couleurs différentes.
- `TapeButton` garde taille et ruban au chargement ; désactivé atténué avec raison, jamais barré ; un seul principal par écran.
- Focus visible à 3:1 ; cases vides/cochées distinctes ; `WeekStrip` cohérent et jours annoncés avec leur état.
- Toute erreur de composant de données propose « Réessayer » comme action secondaire, jamais comme bouton-ruban.
- Landing : hero naturel, annotation desktop sans place réservée, titre `pretty`, rubans `balance` à largeur de texte.
- Landing : « Faux » utilise le cercle libre ; étapes le rond compact ; pointillé arrêté aux bords des cercles.
- Les cercles d’étapes gardent au moins 8 px avec leurs titres à 375, 768 et 1440 px, test structurel à l’appui.
- Limites : ruban de thème 55 caractères validé à la génération avec nouvel essai ; titres sur deux lignes en FR/EN.
- Lot 8 : `/sign-in` explique l’accès privé et lie `/demo` ; la promesse de démo devient un lien ; connexion reste visible.
- Open Graph FR/EN reste au lot 8.
- Budget permanent : captures jamais ouvertes, tests ciblés, deux essais maximum, périmètre strict, compte rendu de 10 lignes.

## En attente et suite

- Aucune validation en attente pour les tracés et primitives ; aucune référence ne change sans nouvelle validation visuelle.
- Prochaine action : commencer `components/cards/` dans une nouvelle conversation, sur instruction d’Alexandre.
