import { Router } from 'express';
import type { ListerContractsPort } from '../../../application/ports/in/lister-contracts.port.js';

export function contractRouter(listerContracts: ListerContractsPort) {
  const router = Router();

  router.get('/contracts', async (_req, res) => {
    const contracts = await listerContracts.execute();
    res.json(contracts);
  });

  return router;
}
