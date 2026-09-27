# Tests visuels

Les références Playwright sont créées sur le Mac d'Alexandre avec le Chromium embarqué par la version exacte de Playwright inscrite dans `package.json`. Elles ne sont pas portables entre systèmes d'exploitation. Une future migration vers Docker exigera une validation complète de nouvelles références Linux.

Le serveur Playwright exécute toujours `npm run build`, puis `npm run start`. Les références ne sont jamais produites avec `next dev`.

Dans un environnement agent isolé, seuls les processus navigateur Playwright sont lancés hors du bac à sable. Le build et le serveur de production restent dans le bac à sable ; Playwright les réutilise avec `PLAYWRIGHT_EXTERNAL_SERVER=1`. Chromium est celui embarqué par Playwright, jamais l'application Google Chrome installée. Pour un contrôle intermédiaire, `PLAYWRIGHT_MAX_FAILURES=1` arrête une cascade si le navigateur ne démarre pas. La batterie finale omet cette variable et exécute donc tous les tests, même après un échec.

## Vérifier

```bash
npm run test:visual
```

En cas d'écart, consulter l'image attendue, l'image obtenue et le diff dans `test-results/`. Un échec ne justifie pas à lui seul une mise à jour de la référence.

## Mettre à jour volontairement

1. Montrer l'avant/après à Alexandre et obtenir sa validation visuelle explicite.
2. Sur son Mac, avec le dépôt propre hors changement attendu, lancer :

```bash
npm run test:visual:update
```

3. Examiner chaque PNG modifié dans `tests/e2e/__snapshots__/darwin/`.
4. Relancer `npm run test:visual` sans l'option de mise à jour.
5. Placer les PNG validés dans un commit dédié dont le message explique le changement visuel.

Les contrôles WebKit à 375 px sont structurels et ne possèdent aucune référence d'image.
