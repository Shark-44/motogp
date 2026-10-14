# MotoGP — étude d'architecture hexagonale

Un site MotoGP (pilotes, écuries, circuits, classements) construit avec un double
objectif assumé :

1. **Fonctionnel** — un site fan-friendly pour suivre pilotes, écuries, circuits et
   classement du championnat.
2. **Pédagogique** — un terrain d'étude documenté et approfondi sur l'**architecture
   hexagonale** (Ports & Adapters) appliquée à un backend Node.js/TypeScript.

Le second objectif prime sur le premier dans les choix techniques. Certaines
décisions (séparation stricte des couches, ports explicites, read models dédiés
aux statistiques) relèvent d'une sur-ingénierie assumée pour un site de cette
taille — c'est un choix pédagogique documenté, pas une recommandation universelle.
Voir [`docs/methodologie.md`](./docs/methodologie.md) pour le détail de cette posture.

> **Projet d'étude, non livrable.** Il sert à démontrer ce que j'ai appris et
> intégré, sous forme d'échantillons représentatifs. Ce qui est couvert, partiel
> ou reporté est indiqué ci-dessous, sans l'enjoliver.

## État d'avancement

*Mis à jour le 14/10/2026.*

| | Contenu |
|---|---|
| **Fait** | Domaine métier modélisé (diagrammes UML, ADR), backlog en user stories Gherkin, structure hexagonale en place |
| | Backend : use cases de classement (pilotes et équipes : lecture, calcul avec départage), module d'authentification par jeton |
| | Tests unitaires (Vitest) sur les use cases et sur chaque couche du module `auth` |
| **En cours** | Pose du middleware admin sur les routes de commande · mise à jour de la collection Postman · front (React) |
| **Partiel** | Tests d'intégration : échantillon dans une collection Postman, volontairement incomplet |
| **Reporté** | Section statistiques (read models) · limite de tentatives sur la connexion · CI et déploiement · régénération des données de test (positions incohérentes sur certains Grands Prix) |

Le [journal d'évolution](./docs/backend/architecture.md#journal-dévolution) garde
le suivi daté des décisions.

## Stack

- **Frontend** : React + TypeScript, Vite, shadcn/ui pour les graphiques et
  tableaux de statistiques *(en cours)*
- **Backend** : Node.js + TypeScript, architecture hexagonale
- **Persistance** : MySQL, via Prisma (choix documenté dans `docs/adr/`)
- **Tests** : Vitest (unitaires), Postman (intégration, échantillon)
- **Monorepo** : npm workspaces

## Démarrage rapide

```bash
npm install
cp backend/.env.example backend/.env   # puis renseigner les valeurs (jamais commité)
# commande de lancement du backend : à compléter
```

Variables d'environnement du module d'authentification : `ADMIN_PASSWORD`,
`JWT_SECRET` (32 caractères minimum), `JWT_DUREE_SECONDES` (optionnelle).

## Tests

```bash
npx vitest run          # toute la suite
npx vitest run auth     # le module d'authentification seul
```

## Structure du dépôt

```
motogp-hexagonal/
├── docs/
│   ├── backend/
│   │   ├── architecture.md          # détail des couches hexagonales
│   │   └── feature_auth.md          # module d'authentification (choix, flux JWT, limites)
│   ├── frontend/architecture.md     # organisation React (à venir)
│   ├── adr/                         # décisions d'architecture documentées
│   │   ├── ADR-modelisation-domaine-motogp.md
│   │   ├── note-uml-classification.md   # méthode de classification (Entité/
│   │   │                                # Service/Use Case, association/
│   │   │                                # agrégation/composition)
│   │   └── assets/
│   │       ├── domaine-classes.png      # diagramme de classes final
│   │       ├── cas-usage-visiteur.png   # diagramme de cas d'usage — Visiteur
│   │       └── cas-usage-admin.png      # diagramme de cas d'usage — Admin
│   ├── user-stories/backlog.md      # backlog complet (epics, stories, Gherkin)
│   └── methodologie.md              # posture de travail, outils, usage de l'IA
├── backend/
├── frontend/
└── package.json
```

## Documentation

- [Architecture backend](./docs/backend/architecture.md) — structure hexagonale,
  règle de dépendance, ce qui est décidé et ce qui ne l'est pas encore
- [Module d'authentification](./docs/backend/feature_auth.md) — séparation
  lecture publique / gestion admin, flux du jeton, choix de sécurité, limites
  assumées, évolution prévue
- [Backlog / user stories](./docs/user-stories/backlog.md) — epics et stories au
  format Gherkin, annotées par couche architecturale
- [ADR](./docs/adr/) — journal des décisions structurantes, avec les diagrammes
  UML et la note de méthode qui les accompagnent (`assets/`,
  `note-uml-classification.md`)
- [Méthodologie](./docs/methodologie.md) — environnement de travail, méthode
  Agile, outils, posture vis-à-vis de l'IA

## Ordre de lecture recommandé (modélisation du domaine)

1. `docs/adr/assets/cas-usage-visiteur.png` et `cas-usage-admin.png` — le besoin
   fonctionnel, par acteur
2. `docs/adr/assets/domaine-classes.png` — la structure qui répond à ce besoin
3. `docs/adr/ADR-modelisation-domaine-motogp.md` — pourquoi chaque décision
   structurante a été prise
4. `docs/adr/note-uml-classification.md` — les deux tests de classification
   utilisés pour trancher (Entité/Service/Use Case, association/agrégation/
   composition), réutilisables sur n'importe quel autre bloc du domaine
5. `docs/user-stories/backlog.md` — la traduction en stories développables

## Suivi de projet

<!-- Lien d'invitation Trello retiré : un lien /invite/ permet en général à toute
     personne qui le possède de rejoindre le board. Le remplacer par un board
     public en lecture seule, ou par une capture d'écran du tableau. -->

## Auteur

Joanny — développeur en reconversion (ex-technicien automatisme industriel
PLC/SCADA). Blog technique : [shark-44.github.io/blog-jarvis](https://shark-44.github.io/blog-jarvis)
