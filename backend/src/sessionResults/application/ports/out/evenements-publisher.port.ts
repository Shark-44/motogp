import type { ResultatsSessionEnregistres } from '../../../domaine/events/resultats-session-enregistres.event.js';

export interface EvenementsPublisherPort {
  publier(evenement: ResultatsSessionEnregistres): Promise<void>;
}