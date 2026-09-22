import type { Contract, RoleContract } from '../../entities/contract.entity.js';

export interface ContractRepositoryPort {
  findAll(): Promise<Contract[]>;
  create(riderId: string, teamId: string, saison: number, role: RoleContract, dateDebut: Date, dateFin: Date): Promise<Contract>;
  findActiveContractForRider(piloteId: string, dateDebut: Date, dateFin: Date): Promise<Contract | null>;
  findNbreContratByTeam(teamId: string, role: RoleContract): Promise<Contract[]>;
  findLastContractForRider(piloteId: string): Promise<Contract | null>;
  findAllContractsForRider(piloteId: string): Promise<Contract[]>;
  updateFinContrat(contractId: string, nouvelleDateFin: Date): Promise<Contract>;
}
