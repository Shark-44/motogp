# Feature : mise à jour du statut d'un événement (admin)

> État au 08/11/2026 : fonctionnel, testé en réel (un Grand Prix a bien été passé à « Terminé » depuis le site).
> Prérequis : voir `feature_auth.md` (connexion admin, jeton dans `localStorage`).

## Objectif

Le calendrier (`race-event`) affiche les courses « Terminé », « Prochain » et « À venir ». En mode admin, un bouton sur la carte **« Prochain »** permet de la passer en « Terminé ». Une modale de confirmation évite l'erreur d'un mauvais clic.

C'est le seul geste qui fait **avancer** le calendrier : le « prochain » événement est le premier au statut `PLANIFIE` en base, il ne dépend pas de la date du jour.

## Parcours

```
Clic sur « Marquer comme terminé » (carte Prochain, mode admin)
        │
        ▼
useMarkRaceEventDone.request(event)  ──►  ouvre ConfirmDialog
        │
        ▼
« Marquer <nom> comme terminé ? »   [Annuler]  [Confirmer]
        │ Confirmer
        ▼
MarkRaceEventDone(id)  ──►  HttpRaceEventRepository.updateStatut
        │
        ▼
PUT /api/raceEvents/:id   Authorization: Bearer <jeton>   { "statut": "TERMINE" }
        │
        ├─ 200 : la modale se ferme, refresh() recharge la liste, le carrousel se recentre
        └─ échec : la modale reste ouverte et affiche la raison
```

## Contrat avec le backend

- `PUT /api/raceEvents/:id`, protégé par `exigerAdmin`
- En-tête : `Authorization: Bearer <jeton>`
- Corps : `{ "statut": "TERMINE" }` (le contrôleur ne lit que ce champ)
- Réponses :
  - `200` : l'événement mis à jour
  - `400` : `{ message }`, refus du cas d'usage
  - `401` : `{ error }`, jeton absent, invalide ou expiré
  - `403` : `{ error }`, jeton valide mais rôle insuffisant

Les erreurs du contrôleur utilisent la clé `message`, celles du middleware la clé `error` : l'adaptateur lit les deux.

## Arborescence

```
src/shared/
├── infrastructure/
│   └── authHeader.ts
└── ui/
    └── ConfirmDialog.tsx

src/modules/race-event/
├── domain/
│   └── RaceEventRepository.ts
├── application/
│   └── MarkRaceEventDone.ts
├── infrastructure/
│   └── HttpRaceEventRepository.ts
└── ui/
    ├── use-race-events.ts
    ├── useMarkRaceEventDone.ts
    └── RaceEventPage.tsx

src/app/
├── composition.tsx     (export markRaceEventDone)
└── router.tsx          (prop passée à RaceEventPage)
```

## Rôle de chaque fichier

| Fichier | Rôle |
|---|---|
| `shared/infrastructure/authHeader.ts` | Fonction utilitaire (pas un hook) : renvoie l'en-tête `Authorization` à partir de `admin_token`. Le jeton est lu **à chaque appel**, pas au chargement du fichier, pour prendre en compte une connexion ou une déconnexion. |
| `shared/ui/ConfirmDialog.tsx` | Modale de confirmation générique, sans logique : titre, message, boutons, état d'envoi et erreur arrivent en props. Réutilisable pour les futures actions admin. |
| `domain/RaceEventRepository.ts` | Ports : `RaceEventReader` (lecture), `RaceEventWriter` (`updateStatut`), et leur union. |
| `application/MarkRaceEventDone.ts` | Cas d'usage côté front : porte l'**intention métier** (« terminer un événement ») et masque le statut technique `TERMINE` à la page et au hook. |
| `infrastructure/HttpRaceEventRepository.ts` | Adaptateur HTTP : `PUT` avec l'en-tête du jeton, conversion de la date, traduction des erreurs (401, `message`, `error`). |
| `ui/use-race-events.ts` | Charge la liste ; renvoie `{ state, refresh }`. `refresh` relance le chargement sans repasser par « loading ». |
| `ui/useMarkRaceEventDone.ts` | Logique de l'action : événement visé, envoi en cours, erreur. Renvoie `request` et `dialogProps`, prêts à brancher sur la modale. |
| `ui/RaceEventPage.tsx` | Assemble : bouton sur la carte `isNext` si `isAdmin`, et `<ConfirmDialog {...markDone.dialogProps} />`. |
| `app/composition.tsx` | Crée le cas d'usage avec le dépôt et l'exporte (`markRaceEventDone`). |
| `app/router.tsx` | Passe `markRaceEventDone` à `RaceEventPage` en prop. |

