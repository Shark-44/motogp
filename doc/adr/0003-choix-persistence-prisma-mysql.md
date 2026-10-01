# 0003. Choix de l'ORM (Prisma) et de la base de données (MySQL)

* **Statut** : Accepté
* **Date** : 2026-09-29

## Contexte et Problématique

Le projet vise principalement l'expérimentation et la mise en pratique d'une **Architecture Hexagonale (Ports & Adapters)** poussée en TypeScript/Node.js.

Pour la couche de persistance, il est nécessaire d'associer un moteur de base de données relationnelle et un ORM/Query Builder pour interagir avec celle-ci. L'objectif est d'assurer un compromis optimal entre :
1. La rapidité de prise en main des outils.
2. Le contrôle sur le modèle de données.
3. Le respect du principe d'inversion de dépendance (isolant le domaine métier des détails de persistance).

## Décisions Envisagées

* **Option 1** : PostgreSQL + TypeORM / MikroORM
* **Option 2** : MySQL + Prisma ORM
* **Option 3** : MySQL + SQL Natif / Knex.js

## Décision Retenue

L'**Option 2 (MySQL + Prisma ORM)** a été retenue pour les raisons suivantes :

1. **Maîtrise du SGDB (MySQL)** : L'utilisation de MySQL repose sur un modèle de base de données parfaitement maîtrisé. Cela permet d'éviter l'accumulation de nouvelles découvertes techniques simultanées et de focaliser l'apprentissage sur les concepts d'Architecture Hexagonale.
2. **Découverte de Prisma** : Prisma apporte un typage fort de bout en bout (Type-Safety) généré automatiquement à partir du schéma, une excellente DX (Developer Experience) et une gestion claire des migrations.
3. **Respect de l'Architecture Hexagonale** : 
   * Prisma est uniquement utilisé au niveau d'un **Adaptateur Secondaire (Outbound Adapter)** de persistance.
   * Le domaine métier ne dépend à aucun moment des types générés par Prisma, garantissant un découplage strict par rapport à l'ORM.

## Conséquences

### Positives
* Réduction de la charge mentale en appuyant la persistance sur un SGDB connu (MySQL).
* Amélioration de la productivité grâce au typage automatique et à l'autocomplétion de Prisma Client.
* Maintien d'un domaine propre grâce à l'implémentation de mappers (conversion entre les modèles Prisma et les Entités du Domaine).

### Négatives / Risques
* Nécessité d'écrire des couches de cartographie (*mappers*) pour convertir les objets Prisma en objets du Domaine métier afin d'éviter tout couplage.