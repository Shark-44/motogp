import type { CalculerTeamStandingsPort } from '../ports/in/calculer-teamStandings.port.js';
import type { RaceEventRepositoryPort } from '../../../raceEvent/domaine/ports/out/raceEvent-repository.port.js';
import type { SessionResultsRepositoryPort } from '../../../sessionResults/domaine/ports/out/sessionResults-repository.port.js';
import type { SessionResults } from '../../../sessionResults/domaine/entities/sessionResults.entity.js';
import type { TeamStandingsRepositoryPort } from '../../domaine/ports/out/teamStandings-repository.port.js';
import type { ContractRepositoryPort } from '../../../contract/domaine/ports/out/contract-repository.port.js';
import type { Contract } from '../../../contract/domaine/entities/contract.entity.js';
import { TeamStandings } from '../../domaine/entities/teamStandings.entity.js';
import { ReglementPointMotoGP } from '../../../motogpScoringRules/domaine/services/reglementPointMotoGP.service.js';
import { DepartageClassement } from '../../../riderStandings/domaine/services/departage-classement.service.js';

// [teamId, pointsCumules]
type LigneTeam = [string, number];

export class CalculerTeamStandingsUseCase implements CalculerTeamStandingsPort {
  constructor(
    private readonly raceEventRepository: RaceEventRepositoryPort,
    private readonly sessionResultsRepository: SessionResultsRepositoryPort,
    private readonly teamStandingsRepository: TeamStandingsRepositoryPort,
    private readonly contractRepository: ContractRepositoryPort,
    private readonly reglementPoints: ReglementPointMotoGP = new ReglementPointMotoGP(),
    private readonly departage: DepartageClassement = new DepartageClassement(),
  ) {}

  async execute(eventId: string): Promise<TeamStandings[]> {
    const evenement = await this.raceEventRepository.findById(eventId);

    if (!evenement) {
      throw new Error(`Aucun événement trouvé avec l'id ${eventId}`);
    }
    if (evenement.statut !== 'TERMINE') {
      throw new Error(`Le classement ne peut être calculé qu'après un événement terminé.`);
    }

    const tousLesEvents = await this.raceEventRepository.findAll();
    const roundsPrisEnCompte = tousLesEvents.filter(
      (e) => e.saison === evenement.saison && e.date <= evenement.date,
    );
    const eventIds = roundsPrisEnCompte.map((e) => e.id);

    const resultats = await this.sessionResultsRepository.findByEventIds(eventIds);

    const eventsQuiExigentDesResultats = roundsPrisEnCompte.filter((e) => e.statut === 'TERMINE');

    const manqueAuMoinsUneSprint = eventsQuiExigentDesResultats.some(
      (event) => !resultats.some((r) => r.eventId === event.id && r.typeSession === 'SPRINT'),
    );
    if (manqueAuMoinsUneSprint) {
      throw new Error(
        `Incohérence : au moins un événement TERMINE de la saison n'a pas de résultats de Sprint enregistrés.`,
      );
    }

    const manqueAuMoinsUneRace = eventsQuiExigentDesResultats.some(
      (event) => !resultats.some((r) => r.eventId === event.id && r.typeSession === 'RACE'),
    );
    if (manqueAuMoinsUneRace) {
      throw new Error(
        `Incohérence : au moins un événement TERMINE de la saison n'a pas de résultats de Course (Race) enregistrés.`,
      );
    }

    // 1. Récupération des contrats associés aux résultats
    const contratIds = [...new Set(resultats.map((r) => r.contratId).filter((id): id is string => Boolean(id)))];
    const contrats = await this.contractRepository.findByIds(contratIds);
    const mapContrats = new Map<string, Contract>(contrats.map((c) => [c.id, c]));

    // 2. Calcul des points par résultat de session
    const attributions = this.reglementPoints.calculer(resultats);

    // 3. Aggrégation des points par Équipe (avec filtrage des WILDCARDS)
    const totalParTeam = new Map<string, number>();

    for (const attribution of attributions) {
      const resultat = resultats.find((r) => r.id === attribution.resultatId);
      if (!resultat || !resultat.contratId) continue;

      const contrat = mapContrats.get(resultat.contratId);
      
      // Exclure les contrats WILDCARD du classement Équipes
      if (!contrat || contrat.role === 'wildcard') {
        continue;
      }

      const teamId = contrat.equipeId;
      const totalActuel = totalParTeam.get(teamId) ?? 0;
      totalParTeam.set(teamId, totalActuel + attribution.points);
    }

    // 4. Tri avec départage
    const classementTrie: LigneTeam[] = [...totalParTeam.entries()];

    classementTrie.sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      // Adaptateur de départage pour les équipes si nécessaire
      return this.departage.comparerTeam(a[0], b[0], resultats, mapContrats);
    });

    // 5. Attribution des rangs (avec gestion des ex-aequo)
    const classements = classementTrie.map(([teamId, pointsCumules], index) => {
      const rang =
        index > 0 && this.exAequo(classementTrie[index - 1], classementTrie[index], resultats, mapContrats)
          ? this.trouverRangPrecedent(classementTrie, index, resultats, mapContrats)
          : index + 1;
      return new TeamStandings(undefined, eventId, teamId, pointsCumules, rang);
    });

    return await this.teamStandingsRepository.saveAll(classements);
  }

  private exAequo(
    a: LigneTeam,
    b: LigneTeam,
    resultats: SessionResults[],
    mapContrats: Map<string, Contract>,
  ): boolean {
    return a[1] === b[1] && this.departage.comparerTeam(a[0], b[0], resultats, mapContrats) === 0;
  }

  private trouverRangPrecedent(
    classementTrie: LigneTeam[],
    index: number,
    resultats: SessionResults[],
    mapContrats: Map<string, Contract>,
  ): number {
    let i = index;
    while (i > 0 && this.exAequo(classementTrie[i - 1], classementTrie[index], resultats, mapContrats)) {
      i--;
    }
    return i + 1;
  }
}