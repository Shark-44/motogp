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
    const { riderId, teamId, saison, role } = req.body;
    const contract = await creerContract.execute(riderId, teamId, saison, role);
    res.status(201).json(contract);
  });

  return router;
}
