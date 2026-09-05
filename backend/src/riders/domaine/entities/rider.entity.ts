//src/domaine/entities

export class Rider {
  constructor(
    public readonly id: string,
    public readonly nom: string,
    public readonly prenom: string,
    public readonly pays: string,
    public readonly dateAnniversaire: Date,
    public readonly photo: string,
  ) {}
}
