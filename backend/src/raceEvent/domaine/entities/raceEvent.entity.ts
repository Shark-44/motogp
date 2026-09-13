//src/domaine/entities
export type StatutGP = 'PLANIFIE' | 'TERMINE' | 'ANNULE'

export class RaceEvent {
  constructor(
    public readonly id: string,
    public readonly nom: string,
    public readonly saison: number,
    public readonly date: Date,
    public readonly statut: StatutGP,
    public readonly circuitId: string
    ) {}
}
