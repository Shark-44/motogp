// application/ports/in/creer-contract.port

import type { Contract, RoleContract } from '../../../domaine/entities/contract.entity.js';

export interface CreerContractPort {
  execute(piloteId: string, equipeId: string, saison: number, role: RoleContract): Promise<Contract>;
}