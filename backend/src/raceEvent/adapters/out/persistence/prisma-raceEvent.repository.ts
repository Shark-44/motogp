import { PrismaClient } from '@prisma/client';
import { RaceEvent } from '../../../domaine/entities/raceEvent.entity.js';
import { RaceEventRepositoryPort } from '../../../domaine/ports/out/raceEvent-repository.port.js';

export class PrismaRaceEventRepository implements RaceEventRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<RaceEvent[]> {
    const rows = await this.prisma.raceEvent.findMany();
    return rows.map(
      (row) =>
        new RaceEvent(row.id, row.nom, row.saison, row.date, row.statut, row.circuitId),
    );
  }
}