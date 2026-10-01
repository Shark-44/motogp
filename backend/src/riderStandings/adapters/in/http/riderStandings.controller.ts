import { Router } from 'express';
import type { CalculerRiderStandingsPort } from '../../../application/ports/in/calculer-riderStandings.port.js';

export function riderStandingsRouter(calculerRiderStandings: CalculerRiderStandingsPort) {
  const router = Router();

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

  return router;
}
