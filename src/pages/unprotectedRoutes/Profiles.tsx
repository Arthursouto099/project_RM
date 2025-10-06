import ProfilePosts from "@/components/profile-posts";
import { useParams } from "react-router-dom";

export default function Profiles() {
    const { id_user } = useParams<{ id_user: string }>()

    return (

    
     <section className="flex flex-col justify-center items-center w-[100%]  h-[95vh]   overflow-auto no-scrollbar">
          <div className="w-full min-h-screen  flex justify-center items-start py-10">
            <div className="w-[45%]  flex flex-col items-center">
              <ProfilePosts id_user={id_user as string} />
            </div>
          </div>
        </section>
    )
}