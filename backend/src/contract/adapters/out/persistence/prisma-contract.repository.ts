import { PrismaClient, Contract as PrismaContractRow } from '@prisma/client';
import { Contract, RoleContract } from '../../../domaine/entities/contract.entity.js';
import { ContractRepositoryPort } from '../../../domaine/ports/out/contract-repository.port.js';

export class PrismaContractRepository implements ContractRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  private toEntity(row: PrismaContractRow): Contract {
    return new Contract(row.id, row.saison, row.role, row.dateDebut, row.dateFin, row.piloteId, row.equipeId);
  }

  async findAll(): Promise<Contract[]> {
    const rows = await this.prisma.contract.findMany();
    return rows.map(this.toEntity);
  }

  async create(piloteId: string, equipeId: string, saison: number, role: RoleContract, dateDebut: Date, dateFin: Date): Promise<Contract> {
    const row = await this.prisma.contract.create({
      data: { piloteId, equipeId, saison, role, dateDebut, dateFin },
    });
    return this.toEntity(row);
  }

  async findActiveContractForRider(piloteId: string, dateDebut: Date, dateFin: Date): Promise<Contract | null> {
    const row = await this.prisma.contract.findFirst({
      where: { piloteId, dateDebut: { lte: dateFin }, dateFin: { gte: dateDebut } },
    });
    return row ? this.toEntity(row) : null;
  }

  async findNbreContratByTeam(teamId: string, role: RoleContract): Promise<Contract[]> {
    const rows = await this.prisma.contract.findMany({
      where: { equipeId: teamId, role },
    });
    return rows.map(this.toEntity);
  }

  async findLastContractForRider(piloteId: string): Promise<Contract | null> {
    const row = await this.prisma.contract.findFirst({
      where: { piloteId },
      orderBy: { dateFin: 'desc' },
    });
    return row ? this.toEntity(row) : null;
  }

  async findAllContractsForRider(piloteId: string): Promise<Contract[]> {
    const rows = await this.prisma.contract.findMany({
      where: { piloteId },
    });
    return rows.map(this.toEntity);
  }
}