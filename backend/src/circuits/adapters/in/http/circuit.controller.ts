import { Router } from 'express';
import type { ListerCircuitsPort } from '../../../application/ports/in/lister-circuits.port.js';

export function circuitRouter(listerCircuits: ListerCircuitsPort) {
  const router = Router();

  router.get('/circuits', async (_req, res) => {
    const circuits = await listerCircuits.execute();
    res.json(circuits);
  });

  return router;
}
