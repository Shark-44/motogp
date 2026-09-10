import { Router } from 'express';
import type { ListerContractsPort } from '../../../application/ports/in/lister-contracts.port.js';
import type { CreerContractPort} from '../../../application/ports/in/creer-contract.port.js'

export function contractRouter(listerContracts: ListerContractsPort, creerContract: CreerContractPort) {
  const router = Router();

  router.get('/contracts', async (_req, res) => {
    const contracts = await listerContracts.execute();
    res.json(contracts);
  });

  router.post('/contracts', async (req, res) => {
    try {
      const { piloteId, equipeId, saison, role } = req.body;
      const contract = await creerContract.execute(piloteId, equipeId, saison, role);
      res.status(201).json(contract);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  return router;
}
