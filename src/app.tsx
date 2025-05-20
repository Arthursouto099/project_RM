import {BrowserRouter, Routes, Route} from "react-router-dom"

import Test from "./pages/test"


// as rotas do sistema devem ficar aqui, <Manter Oorganizado>
export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
             <Route path="/" element={<Test/>} ></Route>
            </Routes>
        </BrowserRouter>
    )
}