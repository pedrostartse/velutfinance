import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, Wallet, Target, LogOut, PieChart } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Transações", href: "/transactions", icon: Wallet },
    { name: "Metas", href: "/goals", icon: Target },
]

export function Sidebar() {
    const location = useLocation()

    return (
        <div className="flex h-screen w-64 flex-col border-r bg-card px-4 py-6">
            <div className="flex items-center gap-2 px-2">
                <PieChart className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">FinControl</span>
            </div>

            <nav className="mt-10 flex-1 space-y-2">
                {navItems.map((item) => (
                    <Link to={item.href} key={item.href}>
                        <Button
                            variant={location.pathname === item.href ? "secondary" : "ghost"}
                            className={cn("w-full justify-start gap-2",
                                location.pathname === item.href && "bg-secondary"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                        </Button>
                    </Link>
                ))}
            </nav>

            <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive">
                <LogOut className="h-4 w-4" />
                Sair
            </Button>
        </div>
    )
}
