// modules/circuits/domain/Circuit.ts
export interface Team {
  readonly id: string,
  readonly nom: string,
  readonly pays: string,
  readonly constructeur: string,
  readonly estOfficielle: boolean,
  readonly logo: string,
  }