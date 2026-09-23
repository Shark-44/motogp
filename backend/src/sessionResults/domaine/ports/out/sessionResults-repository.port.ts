import type { TypeSession, StatutResultat } from '../../entities/sessionResults.entity.js';
import type { SessionResults } from '../../entities/sessionResults.entity.js';

export interface ResultatSaisi {
  typeSession: TypeSession;
  statut: StatutResultat;
  position: number | null;
  piloteId: string;
}
export interface SessionResultsRepositoryPort {
  findAll(): Promise<SessionResults[]>;
  saveAll(results: SessionResults[]): Promise<SessionResults[]>;
}
