import Layout from "@/layout";
import { Search } from "lucide-react";
import { useEffect } from "react";




export default function Friends() {




    useEffect(() => {
        
    }, [])


    return (
        <Layout>
            <section className="m-5 h-[95%] "> 
                    <header  className="w-full ">
                        <div className="w-[50%] relative">
                                <Search className="absolute  top-2 right-4"/>
                                <input className="w-full rounded-md border p-2" placeholder="@usuario" type="text" name="" id="" />
                        </div>

                    </header>
            </section>
        </Layout>
    )
}