# ADR 0002 — Modélisation du domaine MotoGP (diagramme de classes UML)

## Statut

Accepté — 2026-08-22

## Contexte

Ce projet MotoGP a un double objectif : produire un site fonctionnel et servir de démonstrateur d'architecture hexagonale (ports & adapters) pour ma recherche de poste. Dans cette optique, le diagramme de classes UML n'est pas un artefact décoratif produit après coup pour documenter du code déjà écrit — il est utilisé en amont pour **dicter la structure du code**, en particulier la répartition entre les couches `domain/entities`, `domain/services` et `application/use-cases`.

Le diagramme a été construit itérativement, en clarifiant à chaque étape deux questions :
1. **Quelle est la nature de chaque classe ?** (Entité, Service de domaine, ou Use Case)
2. **Quelle est la nature de chaque lien ?** (association simple, agrégation, ou composition)

## Objectif du diagramme

### Test de classification des classes

| Type | Critère de décision | Conséquence architecturale |
|---|---|---|
| **Entité** | Possède une identité (`id`) et un état qui persiste et qu'on interroge dans la durée | Vit dans `domain/entities` |
| **Service de domaine** | Calcul pur : mêmes entrées → mêmes sorties, aucun effet de bord, aucune dépendance à un repository | Vit dans `domain/services` |
| **Use Case** | Orchestre une opération complète : lit via un repository (I/O), appelle un ou plusieurs Services, produit un effet observable (écriture, notification) | Vit dans `application/use-cases` |

### Test de classification des liaisons

| Type | Critère de décision |
|---|---|
| **Association simple** | Les deux objets se connaissent, aucun ne dépend du cycle de vie de l'autre |
| **Agrégation** (losange vide) | La partie **survit** à la suppression du tout et peut être **réutilisée** par un autre tout |
| **Composition** (losange plein) | La partie n'a de sens **que pour ce tout précis**, jamais réutilisée, disparaît avec lui |

## Décision

### Mapping classes → couches

- **`domain/entities`** : `Circuit`, `GrandPrix`, `Equipe`, `Pilote`, `Contrat`, `ResultatSession`, `ClassementPilote`, `ClassementEquipe`
- **`domain/services`** : `ReglementPointMotoGP` (calcul pur des points selon le barème Sprint/Course, sans dépendance à un repository)
- **`application/use-cases`** (implicites dans le diagramme, à écrire lors de l'implémentation) : `CloturerCourse`, `CalculerClassementPilote`, `CalculerClassementEquipe`, `SignerContrat`

### Relations structurantes

- `GrandPrix ◇— Circuit` : **agrégation**. Un circuit est réutilisé d'année en année par plusieurs Grands Prix ; il survit à la suppression d'un GP.
- `GrandPrix ◆— ResultatSession` : **composition**. Un résultat de session n'a de sens que pour ce GP précis, jamais réutilisé.
- `Equipe ◆— Contrat` et `Pilote ◆— Contrat` : **composition double**. Un contrat n'existe que pour cette paire pilote/équipe précise ; c'est une classe d'association qui porte `saison` et `role` (officiel/remplaçant/wildcard), des attributs qui n'appartiennent à aucune des deux classes seules.
- `Contrat → ResultatSession` : **association simple**, et point pivot du modèle. Un résultat de session référence le `Contrat` actif au moment de la course (pas `Pilote` et `Equipe` séparément), ce qui garantit que l'historique reste cohérent même si le pilote change d'équipe la saison suivante — sans ce détour, un transfert de pilote en cours de saison réécrirait rétroactivement l'équipe associée aux anciens résultats.
- `GrandPrix/Pilote/Equipe → ClassementPilote/ClassementEquipe` : associations simples. Ces classes sont des **projections** datées par round, recalculées par un Use Case déclenché manuellement par un admin — jamais la source de vérité, jamais modifiées directement.
- `ReglementPointMotoGP ⇢ ResultatSession` : **dépendance** (pointillés), pas une association permanente — le service lit des résultats au moment du calcul, sans les référencer durablement.

## Simplifications assumées (scope de l'exercice)

Ce modèle privilégie la clarté de la structure architecturale sur l'exhaustivité du règlement sportif réel. Les points suivants sont des hypothèses de travail, volontairement non détaillées à ce stade :

- **Règle wildcard** : un wildcard marque des points individuels mais pas de points pour le classement équipe. Encodée comme cas particulier dans `ReglementPointMotoGP` / le Use Case de calcul équipe, sans validation exhaustive du règlement FIM réel.
- **Cas DNF (abandon)** : `ResultatSession` gagnera un attribut `statutArrivee` (enum) pour distinguer arrivée normale et abandon. Le calcul précis de la position en cas d'abandon (tri par tour d'abandon) n'est pas détaillé.
- **`ClassementEquipe`** : modélisé dans le diagramme pour la cohérence structurelle, mais son implémentation est différée après le MVP `ClassementPilote`.
- **`Contrat.saison`** : simple `Number`, pas une classe `Saison` à part entière. À faire évoluer si un besoin (dates précises de saison, nombre de manches) apparaît.
- **Règle de non-chevauchement des contrats** (un pilote ne peut pas avoir deux contrats actifs simultanément) : identifiée comme nécessaire mais pas encore encodée dans le modèle.
- **Acteurs/authentification** : non modélisés dans le domaine. Les mentions d'un "admin" dans les user stories relèvent probablement d'une couche adapter/auth, hors du domaine métier pur.

## Conséquences

**Ce que ça facilite :**
- Le domaine ne dépend d'aucun détail d'infrastructure (pas de clé étrangère brute dans les entités) — le domaine reste testable unitairement sans mock d'infra, conformément à l'exigence du Walking Skeleton (`US-000`).
- Le changement d'équipe d'un pilote en cours de saison n'invalide jamais l'historique des résultats passés, grâce au pivot `Contrat`.
- Les classements (pilote/équipe) peuvent évoluer en logique de calcul (nouvelles règles, nouveaux filtres) sans toucher à `ResultatSession`, qui reste la source de vérité immuable.
- Les raffinements identifiés (DNF, non-chevauchement des contrats) s'ajoutent à l'intérieur de la structure existante, sans redesign.

**Ce que ça coûte :**
- Une étape de recalcul explicite est nécessaire pour les classements (pas de "toujours à jour" automatique) — assumé, car déclenché par un admin selon les user stories.
- Le modèle ne couvre pas 100 % du règlement FIM réel ; certains cas limites (DNF, disqualification, pénalités) devront être précisés lors de l'implémentation.

## Références

- `docs/adr/assets/domaine-classes.png` — diagramme de classes final
- `docs/adr/assets/cas-usage-visiteur.png`, `cas-usage-admin.png` — diagrammes de cas d'usage en amont
- `docs/adr/note-uml-classification.md` — détail des deux tests de classification
- `docs/user-stories/backlog.md` — US-EQU-01/02, US-CTR-01, US-CAL-03, US-RES-06
