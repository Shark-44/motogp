import { Router } from 'express';
import type { ListerContractsPort } from '../../../application/ports/in/lister-contracts.port.js';
import type { CreerContractPort} from '../../../application/ports/in/creer-contract.port.js'
import type { MajFinContractPort } from '../../../application/ports/in/maj.fin-contract.port.js';

export function contractRouter(listerContracts: ListerContractsPort, creerContract: CreerContractPort, majFinContract: MajFinContractPort) {
  const router = Router();

  router.get('/contracts', async (_req, res) => {
    const contracts = await listerContracts.execute();
    res.json(contracts);
  });

  router.post('/contracts', async (req, res) => {
    try {
      const { piloteId, equipeId, saison, role, dateDebut, dateFin } = req.body;
      const contract = await creerContract.execute(piloteId, equipeId, saison, role, dateDebut, dateFin);
      res.status(201).json(contract);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  router.patch('/contracts/:piloteId', async (req, res) => {
    try {
      const { piloteId } = req.params;
      const { dateDebut, dateFin, nouvelleDateFin } = req.body;
  
      const updatedContract = await majFinContract.execute(
        piloteId,
        new Date(dateDebut),
        new Date(dateFin),
        new Date(nouvelleDateFin)
      );
  
      res.status(200).json(updatedContract);
    } catch (error) {
      const message = (error as Error).message;
      if (message.includes('Aucun contrat actif')) {
        res.status(404).json({ message });
      } else {
        res.status(400).json({ message });
      }
    }
  });

  return router;
}