## Décisions de conception et pourquoi

- **Le bouton n'apparaît que sur la carte « Prochain »**, sans calcul de date : le prochain événement se détermine par le statut en base. Si le back a une règle supplémentaire, c'est lui qui arbitre et renvoie une `400` avec un message, que la modale affiche.
- **`MarkRaceEventDone` ne contient pas de règle métier de validité.** Il traduit l'intention en `statut = 'TERMINE'`. Les règles (qui peut être terminé, et quand) restent côté back, dans le cas d'usage de mise à jour (*à confirmer en relisant `maj-raceEvents.use-case`*).
- **Modale et hook séparés** : la modale affiche, le hook décide, le cas d'usage parle au back. Le hook prépare toutes les props de la modale (`dialogProps`), donc la page reste mince.
- **Routes de commande (CQRS) protégées par un middleware côté back** : côté front, `authHeader` évite de réécrire la lecture du jeton dans chaque adaptateur admin.
- **Fermeture bloquée pendant l'envoi** : ni clic à côté, ni « Annuler », pour ne pas laisser un état incohérent.
- **`refresh` plutôt que `window.location.reload()`** : la liste se met à jour sans recharger le navigateur, et le carrousel se recentre sur le nouveau « Prochain ».

## Limites et ce qui n'est pas traité

- **Jeton expiré ou invalide (401)** : l'adaptateur lève pour l'instant une erreur locale (« Session expirée »), affichée dans la modale. À faire : détecter la 401 **une seule fois** pour tous les appels admin, vider `admin_token`, repasser `isAdmin` à `false` et renvoyer vers `/`.
- **`isAdmin` propre à chaque appel de `useAuthAdmin()`** : la page et le Layout n'ont pas le même état. Une déconnexion faite dans le Layout peut laisser le bouton affiché jusqu'au rechargement. Solution prévue : un Context partagé.
- **Le bouton caché n'est qu'un affichage** : la vraie protection est `exigerAdmin` côté back.
- **`findNextEventIndex.ts` n'est plus utilisé** et raisonne par date, ce qui contredit la règle par statut : à supprimer.

## Pannes rencontrées (symptôme, cause, méthode)

| Symptôme | Cause | Comment je l'ai trouvé |
|---|---|---|
| Boutons « Marquer comme terminé » éparpillés sur la bannière et sous les cartes | Une classe `absolute` copiée du bouton de déconnexion, et un bouton créé sur **chaque** carte (pas de condition `isNext`) | Comprendre à quel ancêtre `absolute` se rattache : les `<li>` ne sont pas `relative`, et un `scale-*` crée un nouveau repère |
| Requête qui n'atteint pas le back | `fetch('/raceEvents/…')` sans le préfixe `/api` : le proxy de Vite ne transmet que `/api` | Comparaison avec les autres adaptateurs, qui appellent `/api/<ressource>` |
| Erreur de syntaxe affichée dans la modale | `JSON.parse` sur le jeton : `admin_token` contient la chaîne JWT brute, pas un tableau JSON | Relire comment le jeton est écrit (`useAuthAdmin`) avant d'écrire comment le lire |
| `markRaceEventDone is not a function` | Dans `composition.tsx`, le nom `createMarkRaceEventDone` désignait un **dépôt** HTTP au lieu de la fabrique du cas d'usage importée | Lire le message à l'envers : l'objet reçu n'est pas celui attendu, donc remonter la chaîne de composition jusqu'à l'endroit où il est créé |

**Méthode à retenir** : un message « is not a function » veut presque toujours dire qu'un maillon de la chaîne de composition a reçu autre chose que prévu. Vérifier les noms et les imports avant de toucher à la logique.

## Test réel

- 08/11/2026 : connexion admin, clic sur « Marquer comme terminé » sur la carte « Prochain », confirmation : le Grand Prix est passé en « Terminé » et le calendrier s'est mis à jour.

## Prochains chapitres

1. Route `/adminPage` protégée (vérification du jeton, redirection vers `/`).
2. Gestion centralisée de la 401 dans l'adaptateur HTTP.
3. Context `isAdmin` partagé entre le Layout et les pages.
4. Pages admin suivantes (création, modification), qui réutiliseront `authHeader` et `ConfirmDialog`.
