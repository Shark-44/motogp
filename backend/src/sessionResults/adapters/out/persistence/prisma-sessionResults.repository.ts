import { PrismaClient } from '@prisma/client';
import { SessionResults } from '../../../domaine/entities/sessionResults.entity.js';
import { SessionResultsRepositoryPort } from '../../../domaine/ports/out/sessionResults-repository.port.js';

export class PrismaSessionResultsRepository implements SessionResultsRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<SessionResults[]> {
    
    const rows = await this.prisma.sessionResults.findMany();
    return rows.map(
      (row) =>
        new SessionResults(
          row.id,
          row.eventId,
          row.typeSession,
          row.statut,
          row.position,
          row.piloteId,
        ),
    );
  }
  async saveAll(results: SessionResults[]): Promise<SessionResults[]> {
    
    await this.prisma.$transaction(
      results.map((res) =>
        this.prisma.sessionResults.create({
          data: {
            eventId: res.eventId,
            typeSession: res.typeSession,
            statut: res.statut,
            position: res.position,
            piloteId: res.piloteId,
          },
        })
      )
    );
    return results;
  }
}