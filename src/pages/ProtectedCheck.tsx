import { useLocation, Navigate, Outlet } from "react-router-dom";
import { tokenActions } from "../@tokenSettings/token";



export default function ProtectedGroup() {
    const token = tokenActions.getToken()
    const location = useLocation()


    if (!token) {
        tokenActions.removeToken()
        return <Navigate to={"/login"} replace state={{ from: location }} />
    }

    if (!token) return null; // evita renderizar enquanto redireciona
    return <Outlet />;

}