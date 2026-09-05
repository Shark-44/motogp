import { Router } from 'express';
import type { ListerRidersPort } from '../../../application/ports/in/lister-riders.port.js';

export function riderRouter(listerRiders: ListerRidersPort) {
  const router = Router();

  router.get('/riders', async (_req, res) => {
    const riders = await listerRiders.execute();
    res.json(riders);
  });

  return router;
}
