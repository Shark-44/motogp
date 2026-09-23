//../domaine/entities

export type TypeSession = 'SPRINT' | 'RACE';
export type StatutResultat = 'TERMINE' | 'ABANDON' | 'NON_PARTANT';

export class SessionResults {
  constructor(
    
    public readonly id: string,
    public readonly eventId: string,
    public readonly typeSession: TypeSession,
    public readonly statut: StatutResultat,
    public readonly position: number | null,
    public readonly piloteId: string,
  ) {
    //regle ou methode dont l'execution ne depend pas d'une validation externe

    if (statut === 'TERMINE') {
      if (position === null || !Number.isInteger(position) || position < 1) {
        throw new Error('Un pilote classé TERMINE doit avoir une position entière strictement positive.');
      }
    } else {
      if (position !== null) {
        throw new Error('Un pilote non classé (abandon/non-partant) ne peut pas avoir de position.');
      }
    }
  }
}
