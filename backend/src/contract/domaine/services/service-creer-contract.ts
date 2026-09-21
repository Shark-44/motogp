import { ContractRepositoryPort } from "../ports/out/contract-repository.port.js";
import { RoleContract } from "../entities/contract.entity.js";
import { RaceEventRepositoryPort } from "../../../raceEvent/domaine/ports/out/raceEvent-repository.port.js";
import { CircuitRepositoryPort } from "../../../circuits/domaine/ports/out/circuit-repository.port.js";

export class ContractValidatorService {
  constructor(
    private readonly contractRepository: ContractRepositoryPort,
    private readonly raceEventRepository: RaceEventRepositoryPort,
    private readonly circuitRepository: CircuitRepositoryPort
  ) {}

  private readonly PLAFONDS: Record<RoleContract, number> = {
    officiel: 2,
    wildcard: 6,
    remplacant: 1,
  };

   
  async validerDisponibilite(piloteId: string, dateDebut: Date, dateFin: Date): Promise<void> {
    const contratExistant = await this.contractRepository.findActiveContractForRider(piloteId, dateDebut, dateFin);
    if (contratExistant) {
      throw new Error(`Le pilote a déjà un contrat actif sur cette période.`);
    }
  }

  /**
   * Règle Un contrat ne peut se signer qu'entre un evenement terminé 
   * et evenement planifié. Pour l'historique des point
   * Et ne peut pas s'appliquer que si un contrat est court
   */
  async validerFenetreSignature(piloteId: string, dateDebutNouveauContrat: Date): Promise<void> {
    
    const dernierEvent = await this.raceEventRepository.chercherDernierEventTermine();
    const prochainEvent = await this.raceEventRepository.chercherProchainEventPlanifie();
    const dernierContrat = await this.contractRepository.findLastContractForRider(piloteId);

    if (dernierContrat && dernierContrat.dateFin) {
      if (dernierEvent && dernierEvent.statut === 'TERMINE') {
        if (dernierContrat.dateFin > dernierEvent.date) {
          throw new Error(
            `Impossible de signer : l'ancien contrat s'est terminé après le dernier événement terminé (${dernierEvent.nom}).`
          );
        }
      }
    }

   if (prochainEvent && prochainEvent.statut === 'PLANIFIE') {
      if (dateDebutNouveauContrat >= prochainEvent.date) {
        throw new Error(
          `La date de début du contrat (${dateDebutNouveauContrat.toISOString().split('T')[0]}) doit être située avant le prochain événement planifié (${prochainEvent.nom} - ${prochainEvent.date.toISOString().split('T')[0]}).`
        );
      }
    }
  }

  /**
   * Règle Un pilote remplacant ne peut signer plusieurs contrat dans plusieurs equipes
   * un principe de confidentialité.
   */
  async validerRestrictionRemplacant(
    piloteId: string, 
    nouvelleTeamId: string, 
    role: RoleContract
  ): Promise<void> {
    
    if (role !== 'remplacant') {
      return;
    }

    
    const historiqueContrats = await this.contractRepository.findAllContractsForRider(piloteId);

    
    const aDejaRemplaceAilleurs = historiqueContrats.some(
        (contract) => contract.role === 'remplacant' && contract.equipeId !== nouvelleTeamId
        );

    if (aDejaRemplaceAilleurs) {
      throw new Error(
        `Règle métier violée : un pilote ayant le rôle remplaçant ne peut pas courir pour plusieurs équipes au cours de la saison.`
      );
    }
  }

  async validerPlafondRole(teamId: string, role: RoleContract): Promise<void> {
    const contrats = await this.contractRepository.findNbreContratByTeam(teamId, role);
    const plafond = this.PLAFONDS[role];

    if (contrats.length >= plafond) {
      throw new Error(`L'équipe a déjà atteint le nombre maximum de contrats pour le rôle ${role}.`);
    }
  }
}