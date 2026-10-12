import type { TeamStandingsRepositoryPort } from '../../domaine/ports/out/teamStandings-repository.port.js';
import type { ListerTeamStandingsPort, DetailTeamStandings } from '../ports/in/lister-teamStandings.port.js';
import type { TeamRepositoryPort } from '../../../teams/domaine/ports/out/team-repository.port.js';
import type { RaceEventRepositoryPort } from '../../../raceEvent/domaine/ports/out/raceEvent-repository.port.js';

export class ListerTeamStandingsUseCase implements ListerTeamStandingsPort {
    constructor(
        private readonly teamStandingsRepository: TeamStandingsRepositoryPort,
        private readonly teamRepository: TeamRepositoryPort,
        private readonly raceEventRepository: RaceEventRepositoryPort,
    ) {}

    async execute(): Promise<DetailTeamStandings[]> {
        // 1. Classements et évènements
        const [classements, evenements] = await Promise.all([
            this.teamStandingsRepository.findAll(),
            this.raceEventRepository.findAll(),
        ]);

        if (classements.length === 0) {
            return [];
        }

        // 2. Dernier event terminé = event le plus récent pour lequel un classement existe
        const eventIdsAvecClassement = new Set(classements.map((c) => c.eventId));

        const dernierEvent = evenements
            .filter((e) => eventIdsAvecClassement.has(e.id))
            .sort((a, b) => b.date.getTime() - a.date.getTime())[0];

        if (!dernierEvent) {
            return [];
        }

        // 3. Équipes (seulement si on a quelque chose à enrichir)
        const equipes = await this.teamRepository.findAll();
        const equipeMap = new Map(equipes.map((e) => [e.id, e]));

        // 4. Filtrage sur le dernier event, tri, enrichissement
        return classements
            .filter((ligne) => ligne.eventId === dernierEvent.id)
            .sort((a, b) => a.positionGenerale - b.positionGenerale)
            .map((ligne) => ({
                equipeId: ligne.equipeId,
                eventId: ligne.eventId,
                pointsCumules: ligne.pointsCumules,
                positionGenerale: ligne.positionGenerale,
                nomEquipe: equipeMap.get(ligne.equipeId)?.nom,
                nomEvent: dernierEvent.nom,
                dateEvent: dernierEvent.date,
            }));
    }
}
