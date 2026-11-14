import { describe, it, expect, vi } from 'vitest';
import { ListerRaceEventsIncompletsUseCase } from './lister-raceEvents-incomplets.use-case.js';
import { RaceEvent } from '../../domaine/entities/raceEvent.entity.js';
import type { RaceEventRepositoryPort } from '../../domaine/ports/out/raceEvent-repository.port.js';

describe('ListerRaceEventsIncompletsUseCase', () => {
  it("doit retourner les événements terminés dont les sessions sont incomplètes", async () => {
    // Arrange
    const mockEvents = [
      new RaceEvent('id-1', 'GP de France', 2026, new Date('2026-05-15'), 'TERMINE', 'circuit-id-1'),
    ];

    const raceEventRepositoryMock: RaceEventRepositoryPort = {
      findAll: vi.fn(),
      findByDate: vi.fn(),
      createEvent: vi.fn(),
      findById: vi.fn(),
      updateEvent: vi.fn(),
      chercherDernierEventTermine: vi.fn(),
      chercherProchainEventPlanifie: vi.fn(),
      findIncompletedEvents: vi.fn().mockResolvedValue(mockEvents),
    };

    const useCase = new ListerRaceEventsIncompletsUseCase(raceEventRepositoryMock);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(raceEventRepositoryMock.findIncompletedEvents).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockEvents);
  });
});