import type { SessionResults } from '../../entities/sessionResults.entity.js';

export interface SessionResultsRepositoryPort {
  findAll(): Promise<SessionResults[]>;
}
