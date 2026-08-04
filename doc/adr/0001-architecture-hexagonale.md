# ADR 0001 — Architecture hexagonale pour le backend

## Statut

Accepté — 2026-08-03

## Contexte

Le projet a un double objectif : livrer un site MotoGP fonctionnel (pilotes,
écuries, circuits, classements) et servir de terrain d'étude approfondi sur
l'architecture hexagonale (Ports & Adapters, Alistair Cockburn), dans une
optique de démonstration technique pour une recherche de poste de développeur
junior en CDI.

Le domaine métier réel du projet est de complexité modeste — la majorité des
contextes (Pilotes, Circuits, Calendrier) sont proches du CRUD. Seul le
contexte Championnat/Résultats porte une logique métier suffisamment riche
(règlement de points, gestion des DNF, pénalités, bonus meilleur tour) pour
justifier une séparation stricte des responsabilités.

Alternatives envisagées :

- **Architecture en couches classique** (controller → service → repository,
  sans inversion de dépendance explicite) — plus rapide à mettre en place,
  mais ne permet pas de démontrer la maîtrise de l'inversion de contrôle ni
  de tester le domaine sans mocker le framework.
- **Architecture hexagonale** — retenue, malgré un coût d'entrée plus élevé,
  car elle correspond à l'objectif pédagogique premier du projet.

## Décision

Le backend est structuré en quatre zones : `domain/`, `application/`,
`adapters/` (in et out), `infrastructure/`, avec des ports explicites définis
côté domaine et jamais l'inverse. Voir `docs/backend/architecture.md` pour le
détail complet des couches, la règle de dépendance, et les flux d'exécution
vs de dépendances.

La première story implémentée est un Walking Skeleton (US-000) traversant
toutes les couches sur un cas simple (liste des circuits), avant toute
implémentation de règle métier — afin de valider le câblage architectural en
amont plutôt que de le découvrir en cours de route.

## Conséquences

**Positif**
- Domaine testable sans dépendance à l'infrastructure (base de données,
  framework HTTP)
- Documentation naturelle de chaque frontière technique via les ports
- Base cohérente pour introduire un read model séparé (CQRS léger) sur les
  statistiques, sans réécrire l'existant

**Négatif, assumé**
- Sur-ingénierie pour un site MotoGP de cette taille — un site équivalent
  sans ambition pédagogique n'aurait pas besoin de cette séparation
- Plus de fichiers et d'indirection pour une fonctionnalité simple (voir
  US-000 : 6 fichiers pour lister des circuits)
- Courbe d'apprentissage plus longue en début de projet

## Références

- `docs/backend/architecture.md`
- `docs/user-stories/backlog.md` — US-000, US-RES-02
