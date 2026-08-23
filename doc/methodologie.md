# Méthodologie

Ce document est le journal de la démarche derrière ce projet — pourquoi ces choix
d'outils et de méthode, pas seulement lesquels.

## Environnement

Formation initiale sous Windows/VS Code, sur la stack React/Node.js. TypeScript
est traité comme une base, pas une option — y compris côté ORM. Reconversion
depuis un métier de technicien automatisme industriel (PLC/SCADA), ce qui
explique une sensibilité particulière pour les architectures en couches
strictes et les flux de données rigoureux : c'est le même réflexe qu'un schéma
de câblage industriel, transposé au code.

## Posture vis-à-vis de l'IA

L'IA (Claude) est utilisée comme un **senior à côté**, pas intégrée dans le code
directement — pas de génération automatique poussée en production sans
compréhension. L'objectif est d'apprendre en confrontant mes choix à un regard
extérieur exigeant, de me faire challenger sur les décisions d'architecture,
tout en gardant la main sur l'écriture et la compréhension du code réel.

Concrètement : l'IA aide à structurer la réflexion (backlog, architecture,
documentation), pointe les pièges classiques avant qu'ils ne coûtent cher
(walking skeleton avant le découpage par couches, par exemple), mais
l'implémentation et les erreurs qui en découlent restent miennes — c'est
volontaire, on apprend de ses erreurs, pas de leur absence.

## Méthode de travail

**Agile / Scrum, en solo — avec ses limites assumées.** Un Scrum en solo n'a pas
de vraies cérémonies d'équipe (pas de rétrospective à plusieurs, pas de mêlée
quotidienne au sens propre). Ce qui est réellement appliqué et démontrable :

- Un backlog priorisé, découpé en epics et user stories (format Gherkin)
- Un board à jour (Trello ou Jira) suivant l'avancement par sprint
- Une Definition of Ready / Definition of Done explicite (voir
  `docs/backend/architecture.md`)

L'usage de Jira/Trello est un choix délibéré : ce sont les outils Atlassian
standards en entreprise, et les pratiquer sur un vrai projet — même solo — vaut
mieux que d'en parler seulement en entretien.

## Diagrammes UML

Les diagrammes servent la compréhension, pas la conformité formelle à la norme
UML. Trois types de diagrammes priorisés à ce stade :

- **Diagrammes de cas d'usage** (un par acteur : Visiteur, Admin) — modélisés
  en amont du diagramme de classes, pour faire émerger le besoin fonctionnel
  et les user stories associées avant de figer la structure
- **Diagramme de classes** du domaine — entités, services et classes
  d'association, pour donner à voir la modélisation métier
- **Diagramme de séquence** du Walking Skeleton (à venir) — pour montrer le
  flux d'une requête à travers les couches hexagonales

Ces diagrammes sont conçus sur Lucidchart puis exportés en PNG dans
`docs/adr/assets/`, référencés depuis les ADR correspondants. Choix assumé :
un outil de diagramme dédié offre plus de liberté de notation (agrégation vs
composition, `<<extend>>`) que le rendu Mermaid natif de GitHub, ce qui compte
davantage ici que d'avoir des diagrammes versionnés en texte.

D'autres diagrammes (composants, déploiement) seront ajoutés si un besoin réel
de communication se présente, plutôt que par exhaustivité formelle.

## Pourquoi documenter autant pour un projet solo

Parce que le code seul ne montre que le résultat, pas le raisonnement. Un dépôt
avec un historique de documentation cohérent — ADR datés, backlog qui évolue,
journal des choix — se lit comme une démonstration de méthode de travail, ce
qu'aucun extrait de code isolé ne peut prouver.

## Mon trello

https://trello.com/invite/b/6a70fe862e299d53f2c26340/ATTI5360576bb7016ae1ee7118735e2b3c0eF0ACAFFF/motogp-etude-hexagonale