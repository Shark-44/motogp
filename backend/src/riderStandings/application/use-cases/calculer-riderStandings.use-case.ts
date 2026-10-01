import type { CalculerRiderStandingsPort } from '../ports/in/calculer-riderStandings.port.js';
import type { RaceEventRepositoryPort } from '../../../raceEvent/domaine/ports/out/raceEvent-repository.port.js';
import type { SessionResultsRepositoryPort } from '../../../sessionResults/domaine/ports/out/sessionResults-repository.port.js';
import type { SessionResults } from '../../../sessionResults/domaine/entities/sessionResults.entity.js';
import type { RiderStandingsRepositoryPort } from '../../domaine/ports/out/riderStandings-repository.port.js';
import { RiderStandings } from '../../domaine/entities/riderStandings.entity.js';
import { ReglementPointMotoGP } from '../../../motogpScoringRules/domaine/services/reglementPointMotoGP.service.js';
import { DepartageClassement } from '../../domaine/services/departage-classement.service.js';

// [piloteId, pointsCumules]
type LignePilote = [string, number];

export class CalculerRiderStandingsUseCase implements CalculerRiderStandingsPort {
  constructor(
    private readonly raceEventRepository: RaceEventRepositoryPort,
    private readonly sessionResultsRepository: SessionResultsRepositoryPort,
    private readonly riderStandingsRepository: RiderStandingsRepositoryPort,
    private readonly reglementPoints: ReglementPointMotoGP = new ReglementPointMotoGP(),
    private readonly departage: DepartageClassement = new DepartageClassement(),
  ) {}

  async execute(eventId: string): Promise<RiderStandings[]> {
    const evenement = await this.raceEventRepository.findById(eventId);

    if (!evenement) {
      throw new Error(`Aucun événement trouvé avec l'id ${eventId}`);
    }
    if (evenement.statut !== 'TERMINE') {
      throw new Error(`Le classement ne peut être calculé qu'après un événement terminé.`);
    }

    // Recalcul complet : on resomme tous les rounds de la saison, du premier
    // jusqu'à celui-ci inclus. Pas de cumul incrémental sur un classement
    // précédent, pour ne jamais risquer de dérive entre deux recalculs.
    const tousLesEvents = await this.raceEventRepository.findAll();
    const roundsPrisEnCompte = tousLesEvents.filter(
      (e) => e.saison === evenement.saison && e.date <= evenement.date,
    );
    const eventIds = roundsPrisEnCompte.map((e) => e.id);

    const resultats = await this.sessionResultsRepository.findByEventIds(eventIds);

    // Tout round TERMINE pris en compte dans le recalcul doit avoir ses deux
    // sessions saisies (US-RES-01) : sinon on resommerait la saison avec un
    // maillon manquant, sans que rien ne le signale.
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

    const attributions = this.reglementPoints.calculer(resultats);

    const totalParPilote = new Map<string, number>();
    for (const attribution of attributions) {
      const totalActuel = totalParPilote.get(attribution.piloteId) ?? 0;
      totalParPilote.set(attribution.piloteId, totalActuel + attribution.points);
    }

    // Classement standard ("competition ranking") : deux pilotes à égalité
    // (points ET départage) partagent le même rang, le rang suivant tient
    // compte du nombre d'ex-aequo (1, 1, 3 — pas 1, 1, 2).
    //
    // Départage : à points égaux, on compare le nombre de victoires en RACE,
    // puis de 2es places, puis de 3es, etc. (voir DepartageClassement).
    const classementTrie: LignePilote[] = [...totalParPilote.entries()];

    classementTrie.sort(
      (a, b) => b[1] - a[1] || this.departage.comparer(a[0], b[0], resultats),
    );

    const classements = classementTrie.map(([piloteId, pointsCumules], index) => {
      const rang =
        index > 0 && this.exAequo(classementTrie[index - 1], classementTrie[index], resultats)
          ? this.trouverRangPrecedent(classementTrie, index, resultats)
          : index + 1;
      return new RiderStandings(undefined, eventId, piloteId, pointsCumules, rang);
    });

    return await this.riderStandingsRepository.saveAll(classements);
  }

  private exAequo(a: LignePilote, b: LignePilote, resultats: SessionResults[]): boolean {
    return a[1] === b[1] && this.departage.comparer(a[0], b[0], resultats) === 0;
  }

  private trouverRangPrecedent(classementTrie: LignePilote[], index: number, resultats: SessionResults[]): number {
    let i = index;
    while (i > 0 && this.exAequo(classementTrie[i - 1], classementTrie[index], resultats)) {
      i--;
    }
    return i + 1;
  }
}
