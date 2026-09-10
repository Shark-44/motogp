import { PrismaClient} from '@prisma/client';
import { Contract, RoleContract } from '../../../domaine/entities/contract.entity.js';
import { ContractRepositoryPort } from '../../../domaine/ports/out/contract-repository.port.js';

export class PrismaContractRepository implements ContractRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<Contract[]> {
    const rows = await this.prisma.contract.findMany();
    return rows.map(
      (row) =>
        new Contract(row.id, row.saison, row.role, row.piloteId, row.equipeId),
    );
  }
  async create(piloteId: string, equipeId: string, saison: number, role: RoleContract): Promise<Contract> {
    const row = await this.prisma.contract.create({
      data: { piloteId, equipeId, saison, role },
    });
    return new Contract(row.id, row.saison, row.role, row.piloteId, row.equipeId);
  }
}
