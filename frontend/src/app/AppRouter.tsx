// router.tsx
import { Routes, Route } from "react-router"
import HomePage from "./HomePage"
import Layout from "./Layout"
import CircuitsPage from "@/modules/circuits/ui/CircuitsPage"
import { getCircuits } from "./composition"
import RidersPage from "@/modules/riders/ui/RidersPage"
import { getRiders } from "./composition"
import TeamsPage from "@/modules/teams/ui/TeamsPage"
import { getTeams } from "./composition"
import RaceEventPage from "@/modules/race-event/ui/RaceEventPage"
import { getRaceEvents } from "./composition"
import RiderStandingsPage from "@/modules/rider-standing/ui/RiderStandingsPage"
import { getRiderStanding } from "./composition"
import TeamStandingsPage from "@/modules/team-standing/ui/TeamStandingsPage"
import { getTeamStanding } from "./composition"

function Router() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route
                    path="/circuits"
                    element={<CircuitsPage getCircuits={getCircuits} />}
                />
                <Route
                    path="/riders"
                    element={<RidersPage getRiders={getRiders} />}
                />
                <Route
                    path="/teams"
                    element={<TeamsPage getTeams={getTeams} />}
                />
                <Route
                    path="/raceEvents"
                    element={<RaceEventPage getRaceEvents={getRaceEvents} />}
                />
                <Route
                    path="/riderStandings"
                    element={<RiderStandingsPage getRiderStanding={getRiderStanding} />}
                />
                <Route
                    path="/teamStandings"
                    element={<TeamStandingsPage getTeamStanding={getTeamStanding} />}
                />
            </Route>
        </Routes>
    )
}

export default Router