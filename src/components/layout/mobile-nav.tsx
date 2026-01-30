import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, Wallet, Target, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { TransactionDialog } from "../transactions/transaction-dialog"

const navItems = [
    { name: "Home", href: "/", icon: LayoutDashboard },
    { name: "Transações", href: "/transactions", icon: Wallet },
    { name: "Metas", href: "/goals", icon: Target },
]

export function MobileNav() {
    const location = useLocation()

    return (
        <div className="fixed bottom-0 left-0 right-0 border-t bg-card px-6 py-3 pb-6 md:hidden">
            <div className="flex items-center justify-between">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.href
                    return (
                        <Link to={item.href} key={item.href} className="flex flex-col items-center gap-1">
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
                                        className="absolute mt-8 h-1 w-1 rounded-full bg-primary"
                                    />
                                )}
                            </div>
                        </Link>
                    )
                })}
                <TransactionDialog
                    trigger={
                        <button
                            className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-full bg-primary p-4 text-primary-foreground shadow-lg transition-transform active:scale-95 z-50"
                            aria-label="Nova Transação"
                        >
                            <Plus className="h-6 w-6" />
                        </button>
                    }
                />
            </div>
        </div>
    )
}
