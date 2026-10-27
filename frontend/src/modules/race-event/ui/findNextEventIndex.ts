// À placer dans application/ de ton module raceEvents.
//
// Règle d'usage : « quel est le prochain événement ? »
// - on raisonne sur la DATE, pas sur le statut (la base ne se met pas à jour seule) ;
// - un événement annulé ne peut jamais être « le prochain » ;
// - `now` est un paramètre : la fonction est testable avec une date fixée.
//
// Hypothèse : la liste est triée par date croissante (à faire dans ton cas d'usage).
//
// Type minimal décrit à la main pour ne pas deviner le chemin de ton modèle.
// Tu peux le remplacer par ton vrai type : Pick<RaceEvent, 'date' | 'statut'>.
interface DatedEvent {
  readonly date: Date
  readonly statut: string
}

/** Renvoie l'index du prochain événement, ou -1 s'il n'y en a plus (saison terminée). */
export function findNextEventIndex(
  events: ReadonlyArray<DatedEvent>,
  now: Date,
): number {
  // Début de la journée : une course du jour reste « à venir » jusqu'à minuit.
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  return events.findIndex(
    (event) =>
      event.statut !== 'ANNULE' && event.date.getTime() >= startOfToday.getTime(),
  )
}
