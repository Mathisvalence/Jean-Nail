# Jean Nail — site vitrine

Portfolio en ligne du peintre Jean Nail : les œuvres, classées par collection, présentées comme sur un mur de galerie.

- **Site** : Next.js (dossier [`web/`](web)), hébergé sur Netlify
- **Contenu** : Sanity Studio en français (dossier [`studio/`](studio)), projet `sjigsrm6`, dataset `production`
- **Maquettes** : Figma « Jean nail portfolio »

## Démarrer

Prérequis : Node.js 22 (voir `.nvmrc`) et npm 11 (`npm install --global npm@11` ; version exacte dans le champ `packageManager` de `package.json`). Une autre version de npm réécrit `package-lock.json`.

```bash
npm install                       # installe le site et le Studio, active les hooks git
cp web/.env.example web/.env.local
npm run dev                       # site sur http://localhost:3000
npm run dev:studio                # Studio sur http://localhost:3333
```

## Commandes utiles

| Commande          | Rôle                                                                       |
| ----------------- | -------------------------------------------------------------------------- |
| `npm run check`   | Formatage, lint, typage et tests : à lancer avant une PR                   |
| `npm run format`  | Reformate tout le code avec Prettier                                       |
| `npm run typegen` | Régénère `web/sanity.types.ts` après un changement de schéma ou de requête |
| `npm run build`   | Build du site et du Studio                                                 |

## Organisation

```
.
├── web/        Site Next.js (App Router, TypeScript, CSS Modules)
│   └── src/
│       ├── app/      Pages et mise en page
│       ├── lib/      Logique pure, testée (ex. échelle des œuvres)
│       └── sanity/   Client, requêtes et images Sanity
└── studio/     Sanity Studio
    └── schemaTypes/  Modèle de contenu : collection, œuvre, à propos
```

## Importer les œuvres

Le script `studio/scripts/import/` crée les 7 collections et les 79 œuvres à partir du dossier de photos et du CSV. Il se lance depuis un poste qui a les photos (le Mac) :

```bash
cd studio
npx sanity login                                                  # une seule fois
DRY_RUN=1 PHOTOS_DIR="/chemin/vers/photo oeuvres" npm run import:artworks   # essai, sans rien envoyer
PHOTOS_DIR="/chemin/vers/photo oeuvres" npm run import:artworks             # import réel
```

Relancer le script ne crée pas de doublons et ne touche pas aux œuvres déjà modifiées dans le Studio (sauf avec `FORCE=1`). Les titres, prix et descriptions importés sont fictifs, à remplacer avant la mise en ligne.

Les règles de travail (branches, commits, PR) sont dans [CONTRIBUTING.md](CONTRIBUTING.md).

## Mettre le Studio en ligne

Le Studio est publié par Sanity à l'adresse https://jean-nail.sanity.studio (réglage `studioHost` dans `studio/sanity.cli.ts`). Il se publie depuis le Mac, après chaque changement de schéma fusionné dans `main` :

```bash
git switch main && git pull
cd studio
npm run deploy
```

Au premier déploiement, la commande affiche un `appId` : l'ajouter dans `deployment` de `studio/sanity.cli.ts` (par une PR) pour que les suivants ne posent plus de question. Pour que Jean puisse se connecter, l'inviter dans [sanity.io/manage](https://www.sanity.io/manage) → projet Jean Nail → Members, avec le rôle Editor.

## Mise à jour automatique du site

Quand Jean publie une modification dans le Studio, Sanity appelle `/api/revalidate` et le site se met à jour à la visite suivante, sans redéploiement. Réglage à faire une fois :

1. Générer un secret : `openssl rand -hex 32`.
2. Netlify → Project configuration → Environment variables : ajouter `SANITY_REVALIDATE_SECRET` avec ce secret, puis redéployer.
3. [sanity.io/manage](https://www.sanity.io/manage) → projet Jean Nail → API → Webhooks → Create webhook :
   - URL : `https://<domaine du site>/api/revalidate`
   - Dataset : `production`
   - Trigger on : Create, Update, Delete
   - Filter : `_type in ["artwork", "collection", "about"]`
   - HTTP method : POST, API version : la plus récente
   - Secret : le même secret
4. Vérifier : modifier un titre dans le Studio, publier, recharger la page deux fois.
