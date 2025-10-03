import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./pages/unprotectedRoutes/AuthPages"
import ProtectedGroup from "./pages/ProtectedCheck"
import Home from "./pages/protectedRoutes/Home"
import Me from "./pages/protectedRoutes/Me"
import Profile from "./pages/protectedRoutes/Profile"
import Friends from "./pages/protectedRoutes/Friends"
import { Direct } from "./pages/protectedRoutes/Direct"
import { DirectChat } from "./pages/protectedRoutes/DirectChat"
import Layout from "./layout"






// as rotas do sistema devem ficar aqui, <Manter Oorganizado>
export default function Router() {
    return (
   <BrowserRouter>
  <Routes>
    <Route path="/login" element={<Login />} />

    <Route element={<ProtectedGroup />}>
      {/* Rotas onde o meu layout serve*/}
      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/me" element={<Me />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/direct" element={<Direct />} />
        <Route path="/direct/:id_user" element={<DirectChat />} />
      </Route>
    </Route>
  </Routes>
</BrowserRouter>
    )
}