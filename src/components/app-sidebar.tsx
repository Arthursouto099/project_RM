import { Home, MessageSquare, Settings, Users2 } from "lucide-react"
import {  User2, CirclePlus } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Link, useLocation, useNavigate } from "react-router-dom"
import UserApi, { type CommonUser } from "@/api/UserApi"
import { useEffect, useState } from "react"
import { DialogCreatePost } from "./post-create-modal"
import { ModeToggle } from "./ToggleThemeButton"
import Avatar from "@/api_avatar"

// Menu items.
const items = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User2,
  },
  {
    title: "Pedidos",
    url: "/friends",
    icon: Users2,
  },
  {
    title: "Messages",
    url: "/direct",
    icon: MessageSquare,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,

  },
]

export function AppSidebar() {
  const [me, setMe] = useState<CommonUser>()
  const navigate = useNavigate()
  const location = useLocation()


  useEffect(() => {
    const fetchMe = async () => {

      const response = await UserApi.get()

      if (!response.success) return

      const data = response.data as CommonUser
      setMe(data)

    }


    fetchMe()


  }, [])

  const navigateToMe = () => {
    navigate("/me", { replace: true, state: { from: location } })
  }


  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup className="flex justify-center items-center">
          <div className="p-4  w-full bg-sidebar-accent/40 py-2 mb-5  rounded-md flex gap-2 cursor-pointer items-center" onClick={navigateToMe}>
            <Avatar name={me?.username} image={me?.profile_image}/>

            <div>
              <h1 className="text-[15px] font-semibold">{me?.username.split(" ")[0]} {me?.username.split(" ")[1]} </h1>
              <p className="text-[10px]">{me?.email}</p>
            </div>


          </div>
          <SidebarSeparator>

          </SidebarSeparator>
         
          <SidebarGroupContent className="py-2">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarSeparator></SidebarSeparator>
              <SidebarMenu>
                <SidebarGroupLabel>Ações</SidebarGroupLabel>
                <SidebarMenuItem>

                  <SidebarMenuButton>
                    <div className=" cursor-pointer flex justify-center items-center gap-2" >
                      <CirclePlus />
                      <DialogCreatePost  onClose={() =>  {}} isUpdated={false}>
                        <h1>Criar</h1>
                      </DialogCreatePost>
                    </div>
                  </SidebarMenuButton>


                </SidebarMenuItem>
              </SidebarMenu>


            </SidebarMenu>

          </SidebarGroupContent>
        </SidebarGroup>
        <div className="absolute  left-5 bottom-9">
          <ModeToggle/>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}