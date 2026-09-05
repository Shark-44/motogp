import type { Rider } from '../../entities/rider.entity.js';

export interface RiderRepositoryPort {
  findAll(): Promise<Rider[]>;
}
