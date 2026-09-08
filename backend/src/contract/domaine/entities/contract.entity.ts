//src/domaine/entities

export class Contract {
  constructor(
    public readonly id: string,
    public readonly saison: number,
    public readonly role: 'officiel' | 'remplacant' | 'wildcard',
    public readonly piloteId: string,
    public readonly equipeId: string,
  ) {}
}
