import { Route, Routes } from "react-router"
import Home from "./HomePage"

function router () {

    return (
        <div>
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </div>
    ) 

}

export default router