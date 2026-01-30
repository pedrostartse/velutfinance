import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, Wallet, Target, LogOut, PieChart, CalendarDays, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import { useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"

const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Transações", href: "/transactions", icon: Wallet },
    { name: "Metas", href: "/goals", icon: Target },
    { name: "Investimentos", href: "/investments", icon: TrendingUp },
    { name: "Assinaturas", href: "/subscriptions", icon: CalendarDays },
]

export function Sidebar() {
    const location = useLocation()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate("/login")
    }

    return (
        <div className="flex h-screen w-64 flex-col border-r bg-card py-6">
            <div className="flex items-center gap-2 px-6">
                <PieChart className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">FinControl</span>
            </div>

            <div className="mt-10 flex-1 flex flex-col gap-2 px-3 overflow-y-auto">
                <nav className="space-y-2">
                    {navItems.map((item) => (
                        <Link to={item.href} key={item.href} className="block">
                            <Button
                                variant={location.pathname === item.href ? "secondary" : "ghost"}
                                className={cn("w-full justify-start gap-2 h-10 px-3",
                                    location.pathname === item.href && "bg-secondary"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.name}
                            </Button>
                        </Link>
                    ))}
                </nav>

                <div className="mt-4 pt-4 border-t">
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-10 px-3"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-4 w-4" />
                        Sair
                    </Button>
                </div>
            </div>
        </div>
    )
}
