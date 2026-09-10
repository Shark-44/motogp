// domaine/entities

export type RoleContract = 'officiel' | 'remplacant' | 'wildcard';

export class Contract {
  constructor(
    public readonly id: string,
    public readonly saison: number,
    public readonly role: RoleContract,
    public readonly piloteId: string,
    public readonly equipeId: string,
  ) {}
}
