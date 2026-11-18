// src/modules/session-results/domain/SessionResult.ts
// Valeurs reprises de la maquette de page : à aligner sur l'enum de l'entité
// sessionResults du backend (non vue). Un seul fichier à changer si elles diffèrent.
export type SessionType = 'SPRINT' | 'RACE'
export type ResultStatus = 'TERMINE' | 'ABANDON' | 'NON_PARTANT'

// Une ligne envoyée au back : exactement les champs lus par le cas d'usage de saisie.
export interface SessionResultEntry {
  readonly fimNumber: string
  readonly typeSession: SessionType
  readonly statut: ResultStatus
  readonly position: number
}

// Ce que la saisie a besoin de savoir des pilotes et de l'événement.
// Types « structurels » : un Rider ou un RaceEvent est assignable sans aucun import
// entre modules (règle d'import entre modules encore ouverte dans le carnet).
export interface RiderOption {
  readonly fimNumber: string
  readonly nom: string
  readonly prenom: string
}

export interface EventOption {
  readonly id: string
  readonly nom: string
  readonly date: Date
  readonly statut: string
}
