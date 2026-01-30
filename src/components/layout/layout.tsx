import { Sidebar } from "./sidebar"
import { MobileNav } from "./mobile-nav"
import { Outlet } from "react-router-dom"

export function Layout() {
    return (
        <div className="flex min-h-screen w-full flex-col bg-background md:flex-row">
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-muted/10 p-4 pb-24 md:p-8">
                <Outlet />
            </main>

            {/* Mobile Navigation */}
            <MobileNav />
        </div>
    )
}
