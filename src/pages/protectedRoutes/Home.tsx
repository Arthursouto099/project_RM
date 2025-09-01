import { Navigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import Layout from "@/layout"






export default function Home() {
    const { payload, isAuthenticated } = useAuth()


    if (!isAuthenticated) {
        return <Navigate to={"/login"} replace state={{ from: location }} />
    }







    return (
        <Layout >
            <div className="w-screen h-screen ">
               
            </div>
        </Layout>

    )
}