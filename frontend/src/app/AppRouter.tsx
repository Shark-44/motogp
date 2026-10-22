// router.tsx
import { Routes, Route } from "react-router"
import HomePage from "./HomePage"
import Layout from "./Layout"
import CircuitsPage from "@/modules/circuits/ui/CircuitsPage"
import { getCircuits } from "./composition"

function Router() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route
                    path="/circuits"
                    element={<CircuitsPage getCircuits={getCircuits} />}
                />
            </Route>
        </Routes>
    )
}

export default Router