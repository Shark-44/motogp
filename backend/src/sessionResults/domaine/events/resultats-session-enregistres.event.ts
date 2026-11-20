import type { TypeSession } from '../entities/sessionResults.entity.js';

export interface ResultatsSessionEnregistres {
  readonly eventId: string;
  readonly typeSession: TypeSession;
}