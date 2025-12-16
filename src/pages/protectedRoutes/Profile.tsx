import ProfilePosts from "@/components/profile-posts";
import useAuth from "@/hooks/useAuth";

export default function Profile() {



  const { payload } = useAuth()





  return (

    <section className="flex flex-col justify-center items-center w-[100%] dark:bg-black bg-accent/20  h-[100vh]   overflow-auto no-scrollbar">
      <div className="w-full min-h-screen  flex justify-center items-start py-10">
        <div className=" w-[90%]  md:w-[80%]  flex flex-col items-center">
          <ProfilePosts id_user={payload?.id_user as string} />
        </div>
      </div>
    </section>


  )
} 