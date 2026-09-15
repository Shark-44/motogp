import { Router } from 'express';
import type { ListerRaceEventsPort } from '../../../application/ports/in/lister-raceEvents.port.js';
import type { CreerRaceEventPort } from '../../../application/ports/in/creer-raceEvents.port.js'
import type { MajRaceEventPort } from '../../../application/ports/in/maj-raceEvents.port.js'

export function raceEventRouter(listerRaceEvents: ListerRaceEventsPort, creerRaceEvent: CreerRaceEventPort, updateRaceEvent: MajRaceEventPort) {
  const router = Router();

  router.get('/raceEvent', async (_req, res) => {
    const raceEvents = await listerRaceEvents.execute();
    res.json(raceEvents);
  });

  router.post('/raceEvents', async (req, res) => {
    try {
      const { nom, saison, date, statut, circuitId } = req.body;
      const raceEvent = await creerRaceEvent.execute(nom, saison, new Date(date), statut, circuitId);
      res.status(201).json(raceEvent);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  router.put('/raceEvents/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { statut } = req.body;
      const raceEvent = await updateRaceEvent.execute(id, statut);
      res.status(200).json(raceEvent);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });
  return router;
}
