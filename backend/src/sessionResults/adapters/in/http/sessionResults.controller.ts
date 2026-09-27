import { Router } from 'express';
import type { ListerSessionResultsPort } from '../../../application/ports/in/lister-sessionResults.port.js';
import type { SaisieSessionResultsPort } from '../../../application/ports/in/saisie-sessionResults.port.js';

export function sessionResultsRouter(
  listerSessionResults: ListerSessionResultsPort,
  saisieSessionResults: SaisieSessionResultsPort
) {
  const router = Router();

  // Route de lecture
  router.get('/sessionResults', async (_req, res) => {
    const sessionResults = await listerSessionResults.execute();
    res.json(sessionResults);
  });

  
  router.post('/sessionResults/:eventId', async (req, res) => {
    try {
      const { eventId } = req.params;
      const resultatsSaisis = req.body; 
      const sessionResults = await saisieSessionResults.execute(eventId, resultatsSaisis);
      
      res.status(201).json(sessionResults);
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