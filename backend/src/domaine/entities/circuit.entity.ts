//src/domaine/entities

export class Circuit {
  constructor(
    public readonly id: string,
    public readonly nom: string,
    public readonly pays: string,
    public readonly longueurKm: number,
    public readonly nombreVirages: number,
    public readonly photo: string,
  ) {}
}
