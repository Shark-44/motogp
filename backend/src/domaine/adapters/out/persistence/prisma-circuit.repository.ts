import { PrismaClient } from '@prisma/client';
import { Circuit } from '../../../entities/circuit.entity';
import { CircuitRepositoryPort } from '../../../ports/out/circuit-repository.port';

export class PrismaCircuitRepository implements CircuitRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<Circuit[]> {
    const rows = await this.prisma.circuit.findMany();
    return rows.map(
      (row) =>
        new Circuit(row.id, row.nom, row.pays, row.longueurKm, row.nombreVirages, row.photo),
    );
  }
}
