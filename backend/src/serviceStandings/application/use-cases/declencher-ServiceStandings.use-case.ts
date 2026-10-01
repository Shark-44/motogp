import type { ServiceStandingsPort } from '../ports/in/serviceStandings.port.js';
import type { CalculerRiderStandingsPort } from '../../../riderStandings/application/ports/in/calculer-riderStandings.port.js';
import type { CalculerTeamStandingsPort } from '../../../teamStandings/application/ports/in/calculer-teamStandings.port.js';

export class DeclencherServiseStandingsUseCase implements ServiceStandingsPort {
  constructor(
    private readonly calculerRiderStandings: CalculerRiderStandingsPort,
    private readonly calculerTeamStandings: CalculerTeamStandingsPort,
  ) {}

  async execute(eventId: string): Promise<void> {
    // 1. Recalcul des pilotes
    await this.calculerRiderStandings.execute(eventId);

    // 2. Recalcul des équipes (qui s'appuie sur le contratId et exclut les wildcards)
    await this.calculerTeamStandings.execute(eventId);
  }
}