// modules/circuits/domain/Circuit.ts
export interface Circuit {
    readonly id: string
    readonly nom: string
    readonly pays: string
    readonly longueurKm: number
    readonly nombreVirages: number
    readonly photo: string
  }