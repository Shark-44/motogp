import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { prisma } from './prisma-client.js';

//admin middleware
import { routerAdmin } from '../auth/adapters/in/http/auth.routes.js'
import { AuthController } from '../auth/adapters/in/http/auth.controller.js';
import { exigerAdmin } from '../auth/adapters/in/http/exiger-admin.middleware.js';
import { ConnecterAdminUseCase } from '../auth/application/use-cases/connecter-admin.use-case.js';
import { VerifierJetonUseCase } from '../auth/application/use-cases/verifier-jeton.use-case.js';
import { JwtJetonService } from '../auth/adapters/out/jwt/jwt-jeton.service.js';
import { VerifierAdminUseCase } from '../auth/application/use-cases/verifier-admin.use-case.js';

const motDePasseAdmin = process.env.ADMIN_PASSWORD;
if (!motDePasseAdmin) {
  throw new Error('ADMIN_PASSWORD manquant : renseigne-le dans le fichier .env');
}

const secretJwt = process.env.JWT_SECRET;
if (!secretJwt) {
  throw new Error('JWT_SECRET manquant : renseigne-le dans le fichier .env');
}

const dureeSecondes = Number(process.env.JWT_DUREE_SECONDES ?? 3600);

const verifierAdmin = new VerifierAdminUseCase(motDePasseAdmin);
const jetonService = new JwtJetonService(secretJwt, dureeSecondes);
const connecterAdmin = new ConnecterAdminUseCase(verifierAdmin, jetonService);
const verifierJeton = new VerifierJetonUseCase(jetonService);

const authController = new AuthController(connecterAdmin);
const exigerAdminMw = exigerAdmin(verifierJeton);

// le domaine

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
import { ContractValidatorService } from '../contract/domaine/services/service-contract.js';
import { MajFinContractUseCase } from '../contract/application/use-cases/maj.fin-contract.use-case.js';

import { PrismaRaceEventRepository } from '../raceEvent/adapters/out/persistence/prisma-raceEvent.repository.js';
import { ListerRaceEventsUseCase } from '../raceEvent/application/use-cases/lister-raceEvents.use-case.js';
import { raceEventRouter } from '../raceEvent/adapters/in/http/raceEvent.controller.js';
import { CreerRaceEventsUseCase } from '../raceEvent/application/use-cases/creer-raceEvents.use-case.js';
import { MajRaceEventsUseCase } from '../raceEvent/application/use-cases/maj-raceEvents.use-case.js';

import { PrismaSessionResultsRepository } from '../sessionResults/adapters/out/persistence/prisma-sessionResults.repository.js';
import { ListerSessionResultUseCase } from '../sessionResults/application/use-cases/lister-sessionResults.use-case.js';
import { sessionResultsRouter } from '../sessionResults/adapters/in/http/sessionResults.controller.js';
import { SaisieSessionResultsUseCase } from '../sessionResults/application/use-cases/saisie-sessionResults.use-case.js';

import { ReglementPointMotoGP } from '../motogpScoringRules/domaine/services/reglementPointMotoGP.service.js';
import { DepartageClassement } from '../riderStandings/domaine/services/departage-classement.service.js';

// Repositories & Use Cases Classements
import { PrismaRiderStandingsRepository } from '../riderStandings/adapters/out/persistence/prisma-riderStandings.repository.js';
import { CalculerRiderStandingsUseCase } from '../riderStandings/application/use-cases/calculer-riderStandings.use-case.js';
import { riderStandingsRouter } from '../riderStandings/adapters/in/http/riderStandings.controller.js';


import { PrismaTeamStandingsRepository } from '../teamStandings/adapters/out/persistence/prisma-teamStandings.repository.js';
import { CalculerTeamStandingsUseCase } from '../teamStandings/application/use-cases/calculer-TeamStandings.use-case.js';

import { teamStandingsRouter } from '../teamStandings/adapters/in/http/teamStandings.controller.js'

// Orchestrateur & Routeur
import { DeclencherServiseStandingsUseCase } from '../serviceStandings/application/use-cases/declencher-ServiceStandings.use-case.js';
import { standingsRouter } from '../serviceStandings/adapters/in/http/serviceStandings.controller.js';
import { ListerTeamStandingsUseCase } from '../teamStandings/application/use-cases/lister-teamStandings.use-case.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Instanciation des Repositories ---
const circuitRepository = new PrismaCircuitRepository(prisma);
const riderRepository = new PrismaRiderRepository(prisma);
const teamRepository = new PrismaTeamRepository(prisma);
const contractRepository = new PrismaContractRepository(prisma);
const raceEventRepository = new PrismaRaceEventRepository(prisma);
const sessionResultsRepository = new PrismaSessionResultsRepository(prisma);
const riderStandingsRepository = new PrismaRiderStandingsRepository(prisma);
const teamStandingsRepository = new PrismaTeamStandingsRepository(prisma);

// --- Services Domaine ---
const contractValidatorService = new ContractValidatorService(
  contractRepository,
  raceEventRepository,
  circuitRepository
);
const reglementPoints = new ReglementPointMotoGP();
const departage = new DepartageClassement();

// --- Use Cases ---
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
const majFinContract = new MajFinContractUseCase(
  contractRepository,
  contractValidatorService,
  riderRepository
);

const listerSessionResults = new ListerSessionResultUseCase(sessionResultsRepository);
const saisieSessionResults = new SaisieSessionResultsUseCase(
  raceEventRepository,
  riderRepository,
  sessionResultsRepository,
  contractRepository
);

// Use Cases de calcul métier des classements
const calculerRiderStandings = new CalculerRiderStandingsUseCase(
  raceEventRepository,
  sessionResultsRepository,
  riderStandingsRepository,
  reglementPoints,
  departage
);

const calculerTeamStandings = new CalculerTeamStandingsUseCase(
  raceEventRepository,
  sessionResultsRepository,
  teamStandingsRepository,
  contractRepository,
  reglementPoints,
  departage
);
const ListerTeamStandings = new ListerTeamStandingsUseCase(teamStandingsRepository, teamRepository, raceEventRepository)

// Orchestrateur Global
const declencherServiceStandings = new DeclencherServiseStandingsUseCase(
  calculerRiderStandings,
  calculerTeamStandings
);

// --- Application Express ---
const app = express();
app.use(express.json());

app.use('/auth', routerAdmin(authController, exigerAdminMw));

app.use('/api', circuitRouter(listerCircuits));
app.use('/api', riderRouter(listerRiders));
app.use('/api', teamRouter(listerTeams));
app.use('/api', contractRouter(listerContracts, creerContract, majFinContract, exigerAdminMw));
app.use('/api', raceEventRouter(listerRaceEvents, creerRaceEvents, majRaceEvents, exigerAdminMw));
app.use('/api', sessionResultsRouter(listerSessionResults, saisieSessionResults, exigerAdminMw));
app.use('/api', riderStandingsRouter(calculerRiderStandings, exigerAdminMw));
app.use('/api', teamStandingsRouter(ListerTeamStandings));

// Nouvelle route orchestrée
app.use('/api', standingsRouter(declencherServiceStandings, exigerAdminMw));

app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`Backend démarré sur http://localhost:${port}`);
});