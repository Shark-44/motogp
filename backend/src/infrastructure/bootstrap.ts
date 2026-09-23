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

import { PrismaTeamRepository } from '../teams/adapters/out/persistence/prisma-team.repository.js';
import { ListerTeamsUseCase } from '../teams/application/use-cases/lister-teams.use-case.js';
import { teamRouter } from '../teams/adapters/in/http/team.controller.js';

import { PrismaContractRepository } from '../contract/adapters/out/persistence/prisma-contract.repository.js';
import { ListerContractsUseCase } from '../contract/application/use-cases/lister-contracts.use-case.js';
import { CreerContractUseCase } from '../contract/application/use-cases/creer-contract.use-case.js';
import { contractRouter } from '../contract/adapters/in/http/contract.controller.js';

import { PrismaRaceEventRepository } from '../raceEvent/adapters/out/persistence/prisma-raceEvent.repository.js';
import { ListerRaceEventsUseCase } from '../raceEvent/application/use-cases/lister-raceEvents.use-case.js';
import { raceEventRouter } from '../raceEvent/adapters/in/http/raceEvent.controller.js';
import { CreerRaceEventsUseCase } from '../raceEvent/application/use-cases/creer-raceEvents.use-case.js';
import { MajRaceEventsUseCase } from '../raceEvent/application/use-cases/maj-raceEvents.use-case.js';
import { ContractValidatorService } from '../contract/domaine/services/service-contract.js';
import { MajFinContractUseCase } from '../contract/application/use-cases/maj.fin-contract.use-case.js';

import { PrismaSessionResultsRepository} from '../sessionResults/adapters/out/persistence/prisma-sessionResults.repository.js'
import { ListerSessionResultUseCase } from '../sessionResults/application/use-cases/lister-sessionResults.use-case.js';
import { sessionResultsRouter } from '../sessionResults/adapters/in/http/sessionResults.controller.js'
import { SaisieSessionResultsUseCase } from '../sessionResults/application/use-cases/saisie-sessionResults.use-case.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const circuitRepository = new PrismaCircuitRepository(prisma);
const riderRepository = new PrismaRiderRepository(prisma);
const teamRepository = new PrismaTeamRepository(prisma);
const contractRepository = new PrismaContractRepository(prisma);
const raceEventRepository = new PrismaRaceEventRepository(prisma);
const sessionResultsRepository = new PrismaSessionResultsRepository(prisma);

const contractValidatorService = new ContractValidatorService(
  contractRepository,
  raceEventRepository,
  circuitRepository
);

const listerCircuits = new ListerCircuitsUseCase(circuitRepository);
const listerRiders = new ListerRidersUseCase(riderRepository);
const listerTeams = new ListerTeamsUseCase(teamRepository);



const listerRaceEvents = new ListerRaceEventsUseCase(raceEventRepository);
const creerRaceEvents = new CreerRaceEventsUseCase(raceEventRepository);
const majRaceEvents = new MajRaceEventsUseCase(raceEventRepository);

const listerContracts = new ListerContractsUseCase(contractRepository);
const creerContract = new CreerContractUseCase(
  contractRepository,
  riderRepository,
  teamRepository,
  contractValidatorService
);
const majFinContract = new MajFinContractUseCase(contractRepository, contractValidatorService, riderRepository);

const listerSessionResults = new ListerSessionResultUseCase(sessionResultsRepository)
const saisieSessionResults = new SaisieSessionResultsUseCase(raceEventRepository,sessionResultsRepository)

const app = express();
app.use(express.json()); 

app.use('/api', circuitRouter(listerCircuits));
app.use('/api', riderRouter(listerRiders));
app.use('/api', teamRouter(listerTeams));
app.use('/api', contractRouter(listerContracts, creerContract, majFinContract));
app.use('/api', raceEventRouter(listerRaceEvents, creerRaceEvents, majRaceEvents));
app.use('/api', sessionResultsRouter(listerSessionResults, saisieSessionResults));

app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`Backend démarré sur http://localhost:${port}`);
});