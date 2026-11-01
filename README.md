# Jean Nail — site vitrine

Portfolio en ligne du peintre Jean Nail : les œuvres, classées par collection, présentées comme sur un mur de galerie.

- **Site** : Next.js (dossier [`web/`](web)), hébergé sur Netlify
- **Contenu** : Sanity Studio en français (dossier [`studio/`](studio)), projet `sjigsrm6`, dataset `production`
- **Maquettes** : Figma « Jean nail portfolio »

## Démarrer

Prérequis : Node.js 22 (voir `.nvmrc`).

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

Les règles de travail (branches, commits, PR) sont dans [CONTRIBUTING.md](CONTRIBUTING.md).
