import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/unprotectedRoutes/AuthPages";

import Home from "./pages/protectedRoutes/Home";
import Me from "./pages/protectedRoutes/Me";
import Profile from "./pages/protectedRoutes/Profile";
import Friends from "./pages/protectedRoutes/Friends";
import { Direct } from "./pages/protectedRoutes/Direct";
import { DirectChat } from "./pages/protectedRoutes/DirectChat";
import Layout from "./layout";
import Profiles from "./pages/unprotectedRoutes/Profiles";
import CommunityPage from "./pages/protectedRoutes/Community";
import CommunityCreatePage from "./pages/protectedRoutes/CommunityCreate";
import CommunityPageHome from "./pages/protectedRoutes/CommunityPage";
import { GroupChat } from "./pages/protectedRoutes/CommunityChat";

// as rotas do sistema devem ficar aqui, <Manter Oorganizado>
export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rotas onde o meu layout serve*/}
        <Route element={<Layout />}>
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/me" element={<Me />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/direct" element={<Direct />} />
          <Route path="/direct/:id_user" element={<DirectChat />} />
          <Route path="/profiles/:id_user" element={<Profiles />} />
          <Route path="/community/creation" element={<CommunityCreatePage />} />
          <Route path="/community/page/:id_community" element={<CommunityPageHome/>}/>
          <Route  path="/community/chat/:id_chat" element={<GroupChat/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
