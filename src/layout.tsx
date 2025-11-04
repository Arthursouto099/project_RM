import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "../src/components/app-sidebar"
import { Outlet } from "react-router-dom"

export default function Layout() {
  return (
    <SidebarProvider>
       <main className="w-screen h-screen bg-sidebar flex">
          <AppSidebar/>

           <Outlet/>
       </main>
    </SidebarProvider>
  );
}