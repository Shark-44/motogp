import { PrismaClient } from '@prisma/client';
import { RaceEvent, StatutGP } from '../../../domaine/entities/raceEvent.entity.js';
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

  async findByDate(date: Date): Promise<RaceEvent | null> {
    const row = await this.prisma.raceEvent.findFirst({ where: { date } });
    if (!row) return null;
    return new RaceEvent(row.id, row.nom, row.saison, row.date, row.statut, row.circuitId);
  }

  async createEvent(nom: string, saison: number, date: Date, statut: StatutGP, circuitId: string): Promise<RaceEvent> {
    const row = await this.prisma.raceEvent.create({
      data: { nom, saison, date, statut, circuitId },
    });
    return new RaceEvent(row.id, row.nom, row.saison, row.date, row.statut, row.circuitId);
  }

  async findById(id: string): Promise<RaceEvent | null> {
    const row = await this.prisma.raceEvent.findUnique({ where: { id } });
    if (!row) return null;
    return new RaceEvent(row.id, row.nom, row.saison, row.date, row.statut, row.circuitId);
  }

  async updateEvent(raceEvent: RaceEvent): Promise<RaceEvent> {
    const row = await this.prisma.raceEvent.update({
      where: { id: raceEvent.id },
      data: {
        nom: raceEvent.nom,
        saison: raceEvent.saison,
        date: raceEvent.date,
        statut: raceEvent.statut,
        circuitId: raceEvent.circuitId,
      },
    });
    
    return new RaceEvent(row.id, row.nom, row.saison, row.date, row.statut, row.circuitId);
  }
}