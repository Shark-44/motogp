
export interface DetailRiderStandings {
  piloteId: string;
  eventId: string;
  pointsCumules: number;
  positionGenerale: number;
  nom: string | undefined;
  prenom: string | undefined;
  nomEvent: string;
  dateEvent: Date;
  circuitEvent: string;
}

export interface ListerDetailRiderStandingPort {
  execute(eventId: string): Promise<DetailRiderStandings[]>;
}