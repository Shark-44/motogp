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
import { createMarkRaceEventDone } from '../modules/race-event/application/MarkRaceEventDone'

// ---RiderStanding ---
import { createGetRiderStanding } from '../modules/rider-standing/application/Getrider_standing' 
import { createHttpRiderStandingRepository } from '../modules/rider-standing/infrastructure/HttpRiderStandingRepository'

// ---TeamStanding ---
import { createGetTeamStanding } from '../modules/team-standing/application/Getteam_standing' 
import { createHttpTeamStandingRepository } from '../modules/team-standing/infrastructure/HttpTeamStandingRepository'


// 1. Initialisation des dépôts (Infrastructure)
const circuitRepository = createHttpCircuitRepository()
const riderRepository = createHttpRiderRepository()
const teamRepository = createHttpTeamRepository()
const raceEventRepository = createHttpRaceEventRepository()
const riderStandingRepository = createHttpRiderStandingRepository()
const teamStandingRepository = createHttpTeamStandingRepository()

// 2. Initialisation et export des cas d'usage (Application)
export const getCircuits = createGetCircuits(circuitRepository)
export const getRiders = createGetRiders(riderRepository)
export const getTeams = createGetTeams(teamRepository)
export const getRaceEvents = createGetRaceEvents(raceEventRepository)
export const markRaceEventDone = createMarkRaceEventDone(raceEventRepository)
export const getRiderStanding = createGetRiderStanding(riderStandingRepository)
export const getTeamStanding = createGetTeamStanding(teamStandingRepository)