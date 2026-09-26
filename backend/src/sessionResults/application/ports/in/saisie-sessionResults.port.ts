import type { TypeSession, StatutResultat, SessionResults } from '../../../domaine/entities/sessionResults.entity.js';

export interface ResultatSaisi {
  typeSession: TypeSession;
  statut: StatutResultat;
  position: number | null;
  fimNumber: string;
}

export interface SaisieSessionResultsPort {
  execute(eventId: string, resultats: ResultatSaisi[]): Promise<SessionResults[]>;
}