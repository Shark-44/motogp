import type { SessionResults } from '../../../domaine/entities/sessionResults.entity.js';

export interface ListerSessionResultsPort {
  execute(): Promise<SessionResults[]>;
}
