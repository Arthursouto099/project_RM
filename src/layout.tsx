import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "../src/components/app-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider >
            <AppSidebar />
            <main className="overflow-hidden w-screen">
                <div className="block md:hidden">
                    <SidebarTrigger />
                </div>
                {children}
            </main>
        </SidebarProvider>
    )
}