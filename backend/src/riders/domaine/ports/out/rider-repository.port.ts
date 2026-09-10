import type { Rider } from '../../entities/rider.entity.js';

export interface RiderRepositoryPort {
  findAll(): Promise<Rider[]>;
  findById(id: string): Promise<Rider | null>;
}
