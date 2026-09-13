import { Router } from 'express';
import type { ListerRaceEventsPort } from '../../../application/ports/in/lister-raceEvents.port.js';

export function raceEventRouter(listerRaceEvents: ListerRaceEventsPort) {
  const router = Router();

  router.get('/raceEvent', async (_req, res) => {
    const raceEvents = await listerRaceEvents.execute();
    res.json(raceEvents);
  });

  return router;
}
