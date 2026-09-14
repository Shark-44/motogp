import { Router } from 'express';
import type { ListerRaceEventsPort } from '../../../application/ports/in/lister-raceEvents.port.js';
import type { CreerRaceEventPort } from '../../../application/ports/in/creer-raceEvents.port.js'

export function raceEventRouter(listerRaceEvents: ListerRaceEventsPort, creerRaceEvent: CreerRaceEventPort) {
  const router = Router();

  router.get('/raceEvent', async (_req, res) => {
    const raceEvents = await listerRaceEvents.execute();
    res.json(raceEvents);
  });

  router.post('/raceEvents', async (req, res) => {
    try {
      const { nom, saison, date, statut, circuitId } = req.body;
      const raceEvent = await creerRaceEvent.execute(nom, saison, date, statut, circuitId);
      res.status(201).json(raceEvent);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });
  return router;
}
