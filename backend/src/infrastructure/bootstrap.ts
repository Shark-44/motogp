import express from 'express';
import { prisma } from './prisma-client.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaCircuitRepository } from '../circuits/adapters/out/persistence/prisma-circuit.repository.js';
import { ListerCircuitsUseCase } from '../circuits/application/use-cases/lister-circuits.use-case.js';
import { circuitRouter } from '../circuits/adapters/in/http/circuit.controller.js';
import { PrismaRiderRepository } from '../riders/adapters/out/persistence/prisma-rider.repository.js';
import { ListerRidersUseCase } from '../riders/application/use-cases/lister-riders.use-case.js';
import { riderRouter } from '../riders/adapters/in/http/rider.controller.js';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const circuitRepository = new PrismaCircuitRepository(prisma);
const listerCircuits = new ListerCircuitsUseCase(circuitRepository);

const riderRepository = new PrismaRiderRepository(prisma);
const listerRiders = new ListerRidersUseCase(riderRepository);

const app = express();
app.use(express.json()); 
app.use('/api', circuitRouter(listerCircuits));
app.use('/api', riderRouter(listerRiders))
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`Backend démarré sur http://localhost:${port}`);
});