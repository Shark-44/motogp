import { Router, type Request, type Response, type RequestHandler } from 'express';
import type { ListerRaceEventsPort } from '../../../application/ports/in/lister-raceEvents.port.js';
import type { CreerRaceEventPort } from '../../../application/ports/in/creer-raceEvents.port.js'
import type { MajRaceEventPort } from '../../../application/ports/in/maj-raceEvents.port.js'
import type { ListerRaceEventsIncompletsPort } from '../../../application/ports/in/lister-raceEvents-incomplets.port.js';

export function raceEventRouter(listerRaceEvents: ListerRaceEventsPort, listerRaceEventsIncomplets: ListerRaceEventsIncompletsPort, creerRaceEvent: CreerRaceEventPort, updateRaceEvent: MajRaceEventPort, exigerAdminMw: RequestHandler) {
 
  const router = Router();

  router.get('/raceEvents', async (_req, res) => {
    const raceEvents = await listerRaceEvents.execute();
    res.json(raceEvents);
  });

  router.get('/raceEvents/incomplets', async (_req, res) => {
    try {
      const raceEvents = await listerRaceEventsIncomplets.execute();
      res.status(200).json(raceEvents);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  router.post('/raceEvents', exigerAdminMw, async (req: Request, res: Response) => {
    try {
      const { nom, saison, date, statut, circuitId } = req.body;
      const raceEvent = await creerRaceEvent.execute(nom, saison, new Date(date), statut, circuitId);
      res.status(201).json(raceEvent);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  router.put('/raceEvents/:id', exigerAdminMw, async (req: Request, res: Response) => {
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
