//src/domaine/entities

export class Team {
  constructor(
    public readonly id: string,
    public readonly nom: string,
    public readonly pays: string,
    public readonly constructeur: string,
    public readonly estOfficielle: boolean,
    public readonly logo: string,
  ) {}
}
