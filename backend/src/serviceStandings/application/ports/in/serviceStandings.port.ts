
export interface ServiceStandingsPort {
    execute(eventId: string): Promise<void>;
  }