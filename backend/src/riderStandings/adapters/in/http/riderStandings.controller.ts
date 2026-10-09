import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaRiderStandingsRepository } from '../../out/persistence/prisma-riderStandings.repository.js';
import { PrismaRiderRepository } from '../../../../riders/adapters/out/persistence/prisma-rider.repository.js';
import { PrismaRaceEventRepository } from '../../../../raceEvent/adapters/out/persistence/prisma-raceEvent.repository.js';
import type { CalculerRiderStandingsPort } from '../../../application/ports/in/calculer-riderStandings.port.js';
import { ListerRiderStandingsUseCase } from '../../../application/use-cases/lister-riderStandings.use-case.js';
import { ListerDetailRiderStandingsUseCase } from '../../../application/use-cases/listerByEvent-riderStandings.use-case.js';

export function riderStandingsRouter(calculerRiderStandings: CalculerRiderStandingsPort) {
  const router = Router();
  const prisma = new PrismaClient();

  const riderStandingsRepository = new PrismaRiderStandingsRepository(prisma);
  const riderRepository = new PrismaRiderRepository(prisma);
  const raceEventRepository = new PrismaRaceEventRepository(prisma);

  
  const listerRiderStandingsUseCase = new ListerRiderStandingsUseCase(
    riderStandingsRepository,
    riderRepository,
    raceEventRepository
  );

  const listerDetailRiderStandingsUseCase = new ListerDetailRiderStandingsUseCase(
    riderStandingsRepository,
    riderRepository,
    raceEventRepository
  );


  router.post('/riderStandings/:eventId', async (req, res) => {
    try {
      const { eventId } = req.params;
      await calculerRiderStandings.execute(eventId);
      res.status(201).end();
    } catch (error) {
      const message = (error as Error).message;

      if (message.includes('Aucun événement trouvé')) {
        res.status(404).json({ message });
      } else {
        res.status(400).json({ message });
      }
    }
  });

  router.get('/riderStandings', async (req, res) => {
    try {
      const eventIdsQuery = req.query.eventIds;
      const eventIds = typeof eventIdsQuery === 'string' ? eventIdsQuery.split(',') : [];

      const riderStandings = await listerRiderStandingsUseCase.execute(eventIds);
      res.json(riderStandings);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  router.get('/riderStandings/:eventId', async (req, res) => {
    try {
      const { eventId } = req.params;
      const detailRiderStandings = await listerDetailRiderStandingsUseCase.execute(eventId);
      res.json(detailRiderStandings);
    } catch (error) {
      const message = (error as Error).message;
      if (message.includes('Aucun événement trouvé')) {
        res.status(404).json({ message });
      } else {
        res.status(500).json({ error: message });
      }
    }
  });

  return router;
}