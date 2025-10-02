import Layout from "@/layout";
import { useParams } from "react-router-dom";



export function DirectChat() {
    const {id_user} = useParams<{id_user: string}>()


    return (
        <Layout>
            <section className="m-5 h-[95%] bg-sidebar-accent rounded-md flex text-sidebar-foreground  gap-5">

            </section>
        </Layout>
    )
}