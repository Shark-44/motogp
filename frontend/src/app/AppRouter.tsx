// router.tsx
import { Routes, Route } from "react-router"
import HomePage from "./HomePage"
import Layout from "./Layout"
import CircuitsPage from "@/modules/circuits/ui/CircuitsPage"
import { getCircuits } from "./composition"
import RidersPage from "@/modules/riders/ui/RidersPage"
import { getRiders } from "./composition"

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
            </Route>
        </Routes>
    )
}

export default Router