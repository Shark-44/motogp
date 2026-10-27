// Composition root : le seul endroit qui connaît à la fois les adaptateurs
// et les cas d'usage. Les modules n'importent jamais ce fichier ;
// c'est le routeur qui passe les cas d'usage aux pages en props.

// --- Circuits ---
import { createGetCircuits } from '../modules/circuits/application/Getcircuits'
import { createHttpCircuitRepository } from '../modules/circuits/infrastructure/HttpCircuitRepository'

// --- Riders ---
import { createGetRiders } from '../modules/riders/application/Getriders' 
import { createHttpRiderRepository } from '../modules/riders/infrastructure/HttpRiderRepository'

// --- Teams ---
import { createGetTeams } from '../modules/teams/application/Getteams' 
import { createHttpTeamRepository } from '../modules/teams/infrastructure/HttpTeamRepository'

// --- RaceEvents ---
import { createGetRaceEvents } from '../modules/race-event/application/Getrace_events' 
import { createHttpRaceEventRepository } from '../modules/race-event/infrastructure/HttpRaceEventRepository'

// 1. Initialisation des dépôts (Infrastructure)
const circuitRepository = createHttpCircuitRepository()
const riderRepository = createHttpRiderRepository()
const teamRepository = createHttpTeamRepository()
const raceEventRepository = createHttpRaceEventRepository()

// 2. Initialisation et export des cas d'usage (Application)
export const getCircuits = createGetCircuits(circuitRepository)
export const getRiders = createGetRiders(riderRepository)
export const getTeams = createGetTeams(teamRepository)
export const getRaceEvents = createGetRaceEvents(raceEventRepository)