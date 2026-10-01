import { PrismaClient } from '@prisma/client';
import { Rider } from '../../../domaine/entities/rider.entity.js';
import { RiderRepositoryPort } from '../../../domaine/ports/out/rider-repository.port.js';


export class PrismaRiderRepository implements RiderRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<Rider[]> {
    const rows = await this.prisma.rider.findMany();
    return rows.map(
      (row) =>
        new Rider(row.id, row.fimNumber, row.nom, row.prenom, row.pays, row.dateAnniversaire, row.photo),
    );
  }
  async findById(id: string): Promise<Rider | null> {
    const row = await this.prisma.rider.findUnique({ where: { id } });
    if (!row) return null;
    return new Rider(row.id, row.fimNumber, row.nom, row.prenom, row.pays, row.dateAnniversaire, row.photo);
  }

  async findByFimNumber(fimNumber: string): Promise<Rider | null> {
    const prismaRider = await this.prisma.rider.findFirst({
      where: { fimNumber },
    });
    return prismaRider
  ? new Rider(
      prismaRider.id,
      prismaRider.fimNumber,
      prismaRider.nom,
      prismaRider.prenom,
      prismaRider.pays,
      prismaRider.dateAnniversaire,
      prismaRider.photo,  
    )
  : null;
  }
}