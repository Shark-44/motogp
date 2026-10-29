# État des lieux : étude hexagonale, frontend

> Carnet d'évolution personnel. On y **ajoute** des entrées datées ; on ne réécrit pas l'histoire.
> Une ligne résolue se **barre** (`~~texte~~`) avec sa date de clôture, elle ne se supprime pas.
> Dernière mise à jour : 29/10/2026.
> Source des dates : `git log --date=short --pretty=format:"%ad  %s" --reverse -- frontend`

## Posé (acquis, daté)

| Date | Étape | Ce qui a été posé |
| --- | --- | --- |
| 20/10/2026 | Préparation du front, base du front | Workspace npm `frontend`, Vite + React + TypeScript, scripts de la racine (`dev`, `lint`, `fix`), proxy de développement vers l'API |
| 21/10/2026 | Homepage | Structure `app/` + `modules/<entité>/{domain,application,infrastructure,ui}` ; page d'accueil en grille de boutons ; `Layout` en bannière avec bouton Accueil |
| 22/10/2026 | `feature_circuit` | Première tranche complète en lecture : modèle, port, cas d'usage, adaptateur HTTP, hook, page ; composition root (`app/composition.ts`) ; cas d'usage passés aux pages en props ; proxy du préfixe `/uploads` pour les photos ; noms de fichiers d'images sans écart Unicode |
| 22/10/2026 | Doc d'architecture | `architecture-frontend.md` : principe, couches, règles d'import, recette pour ajouter un module, décisions D1 à D9 |
| 25/10/2026 | `feature-pilotes` | Module des pilotes en lecture ; drapeau du pays à côté du nom (composant réutilisable envisagé) |
| 25/10/2026 | `feature_teams` | Module des équipes en lecture |
| 27/10/2026 | `feature_raceEvent` (1re solution) | Slider des événements, boutons précédent/suivant, prochain événement centré, passés ternes ; règle du prochain événement dans `application/` |
| 29/10/2026 | `feature_raceEvent` (statut de la base) | Prise en compte du `statut` de la base ; décision D10 ; doc `feature_raceEvent.md` avec captures |

### Question posée par chaque branche

- **circuits** : comment une donnée traverse les couches sans que la page connaisse `fetch` ?
  → un port dans le domaine, un adaptateur dans l'infrastructure, assemblage dans `composition.ts`, cas d'usage reçu en prop.
- **raceEvent** : comment dire « prochain événement » sans dupliquer le métier ?
  → règle d'usage dans `application/`, `ANNULE` lu depuis la base ; choix entre la date et le statut tracé dans D10.
- **pilotes, équipes** : la structure se reproduit-elle en suivant la recette sans rouvrir le code de `circuits` ?
  → *à compléter*, avec ce qui manquait dans la recette.

## En cours

- **Classements** : deux pages séparées, pilotes et équipes, qui consomment des projections calculées par le backend.
  Intention du visiteur : voir comment les pilotes progressent ou reculent au fil de la saison.
  Première tranche prévue : tableau d'un round, puis vue générale.

## À aborder (ouvert, sans échéance)

- Pages de détail de chaque entité (`getById` dans le port, route `/xxx/:id`).
- Imports entre modules : règle à trancher à l'occasion des classements.
- Règles d'import vérifiées par ESLint (`no-restricted-imports`).
- Graphique de positions des 10 premiers (axe inversé, aucune interaction en version 1) ; grille de départ avec les têtes des pilotes ; places gagnées ou perdues.
- Cache en mémoire des lectures : ADR « aucun cache pour l'instant », à rouvrir si une interaction déclenche plusieurs GET identiques ou lents.
- Premiers tests (la règle du prochain événement s'y prête).
- Espace admin et authentification côté front.
- Cohérence de nommage : `Getrace_events` / `use-race-events` / `RaceEvents.ts` à aligner sur `GetRaceEvents` / `useRaceEvents` / `RaceEvent.ts`.
- Titre masqué par une règle globale sur `h1` (à retirer de `index.css`).
- À vérifier : le `/` initial des chemins de photos des pilotes et des équipes en base.

## Décisions qui pourraient bouger

- Statut ou date pour déterminer le prochain événement (D10) : le choix suppose une base tenue à jour par l'admin.
- Modèles en interfaces plutôt qu'en classes (D1) : à revoir le jour où un modèle porte du comportement.
- Cas d'usage de lecture minces (D4) : à reconsidérer si le gabarit paraît trop lourd.
- `statut` laissé modifiable sur `RaceEvent`, par anticipation de la fonctionnalité admin.

## Pistes écartées pour l'instant

- Graphique en points cumulés (échelle qui s'étire, nombres difficiles à lire) au profit des positions.
- Infobulle comme porteur d'information principal.
- Sélection de pilotes au-delà du top 10.
