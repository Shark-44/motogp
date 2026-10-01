import { Router } from 'express';
import type { ServiceStandingsPort } from '../../../../serviceStandings/application/ports/in/serviceStandings.port.js';

export function standingsRouter(serviceStandings: ServiceStandingsPort) {
  const router = Router();

  router.post('/standings/recalculate/:eventId', async (req, res) => {
    try {
      const { eventId } = req.params;
      await serviceStandings.execute(eventId);
      res.status(200).json({ message: 'Classements pilotes et équipes recalculés.' });
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