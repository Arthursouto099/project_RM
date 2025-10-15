import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "../src/components/app-sidebar"
import { Outlet } from "react-router-dom"

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className=" bg-sidebar overflow-y-hidden h-screen w-screen">
        <div className="block md:hidden">
          <SidebarTrigger />
        </div>
        <Outlet /> {/* Renderiza as rotas filhas com o layout que estabeleci */}
      </main>
    </SidebarProvider>
  );
}