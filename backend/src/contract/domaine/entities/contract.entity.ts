// domaine/entities

export type RoleContract = 'officiel' | 'remplacant' | 'wildcard';

export class Contract {
  constructor(
    public readonly id: string,
    public readonly saison: number,
    public readonly role: RoleContract,
    public readonly dateDebut: Date,
    public          dateFin:   Date | null,
    public readonly piloteId: string,
    public readonly equipeId: string,
  ) {}
}
