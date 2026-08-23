# Backlog — User Stories

## Méthode

Chaque story suit le format INVEST (Indépendante, Négociable, apporte de la
Valeur, Estimable, Small, Testable) et est rédigée avec ses critères
d'acceptation en Gherkin.

**Découpage** : en tranches verticales (chaque story traverse potentiellement
toutes les couches hexagonales concernées), jamais en tranches horizontales
par couche technique. Voir `docs/backend/architecture.md` pour le détail des
couches, et `docs/adr/0002-modelisation-domaine-motogp.md` pour la
justification des choix de modélisation (Entité/Service/Use Case,
association/agrégation/composition).

**Deux acteurs distincts** (voir diagrammes de cas d'usage) :
- **Visiteur** : lecture seule (calendrier, circuits, équipes, pilotes, classements)
- **Admin** : écriture (planifier un GP, signer un contrat, saisir un résultat,
  déclencher le recalcul du classement). Authentification/sécurité admin
  volontairement non modélisée — hors scope de cette étude d'architecture.

### Definition of Ready

- Story formulée en Gherkin, comprise sans ambiguïté
- Bounded context identifié (Pilotes / Équipes & Contrats / Circuits / Calendrier / Championnat)
- Couche(s) impactée(s) précisée(s) (domain / application / adapter in / adapter out)

### Definition of Done

- Tests unitaires du domaine passent sans aucun mock d'infrastructure
- Le port utilisé est défini en interface avant son implémentation
- Si la story introduit une décision structurante → un ADR est rédigé
- Code review + article de blog si la story illustre un principe intéressant

## Backlog par epic

### Epic 0 — Socle (Walking Skeleton)

| ID | En tant que | Je veux | Afin de | Couches touchées |
|---|---|---|---|---|
| US-000 | dev | un endpoint qui traverse domain→application→adapter in/out sur un cas réel (liste des circuits) | valider le câblage hexagonal avant toute vraie feature | Toutes |

### Epic A — Pilotes

| ID | En tant que | Je veux | Afin de | Couches touchées |
|---|---|---|---|---|
| US-PIL-01 | visiteur | lister les pilotes de la saison | parcourir le plateau | domain (entité Pilote), adapter out (repo lecture) |
| US-PIL-02 | visiteur | consulter la fiche d'un pilote | voir ses infos détaillées | idem |
| US-PIL-03 | visiteur | voir l'historique des écuries d'un pilote | comprendre son parcours | domain (entité **Contrat**, classe d'association en composition avec Pilote/Equipe — pas un simple VO, elle porte une identité et un cycle de vie propre) ; règle de non-chevauchement de deux contrats actifs à encoder |
| US-PIL-04 (V2) | admin | ajouter/éditer un pilote | maintenir les données à jour | adapter in (formulaire protégé) |

> Correction v2 : `US-PIL-03` référençait initialement un "VO PeriodeContrat".
> L'étude de modélisation (voir ADR) a établi que `Contrat` doit être une
> **Entité** (composition entre `Equipe` et `Pilote`, porte `saison` et
> `role` officiel/remplaçant/wildcard) plutôt qu'un Value Object, car il a
> besoin d'une identité propre et d'être référencé directement par
> `ResultatSession` pour éviter de réécrire l'historique en cas de transfert
> de pilote en cours de saison.

### Epic B — Circuits

| ID | En tant que | Je veux | Afin de | Couches touchées |
|---|---|---|---|---|
| US-CIR-01 | visiteur | lister les circuits de la saison | découvrir le calendrier | domain simple |
| US-CIR-02 | visiteur | voir les caractéristiques d'un circuit | comparer les tracés | idem |

### Epic C — Calendrier

| ID | En tant que | Je veux | Afin de | Couches touchées |
|---|---|---|---|---|
| US-CAL-01 | visiteur | consulter le calendrier des GP | savoir quand a lieu chaque course | domain (VO StatutGP) |
| US-CAL-02 | visiteur | voir le statut d'un GP (à venir/en cours/terminé) | suivre la saison en direct | logique de transition d'état |
| US-CAL-03 | admin | associer un circuit existant à une date de la saison | planifier une manche du championnat | adapter in (formulaire protégé), domain (agrégation GrandPrix ◇— Circuit) |

### Epic D — Championnat & Résultats (cœur métier)

| ID | En tant que | Je veux | Afin de | Couches touchées |
|---|---|---|---|---|
| US-RES-01 | admin | saisir les résultats d'une session | enregistrer les données officielles | adapter in (formulaire protégé), domain (entité ResultatSession, référence le Contrat actif — pas Pilote/Equipe séparément) |
| US-RES-02 | système | calculer automatiquement les points d'un pilote après une course | appliquer le règlement MotoGP sans erreur humaine | domain service ReglementPointsMotoGP (pur, sans repository) |
| US-RES-03 | visiteur | consulter le classement pilotes après chaque GP | suivre la saison | application (use case, lit la projection ClassementPilote) |
| US-RES-04 | visiteur | consulter le classement constructeurs | suivre la compétition écuries | idem, agrégation différente (ClassementEquipe, exclut les wildcards) |
| US-RES-05 | système | gérer les cas particuliers (DNF, pénalité, meilleur tour) | garantir un classement fiable | domain — traitement simplifié, voir note ci-dessous |
| US-RES-06 | admin | déclencher manuellement le recalcul du classement pilotes/équipes après un GP | mettre à jour les projections affichées aux visiteurs | application (use cases CalculerClassementPilote / CalculerClassementEquipe) — pas de trigger automatique |

> Simplifications assumées (cf. ADR) : la règle d'exclusion des wildcards du
> classement équipe et le traitement des DNF (tri par tour d'abandon avant
> attribution de position) sont des hypothèses de travail non détaillées
> exhaustivement — l'objectif de l'exercice est la structure architecturale,
> pas la conformité à 100 % au règlement FIM réel.

### Epic E — Équipes & Contrats

| ID | En tant que | Je veux | Afin de | Couches touchées |
|---|---|---|---|---|
| US-EQU-01 | visiteur | lister les équipes de la saison | découvrir le plateau | domain (entité Equipe), adapter out (repo lecture) |
| US-EQU-02 | visiteur | consulter la fiche d'une équipe (pilotes sous contrat, classement) | suivre son évolution | domain (Equipe, Contrat), application (read model ClassementEquipe) |
| US-CTR-01 | admin | signer un contrat entre un pilote et une équipe pour une saison (rôle officiel/remplaçant/wildcard) | garantir que les résultats se rattachent à la bonne équipe au bon moment | adapter in (formulaire protégé), domain (Contrat) |

### Epic F — Dashboard & Statistiques (shadcn)

| ID | En tant que | Je veux | Afin de | Couches touchées |
|---|---|---|---|---|
| US-STAT-01 | visiteur | visualiser l'évolution du classement d'un pilote sur la saison | comprendre sa dynamique | read model dédié (port out séparé) |
| US-STAT-02 | visiteur | comparer deux pilotes sur plusieurs critères | analyser leurs perfs | idem |
| US-STAT-03 | visiteur | visualiser la répartition des points par circuit | identifier les forces/faiblesses | idem |

> Note d'architecture : les stories `US-STAT-*` ne réutilisent pas les use cases
> d'écriture. Elles s'appuient sur un port out dédié à la lecture agrégée
> (`StatistiquesPiloteQueryPort`), distinct du repository d'écriture — embryon
> de CQRS léger. La classe `ClassementPilote`/`ClassementEquipe` (voir ADR
> domaine) alimente directement ce read model : c'est une projection datée
> par round, exactement ce que `US-STAT-01` a besoin d'afficher en line chart.

## Exemple détaillé — US-RES-02

```gherkin
US-RES-02
En tant que système
Je veux calculer automatiquement les points d'un pilote après une course
Afin d'appliquer le règlement MotoGP sans intervention manuelle

  Scénario : Attribution des points selon la position d'arrivée
    Étant donné un Grand Prix au statut "terminé"
    Et les résultats de la session "course" saisis pour chaque pilote
    Quand le classement est recalculé
    Alors chaque pilote classé reçoit les points de sa position
      (25/20/16/13/11/10/9/8/7/6/5/4/3/2/1)

  Scénario : Pilote non classé
    Étant donné un pilote avec le statut "DNF" sur la session course
    Quand le classement est recalculé
    Alors ce pilote reçoit 0 point

  Scénario : Bonus meilleur tour
    Étant donné le pilote ayant réalisé le meilleur tour en course
    Et ce pilote est classé dans le top 10
    Quand le classement est recalculé
    Alors ce pilote reçoit 1 point supplémentaire
```

## Exemple détaillé — US-RES-04 (nouveau, exclusion wildcard)

```gherkin
US-RES-04
En tant que visiteur
Je veux consulter le classement constructeurs
Afin de suivre la compétition écuries

  Scénario : Un wildcard ne marque pas de points pour son équipe
    Étant donné un ResultatSession dont le Contrat a le rôle "wildcard"
    Et ce résultat a rapporté des points au pilote
    Quand le classement équipe est recalculé
    Alors ces points ne sont PAS comptabilisés dans ClassementEquipe
    Mais ils restent comptabilisés dans ClassementPilote
```

## Exemple détaillé — US-000 (Walking Skeleton)

```gherkin
US-000
En tant que développeur
Je veux que GET /api/circuits traverse réellement
  adapter in → port in → use case → port out → adapter out → MySQL
Afin de valider que le câblage hexagonal fonctionne avant d'écrire
  la moindre règle métier

  Scénario : Le squelette répond avec des données réelles
    Étant donné une base de données contenant au moins un circuit
    Quand j'appelle GET /api/circuits
    Alors je reçois un code 200
    Et le corps de la réponse contient la liste des circuits

  Scénario : Le use case est testable sans base de données
    Étant donné un repository factice respectant CircuitRepositoryPort
    Quand j'exécute ListerCircuitsUseCase
    Alors le résultat correspond aux données du repository factice
    Et aucune connexion base de données n'a été nécessaire
```
