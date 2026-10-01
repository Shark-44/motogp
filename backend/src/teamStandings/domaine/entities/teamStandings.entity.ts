export class TeamStandings {
    constructor(
      public readonly id: string | undefined,
      public readonly eventId: string,
      public readonly equipeId: string,
      public readonly pointsCumules: number,
      public readonly positionGenerale: number,
    ) {}
  }