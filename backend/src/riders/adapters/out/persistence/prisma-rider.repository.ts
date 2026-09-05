import { PrismaClient } from '@prisma/client';
import { Rider } from '../../../domaine/entities/rider.entity.js';
import { RiderRepositoryPort } from '../../../domaine/ports/out/rider-repository.port.js';

export class PrismaRiderRepository implements RiderRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<Rider[]> {
    const rows = await this.prisma.rider.findMany();
    return rows.map(
      (row) =>
        new Rider(row.id, row.nom, row.prenom, row.pays, row.dateAnniversaire, row.photo),
    );
  }
}