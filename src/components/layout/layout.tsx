import { Sidebar } from "./sidebar"
import { MobileNav } from "./mobile-nav"
import { Outlet } from "react-router-dom"
import { PieChart } from "lucide-react"

export function Layout() {
    return (
        <div className="flex min-h-screen w-full flex-col bg-background md:flex-row">
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            {/* Mobile Header */}
            <header className="flex items-center gap-2 p-4 border-b bg-card/50 backdrop-blur-md md:hidden sticky top-0 z-40">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <PieChart className="h-5 w-5 text-primary" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">Velut Finance</span>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-muted/10 p-4 pb-24 md:p-8">
                <Outlet />
            </main>

            {/* Mobile Navigation */}
            <MobileNav />
        </div>
    )
}
