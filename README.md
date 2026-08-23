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

## Stack

- **Frontend** : React + TypeScript, Vite, shadcn/ui pour les graphiques et
  tableaux de statistiques
- **Backend** : Node.js + TypeScript, architecture hexagonale
- **Persistance** : MySQL, via ORM (choix documenté dans `docs/adr/`)
- **Monorepo** : npm workspaces

## Structure du dépôt

```
motogp-hexagonal/
├── docs/
│   ├── backend/architecture.md      # détail des couches hexagonales
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

## État d'avancement

Le projet est actuellement en phase de cadrage : domaine métier modélisé,
backlog rédigé, structure de dossiers posée. Le code n'a pas encore démarré —
voir le [journal d'évolution](./docs/backend/architecture.md#journal-dévolution)
pour le suivi daté des décisions.

## Auteur

Joanny — développeur en reconversion (ex-technicien automatisme industriel
PLC/SCADA). Blog technique : [shark-44.github.io/blog-jarvis](https://shark-44.github.io/blog-jarvis)
