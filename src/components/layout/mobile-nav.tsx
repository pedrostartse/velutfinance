import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, Wallet, Target, Plus, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { TransactionDialog } from "../transactions/transaction-dialog"
import { supabase } from "@/lib/supabase"

const navItemsStart = [
    { name: "Home", href: "/", icon: LayoutDashboard },
    { name: "Transações", href: "/transactions", icon: Wallet },
]

const navItemsEnd = [
    { name: "Metas", href: "/goals", icon: Target },
]

export function MobileNav() {
    const location = useLocation()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        window.location.reload()
    }

    const NavLink = ({ item }: { item: typeof navItemsStart[0] }) => {
        const isActive = location.pathname === item.href
        return (
            <Link to={item.href} className="flex flex-col items-center gap-1 relative">
                <div
                    className={cn(
                        "rounded-full p-2 transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground"
                    )}
                >
                    <item.icon className="h-6 w-6" />
                    {isActive && (
                        <motion.div
                            layoutId="mobile-nav-indicator"
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary"
                        />
                    )}
                </div>
            </Link>
        )
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 border-t bg-card/80 backdrop-blur-lg px-2 py-3 pb-6 md:hidden z-40">
            <div className="grid grid-cols-5 items-center justify-items-center relative">
                {navItemsStart.map((item) => (
                    <NavLink key={item.href} item={item} />
                ))}

                <div className="flex justify-center relative scale-110 -top-2">
                    <TransactionDialog
                        trigger={
                            <button
                                className="rounded-full bg-primary p-4 text-primary-foreground shadow-xl transition-all active:scale-90 hover:shadow-primary/20"
                                aria-label="Nova Transação"
                            >
                                <Plus className="h-6 w-6" />
                            </button>
                        }
                    />
                </div>

                {navItemsEnd.map((item) => (
                    <NavLink key={item.href} item={item} />
                ))}

                <button
                    onClick={handleLogout}
                    className="flex flex-col items-center gap-1 text-muted-foreground p-2"
                >
                    <LogOut className="h-6 w-6" />
                </button>
            </div>
        </div>
    )
}
