import type { EvenementsPublisherPort } from '../../../application/ports/out/evenements-publisher.port.js';
import type { ResultatsSessionEnregistres } from '../../../domaine/events/resultats-session-enregistres.event.js';

type Abonne = (evenement: ResultatsSessionEnregistres) => Promise<void>;

export class InMemoryEventBus implements EvenementsPublisherPort {
  private readonly abonnes: Abonne[] = [];

  abonner(abonne: Abonne): void {
    this.abonnes.push(abonne);
  }

  async publier(evenement: ResultatsSessionEnregistres): Promise<void> {
    for (const abonne of this.abonnes) {
      try {
        await abonne(evenement);
      } catch (erreur) {
        // La saisie est déjà enregistrée : un abonné en échec ne doit pas la faire échouer.
        console.error('[event-bus] abonné en échec :', (erreur as Error).message);
      }
    }
  }
}