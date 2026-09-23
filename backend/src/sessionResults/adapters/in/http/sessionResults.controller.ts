import { Router } from 'express';
import type { ListerSessionResultsPort } from '../../../application/ports/in/lister-sessionResults.port.js';

export function sessionResultsRouter(listerSessionResults: ListerSessionResultsPort) {
  const router = Router();

  router.get('/sessionResults', async (_req, res) => {
    const sessionResults = await listerSessionResults.execute();
    res.json(sessionResults);
  });

  return router;
}
