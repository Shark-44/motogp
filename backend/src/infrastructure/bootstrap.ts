import express from 'express';
import { CircuitRepositoryMySQL } from '../adapters/out/persistence/circuit.repository.mysql.js';
import { ListerCircuitsUseCase } from '../application/use-cases/lister-circuits.use-case.js';
import { circuitRouter } from '../adapters/in/http/circuit.controller.js';

const circuitRepository = new CircuitRepositoryMySQL();
const listerCircuits = new ListerCircuitsUseCase(circuitRepository);

const app = express();
app.use('/api', circuitRouter(listerCircuits));

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`Backend démarré sur http://localhost:${port}`);
});
