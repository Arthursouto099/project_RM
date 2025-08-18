import {BrowserRouter, Route, Routes} from "react-router-dom"
import Login from "./pages/unprotectedRoutes/Login"




// as rotas do sistema devem ficar aqui, <Manter Oorganizado>
export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login"  element={<Login/>}> </Route>
            </Routes>
        </BrowserRouter>
    )
}