import type { Rider } from '../../../domaine/entities/rider.entity.js';

export interface ListerRidersPort {
  execute(): Promise<Rider[]>;
}
