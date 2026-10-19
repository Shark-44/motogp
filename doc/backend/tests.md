## Tests d'intégration (collection Postman)

### Approche actuelle
La collection est exécutée avec le Runner contre le serveur local et sa base
réelle. Elle teste l'API de bout en bout : login, récupération du jeton,
création puis mise à jour d'événements, avec des variables chaînées
(`monTokenBearer`, `eventId`, `eventIdTermine`).

**Pourquoi Postman à ce stade :** c'est un outil visuel qui me permet de
vérifier rapidement que toutes les couches (routeur, middleware d'auth,
use cases, repositories, base) fonctionnent ensemble, avant d'écrire des
tests automatisés dans le code.

### Limites connues
- Les tests dépendent de l'ordre d'exécution et de l'état de la base.
- Les données créées ne sont pas nettoyées après chaque run.
- Les tests d'authentification négatifs (401/403) ne sont pas encore écrits.
- Certains tests de mise à jour acceptent plusieurs codes de retour au lieu
  d'un résultat attendu précis.


### Objectifs
1. Ajouter les cas négatifs d'auth : sans jeton, jeton invalide, mauvais
   mot de passe.
2. Rendre les tests de mise à jour déterministes (un seul résultat attendu).
3. Lancer la collection en ligne de commande avec Newman.
4. Compléter avec des tests automatisés dans le code (tests unitaires des
   use cases, tests HTTP des routes) sur une base de test dédiée.