
export class RiderStandings {
  constructor(
    public readonly id: string | undefined,
    public readonly eventId: string,
    public readonly piloteId: string,
    public readonly pointsCumules: number,
    public readonly positionGenerale: number,
  ) {}
}
