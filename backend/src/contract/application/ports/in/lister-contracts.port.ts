import type { Contract } from '../../../domaine/entities/contract.entity.js';

export interface ListerContractsPort {
  execute(): Promise<Contract[]>;
}
