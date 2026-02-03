import ProfilePosts from "@/components/profile-posts";
import useAuth from "@/hooks/useAuth";

export default function Profile() {
  const { user } = useAuth();

  return (
    <section className="flex min-h-screen  bg-black/45 flex-col justify-center items-center w-[100%]   h-[100vh]   overflow-auto no-scrollbar">
      <div className="w-full min-h-screen  flex justify-center items-start py-3">
        <div className=" w-[90%]  md:w-[50%]  flex flex-col items-center">
          <ProfilePosts id_user={user?.id_user as string} />
        </div>
      </div>
    </section>
  );
}
