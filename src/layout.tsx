import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../src/components/app-sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <SidebarProvider>
      <main className="w-screen h-screen flex bg-sidebar overflow-hidden relative">
        <AppSidebar />

        {/* Trigger */}
        <SidebarTrigger
          className="
            sm:hidden
            absolute
            top-4
            left-4
            z-50
            md:left-6
            text-white 
            bg-accent/70
          "
        />

        {/* Conteúdo */}
        <section className="flex-1 overflow-auto no-scrollbar">
          <Outlet />
        </section>
      </main>
    </SidebarProvider>
  );
}
