# Feature : déclenchement automatique du calcul des classements

> État au 20/11/2026 : fonctionnel, testé, en PR sur `dev`.
> Prérequis : `feature_maj_race_event.md` (un événement doit être `TERMINE` pour recevoir ses résultats) et la page de saisie des résultats (module `session-results` du front).

## En une phrase

Quand les résultats d'une session sont enregistrés, le cas d'usage de saisie **annonce** « des résultats viennent d'être enregistrés », sans savoir qui écoute. Un **handler** côté classements reçoit l'annonce, vérifie que l'événement a bien son Sprint **et** sa Race, et seulement alors lance le calcul.

## Le problème de départ

La saisie enregistrait les résultats et s'arrêtait là. Le calcul des classements existait, mais comme une route à part (`POST /api/standings/recalculate/:eventId`) : personne n'était chargé de la lancer après la saisie.

Trois pistes ont été écartées :

| Piste | Pourquoi elle a été écartée |
|---|---|
| Faire appeler l'orchestrateur par la saisie | La saisie connaîtrait les classements : deux modules qui se dépendent l'un de l'autre. |
| Faire enregistrer les résultats par l'orchestrateur | Il sautait la résolution « numéro FIM → pilote → contrat » et les contrôles de la saisie (erreur `contract is missing`). |
| Le front appelle le recalcul après la saisie | Le front devrait connaître la règle « Sprint ET Race présents », qui est une règle du back. |

## L'idée, sans code

