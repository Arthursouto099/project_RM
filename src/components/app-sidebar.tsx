import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import {UserIcon} from "lucide-react"

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
import useAuth from "@/hooks/useAuth"
import { useLocation, useNavigate } from "react-router-dom"

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

export function AppSidebar() {
    const {payload} = useAuth()
    const navigate = useNavigate()
    const location = useLocation()


    const navigateToMe = () => {
        navigate("/me", {replace: true, state: {from: location}})
    }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
            <div className="p-4 flex gap-2 cursor-pointer items-center" onClick={navigateToMe}>
                <div className="bg-accent-light rounded-md p-1"><UserIcon className="text-background-light"/></div>
                <h1 className="text-[12px] font-semibold">{payload?.name}</h1>
                
            </div>
            <SidebarSeparator>

            </SidebarSeparator>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}