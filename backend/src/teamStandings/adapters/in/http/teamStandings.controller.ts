import { Router } from 'express';
import { ListerTeamStandingsPort } from '../../../application/ports/in/lister-teamStandings.port.js';

export function teamStandingsRouter(TeamStandings: ListerTeamStandingsPort) {
    const router = Router();

router.get('/teamStandings', async (req, res) => {
    try {
       const teamStandings = await TeamStandings.execute();
      res.json(teamStandings);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });
  return router;
}