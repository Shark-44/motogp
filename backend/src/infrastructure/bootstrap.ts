import express from 'express';
import { prisma } from './prisma-client.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaCircuitRepository } from '../circuits/adapters/out/persistence/prisma-circuit.repository.js';
import { ListerCircuitsUseCase } from '../circuits/application/use-cases/lister-circuits.use-case.js';
import { circuitRouter } from '../circuits/adapters/in/http/circuit.controller.js';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const circuitRepository = new PrismaCircuitRepository(prisma);
const listerCircuits = new ListerCircuitsUseCase(circuitRepository);

const app = express();
app.use(express.json()); 
app.use('/api', circuitRouter(listerCircuits));
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`Backend démarré sur http://localhost:${port}`);
});