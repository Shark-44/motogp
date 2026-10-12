export interface DetailTeamStandings {
  equipeId: string;
  eventId: string;
  pointsCumules: number;
  positionGenerale: number;
  nomEquipe?: string;
  nomEvent: string;
  dateEvent: Date;
}

export interface ListerTeamStandingsPort {
  execute(): Promise<DetailTeamStandings[]>;
}