Une analogie avec la révision d'un avion : **exécuté n'est pas libéré**. Quand un technicien termine une tâche, il la signe (ici : la saisie annonce l'événement). Le contrôleur ne libère l'avion (ici : le calcul du classement) que lorsque les deux tâches, Sprint et Race, sont signées. Le technicien ne connaît pas le contrôleur : il signe, c'est tout.

Pour qui connaît Angular : le bus est un `Subject` très simple. `abonner` joue le rôle de `subscribe`, et `publier` celui de `next`.

```
Saisie (enregistre) ──annonce──► Bus ──► Handler : « Sprint ET Race en base ? »
                                            ├─ non : il ne fait rien
                                            └─ oui : Orchestrateur (pilotes, puis équipes)
```

## Les pièces

| Fichier | Rôle |
|---|---|
| `sessionResults/domaine/events/resultats-session-enregistres.event.ts` | Le contenu de l'annonce : `{ eventId, typeSession }`. |
| `sessionResults/application/ports/out/evenements-publisher.port.ts` | Le **contrat** que la saisie utilise pour annoncer : une seule méthode, `publier`. |
| `sessionResults/adapters/out/events/in-memory-event-bus.ts` | Le bus : une liste de fonctions (`abonnes`), avec `abonner` pour en ajouter et `publier` pour les appeler. |
| `serviceStandings/application/use-cases/recalculer-apres-saisie.handler.ts` | Le handler : décide s'il faut lancer le calcul. |
| `sessionResults/application/use-cases/saisie-sessionResults.use-case.ts` | La saisie : reçoit le bus en 5e paramètre et annonce après l'enregistrement. |
| `bootstrap.ts` | Relie le tout : crée le bus, le donne à la saisie, abonne le handler. |

L'orchestrateur (`DeclencherServiseStandingsUseCase`) n'a **pas été modifié** : il lance le calcul des pilotes puis celui des équipes.

## Le trajet d'une saisie, pas à pas

### 1. La requête arrive

Le front envoie `POST /api/sessionResults/:eventId` avec le jeton admin et la liste des pilotes. Le middleware `exigerAdmin` vérifie le jeton, le contrôleur appelle `saisieSessionResults.execute(eventId, resultats)`.

### 2. La saisie travaille

Dans `execute`, dans l'ordre : l'événement doit exister et être `TERMINE` ; pour chaque ligne, on retrouve le pilote par son numéro FIM, puis son contrat actif à cet événement ; on construit une entité `SessionResults`, dont le constructeur refuse un `TERMINE` sans position et un `ABANDON` ou `NON_PARTANT` avec une position ; enfin on enregistre tout.

Si l'une de ces étapes lève une erreur, **la fonction s'arrête là** : aucune annonce n'est faite.

### 3. La saisie annonce

```ts
const sauvegardes = await this.sessionResultsRepository.saveAll(entitesSession);

for (const typeSession of new Set(resultats.map((r) => r.typeSession))) {
  await this.evenements.publier({ eventId, typeSession });
}

return sauvegardes;
```

Ce qui se passe, ligne par ligne :

- **`const sauvegardes`** : un `return` termine la fonction immédiatement. Pour faire quelque chose **après** l'enregistrement, il faut garder son résultat dans une variable, faire l'annonce, puis retourner la variable.
- **`new Set(resultats.map(...))`** : un `Set` supprime les doublons. Les 22 lignes d'une saisie portent le même type de session : on n'annonce donc qu'**une fois** (`RACE`, ou `SPRINT`), pas 22.
- **`this.evenements`** : c'est le paramètre du constructeur, typé par l'**interface** `EvenementsPublisherPort`. La saisie sait seulement qu'elle peut appeler `publier`. Elle ne sait pas que c'est un bus en mémoire, ni qui écoute.

### 4. Le bus distribue

```ts
async publier(evenement) {
  for (const abonne of this.abonnes) {
    try {
      await abonne(evenement);
    } catch (erreur) {
      console.error('[event-bus] abonné en échec :', (erreur as Error).message);
    }
  }
}
```

Un « abonné » est simplement une **fonction** rangée dans un tableau par `abonner`. `publier` parcourt le tableau et appelle chaque fonction avec l'annonce.

Le `try/catch` est voulu : au moment de l'annonce, **les résultats sont déjà enregistrés**. Si le calcul échoue, il ne faut pas transformer une saisie réussie en erreur.

### 5. Le handler décide

```ts
async handle(evenement) {
  const resultats = await this.sessionResultsRepository.findByEventIds([evenement.eventId]);
  const sessions = new Set(resultats.map((r) => r.typeSession));
  if (!sessions.has('SPRINT') || !sessions.has('RACE')) return;
  await this.declencherStandings.execute(evenement.eventId);
}
```

Il **relit la base** (il ne se fie pas à ce que dit l'annonce) et regarde quels types de session existent pour cet événement. S'il en manque un, `return` : rien ne se passe. Sinon, il appelle l'orchestrateur.

### 6. L'orchestrateur calcule

L'orchestrateur lance le calcul des classements pilotes, puis celui des équipes. Chaque calcul **resomme toute la saison** jusqu'à cet événement, avec ses contrôles : l'événement doit être `TERMINE`, et tout événement `TERMINE` de la saison, daté jusqu'à celui-ci, doit avoir ses deux sessions (sinon : « Incohérence : … »). Les points viennent du barème : seul un statut `TERMINE` avec une position en marque, tout le reste vaut zéro.

### 7. La réponse repart

Le contrôleur répond `201` au front. Comme l'annonce est attendue (`await`) **avant** de répondre, la réponse arrive après le calcul.

## Comment les pièces sont reliées (le bootstrap)

```ts
const eventBus = new InMemoryEventBus();

const saisieSessionResults = new SaisieSessionResultsUseCase(
  raceEventRepository, riderRepository, sessionResultsRepository, contractRepository,
  eventBus, // 5e argument
);

// ... calculs de classement, puis l'orchestrateur ...

const recalculerApresSaisie = new RecalculerApresSaisieHandler(
  sessionResultsRepository,
  declencherServiceStandings,
);
eventBus.abonner((evenement) => recalculerApresSaisie.handle(evenement));
```

**L'ordre compte.**
1. Le bus est créé avant la saisie, qui le reçoit.
2. Le handler est créé après l'orchestrateur, dont il dépend : une `const` utilisée avant sa déclaration plante.
3. Les arguments d'un constructeur sont **positionnels** : si on les range dans le mauvais ordre, TypeScript peut ne rien dire et l'erreur n'apparaît qu'à l'exécution (`saveAll is not a function`, rencontré pendant la mise au point).

**Pourquoi une fonction fléchée dans `abonner` ?** `(evenement) => recalculerApresSaisie.handle(evenement)` garde le handler comme `this`. En passant `handle` directement, la méthode serait appelée sans son objet et ne retrouverait plus ses dépendances.

Le bus est le **même objet** pour la saisie et pour l'abonnement : c'est ce qui les relie sans qu'ils se connaissent.

## Ce qui se passe selon les cas

| Cas | Résultat |
|---|---|
| Saisie du Sprint seul | Annonce `SPRINT` ; le handler ne trouve pas de `RACE` ; aucun calcul. |
| Saisie de la Race, Sprint déjà en base | Annonce `RACE` ; le handler trouve les deux ; calcul lancé. |
| Saisie refusée (événement non terminé, pilote inconnu, pas de contrat, position invalide) | Erreur `400` ; rien d'enregistré, **aucune annonce**. |
| Échec de l'enregistrement (par exemple la même session saisie deux fois : clé unique en base) | Erreur ; **aucune annonce**. |
| Le calcul refuse (un événement `TERMINE` plus ancien sans résultats) | Les résultats **restent enregistrés**, la réponse est un `201`, et le motif apparaît **dans le terminal du back** : `[event-bus] abonné en échec : Incohérence…`. |

## Pourquoi cette conception

- **La saisie ne connaît pas les classements.** Les deux modules peuvent évoluer séparément.
- **La règle « Sprint ET Race » vit à un seul endroit**, côté back, dans le handler. Le front envoie les résultats et n'a rien d'autre à faire.
- **On peut ajouter une réaction sans toucher à la saisie** : un nouvel abonné (une trace, un message) se branche avec une ligne `abonner` dans le bootstrap.
- **La relance manuelle reste possible** : la route `POST /api/standings/recalculate/:eventId` existe toujours, pour recalculer sans nouvelle saisie.

## Ce que les tests garantissent

Fichier `saisie-sessionResults.use-case.test.ts` (les ports sont simulés, aucune base n'est nécessaire) :

- l'annonce est publiée avec le bon `eventId` et le bon type de session ;
- elle est publiée **après** l'enregistrement, jamais avant ;
- elle n'est **pas** publiée si la saisie est refusée ou si l'enregistrement échoue.

En cassant volontairement le code, on a vérifié que ces tests échouent : sans annonce, trois tests tombent ; avec l'annonce avant l'enregistrement, deux tombent.

## Limites assumées

- **Le bus est en mémoire et sans file d'attente.** Si le serveur s'arrête entre l'enregistrement et le calcul, l'annonce est perdue : il faut alors relancer le calcul par la route manuelle.
- **Le motif d'un calcul refusé n'est visible que dans le terminal du back.** Le front reçoit un `201` et ne sait pas que le classement n'a pas été recalculé.
- **La réponse attend le calcul.** Plus la saison avance, plus le calcul resomme d'événements, et plus la réponse met de temps.
- **Quatre règles de lot décrites dans l'ancien test, mais non implémentées** (entre 18 et 24 pilotes, un seul type de session par lot, pas de numéro FIM ni de position en double) : elles sont en `it.todo` dans le fichier de test.
- **À vérifier** : relancer le calcul pour le même événement ne doit pas dupliquer les lignes de classement. Le dépôt des classements n'a pas été relu pour ce point.

## Pannes rencontrées (symptôme, cause, méthode)

| Symptôme | Cause | Comment je l'ai trouvé |
|---|---|---|
| `this.sessionResultsRepository.saveAll is not a function` | Un paramètre ajouté au constructeur de l'orchestrateur, avec des arguments rangés dans l'ancien ordre dans le bootstrap : l'objet reçu n'était pas un dépôt | Lire le message à l'envers : l'objet reçu n'est pas celui attendu, donc vérifier l'ordre des arguments au bootstrap |
| Prisma : `Argument contract is missing`, avec `contratId: undefined` | L'orchestrateur avait reçu les lignes du front (numéro FIM, statut, position) et les passait telles quelles à l'enregistrement, en sautant la résolution pilote et contrat que fait la saisie | Le journal de Prisma montrait les champs vides : le problème était la conception, pas la syntaxe |
| `Incohérence : … pas de résultats de Sprint enregistrés` | Le calcul refuse quand un événement `TERMINE` n'a pas ses deux sessions. Ici, la table était vide : il n'y avait rien à additionner | Requêtes SQL de comptage par événement et par session ; le calcul n'était pas défaillant, il appliquait sa règle |
| La saisie n'enregistrait plus rien | L'adaptateur du front pointait sur `/api/standings/recalculate`, dont le contrôleur ignore le corps de la requête | Lire ce que fait réellement la route : `recalculate` ne lit que l'`eventId` |
| Huit tests sur dix en échec | L'ancien fichier de test décrivait un autre cas d'usage (pilotes résolus par `findAll`, règles de lot) que le code réel | Lancer le test **tel quel** avant de le modifier, pour séparer ce qui était déjà cassé de ce que la modification cassait |

**Méthode à retenir** : quand une chaîne de plusieurs maillons échoue, séparer les maillons (appel direct de la route, requête en base, test isolé) avant de modifier du code. Et lancer un test tel quel avant de le modifier.

## À aborder ensuite

1. Un message clair pour le front quand le calcul est refusé (aujourd'hui : seulement le terminal du back).
2. Décider des quatre règles de lot (`it.todo`) : implémenter ou retirer.
3. Vérifier que le recalcul d'un même événement ne duplique pas les classements.
4. Protéger les routes d'admin côté front (`/adminPage`, `/events/:eventId/results`).
