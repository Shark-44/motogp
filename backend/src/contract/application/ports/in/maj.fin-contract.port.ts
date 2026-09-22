import type { Contract } from '../../../domaine/entities/contract.entity.js';

export interface MajFinContractPort {
  execute(
    piloteId: string, 
    dateDebut: Date, 
    dateFin: Date, 
    nouvelleDateFin: Date
  ): Promise<Contract>;
}