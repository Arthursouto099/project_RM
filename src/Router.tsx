import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./pages/unprotectedRoutes/AuthPages"
import ProtectedGroup from "./pages/ProtectedCheck"
import Home from "./pages/protectedRoutes/Home"
import Me from "./pages/protectedRoutes/Me"
import Profile from "./pages/protectedRoutes/Profile"
import Friends from "./pages/protectedRoutes/Friends"






// as rotas do sistema devem ficar aqui, <Manter Oorganizado>
export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />}> </Route>
                <Route element={<ProtectedGroup />} >
                    <Route path="/home" element={<Home />}></Route>
                    <Route path="/me" element={<Me/>}> </Route>
                    <Route path="/profile" element={<Profile/>}> </Route>
                    <Route path="/friends" element={<Friends/>}> </Route>
                    
                </Route>
            </Routes>
        </BrowserRouter>
    )
}