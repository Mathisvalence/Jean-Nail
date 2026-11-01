# Méthode de travail

## Branches

- `main` est toujours déployable : on n'y pousse jamais directement, tout passe par une pull request.
- Une branche par sujet, créée depuis `main` à jour, nommée `type/description-courte` :
  `feat/page-collection`, `fix/echelle-mobile`, `chore/maj-dependances`.
- Une branche vit peu de temps : on la fusionne puis on la supprime.

## Commits

Format [Conventional Commits](https://www.conventionalcommits.org/fr/), vérifié par un hook local et par la CI :

```
type(portée facultative): description à l'impératif, en minuscules
```

| Type       | Usage                                                  |
| ---------- | ------------------------------------------------------ |
| `feat`     | nouvelle fonctionnalité visible                        |
| `fix`      | correction de bug                                      |
| `refactor` | réorganisation du code sans changement de comportement |
| `style`    | formatage uniquement                                   |
| `test`     | ajout ou correction de tests                           |
| `docs`     | documentation                                          |
| `chore`    | outillage, dépendances, configuration                  |
| `ci`       | intégration continue                                   |
| `perf`     | performance                                            |

Exemples : `feat(web): ajouter le défilement horizontal des œuvres`, `fix(studio): corriger la validation du prix`.

Un commit = un changement cohérent qui compile et passe les tests.

## Pull requests

1. `npm run check` passe en local.
2. La PR suit le modèle (pourquoi, ce qui change, comment vérifier).
3. La CI est verte : messages de commit, formatage, lint, typage, types Sanity à jour, tests, builds.
4. L'aperçu Netlify de la PR est relu sur desktop et sur mobile.
5. Fusion en **squash and merge**, avec un titre de PR au format Conventional Commits.

## Contenu et schéma Sanity

- Le schéma vit dans `studio/schemaTypes/` ; toute modification passe par une PR.
- Après un changement de schéma ou de requête GROQ : `npm run typegen`, puis committer `web/sanity.types.ts`.
- Un champ n'est jamais supprimé directement s'il contient des données : on le déprécie, on migre, puis on le retire.

## Secrets

Aucun jeton dans le dépôt. Les variables locales vont dans `web/.env.local` (ignoré par git) ; celles de production dans Netlify.
