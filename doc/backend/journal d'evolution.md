## 📌 Pilotage du Projet & Documentation

Ce projet est mené comme un cas d'école en conditions réelles. L'objectif n'est pas seulement de produire du code, mais de documenter la démarche, les choix d'architecture et l'évolution du backlog.

### 📋 Suivi du Backlog & Organisation
* **Trello du projet** : [Lien vers ton Trello]([URL_DE_TON_TRELLO](https://trello.com/b/bJRz1QfH/motogp-etude-hexagonale))  
  *Le Trello retrace le fil conducteur du projet, l'évolution des User Stories et la réévaluation continue des fonctionnalités au fil des apprentissages.*

### 🏛️ Architecture Decision Records (ADR)
Les décisions techniques structurantes sont formalisées dans le dossier [`doc/adr/`](./doc/adr/) :
* **[ADR-0001](./doc/adr/0001-architecture-hexagonale.md)** : Choix de l'Architecture Hexagonale (Ports & Adapters).
* **[ADR-0002](./doc/adr/0002-modelisation-domaine-motogp.md)** : Modélisation du Domaine Métier MotoGP.
* **[ADR-0003](./doc/adr/0003-choix-persistence-prisma-mysql.md)** : Choix de l'ORM (Prisma) et du SGDB (MySQL).
* **ADR-0004** *(En attente)* : Stratégie de tests et outillage CLI (Vitest & Postman CLI).

---