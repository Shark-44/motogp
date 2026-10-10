
export interface DetailCircuitRiderStandings {
  piloteId: string;
  eventId: string;
  pointsCumules: number;
  positionGenerale: number;
  nom?: string;
  prenom?: string;
  nomEvent?: string;
  dateEvent?: Date;
  circuitEvent?: string;
  nomCircuit?: string;
  paysCircuit?: string;
}

export interface ListerRiderStandingPort {
  execute(): Promise<DetailCircuitRiderStandings[]>;
}

