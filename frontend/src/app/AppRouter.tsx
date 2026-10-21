import { Routes, Route } from "react-router"
import HomePage from "./HomePage"
import Layout from "./Layout"

function Router() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
            </Route>
        </Routes>
    )
}

export default Router