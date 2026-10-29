export type StatutGP = 'PLANIFIE' | 'TERMINE' | 'ANNULE'

export interface RaceEvent {
  readonly id: string,
    readonly nom: string,
    readonly saison: number,
    readonly date: Date,
    statut: StatutGP,
    readonly circuitId: string,
  }