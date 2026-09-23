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
}