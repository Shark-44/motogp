import { Router } from 'express';
import type { ListerTeamsPort } from '../../../application/ports/in/lister-teams.port.js';

export function teamRouter(listerTeams: ListerTeamsPort) {
  const router = Router();

  router.get('/teams', async (_req, res) => {
    const teams = await listerTeams.execute();
    res.json(teams);
  });

  return router;
}
