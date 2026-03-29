import { Sidebar, SidebarProvider } from "@/components/ui/sidebar"
import { HomeNavbar } from "../../components/home-navbar"
import { HomeSidebar } from "../../components/home-sidebar"

interface HomeLayoutProps {
    children: React.ReactNode
}

export function HomeLayout({children} : HomeLayoutProps) {
  return (
    <SidebarProvider defaultOpen={false}>
        <div className="w-full ">
            <HomeNavbar />
            <div className="pt-16 min-h-screen flex relative">
               <HomeSidebar/>
                <main className="flex-1 overflow-y-auto"> 
                    {children}
                </main>                 
            </div>            
         </div>
     
    </SidebarProvider>
  )
}

