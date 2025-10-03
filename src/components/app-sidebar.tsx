import {  Home, MessageSquare, Settings, Users2 } from "lucide-react"
import { UserIcon, User2,CirclePlus } from "lucide-react"

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
    icon: User2 ,
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
        <SidebarGroup>
          <div className="p-4 flex gap-2 cursor-pointer items-center" onClick={navigateToMe}>
            <div className="bg-accent-light rounded-md w-11  flex  justify-center items-center"> {me?.profile_image ? (<img className="rounded-md  bg-accent-dark border-1" src={me?.profile_image} alt="" />) : (<UserIcon className=" m-2 text-background-light" />)}
            </div>

            <div>
              <h1 className="text-[15px] font-semibold">{me?.username.split(" ")[0]} {me?.username.split(" ")[1]} </h1>
              <p className="text-[10px]">{me?.email}</p>
            </div>


          </div>
          <SidebarSeparator>

          </SidebarSeparator>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
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
                    <div  className=" cursor-pointer flex justify-center items-center gap-2" >
                      <CirclePlus/>
                      <DialogCreatePost></DialogCreatePost>
                    </div>
                  </SidebarMenuButton>
                 
                
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}