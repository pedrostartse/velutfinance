import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { User, Copy, Check, Mail, Shield, LogOut } from "lucide-react"

interface ProfileDialogProps {
    trigger: React.ReactNode
    showLogout?: boolean
}

export function ProfileDialog({ trigger, showLogout }: ProfileDialogProps) {
    const navigate = useNavigate()
    const [user, setUser] = useState<{ email?: string; id: string } | null>(null)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                setUser({ email: user.email, id: user.id })
            }
        })
    }, [])

    const handleLogout = async () => {
        if (confirm('Deseja realmente sair?')) {
            await supabase.auth.signOut()
            navigate("/login")
        }
    }

    const copyId = () => {
        if (user) {
            navigator.clipboard.writeText(user.id)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        Perfil do Usuário
                    </DialogTitle>
                    <DialogDescription>
                        Informações da sua conta e identificação única.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-4">
                        <div className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30">
                            <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-sm font-medium leading-none text-muted-foreground uppercase text-[10px] tracking-wider">E-mail</p>
                                <p className="text-sm font-semibold">{user?.email}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30">
                            <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="space-y-1 flex-1 text-left">
                                <p className="text-sm font-medium leading-none text-muted-foreground uppercase text-[10px] tracking-wider">ID Único (UUID)</p>
                                <div className="flex items-center justify-between gap-2 mt-1">
                                    <code className="text-[11px] font-mono bg-background px-2 py-1 rounded border break-all flex-1">
                                        {user?.id}
                                    </code>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 shrink-0"
                                        onClick={copyId}
                                    >
                                        {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-[11px] text-muted-foreground bg-primary/5 p-3 rounded-lg border border-primary/10 italic">
                        Nota: Este ID é utilizado para identificar seus dados no banco de dados de forma segura através do Row Level Security (RLS).
                    </div>

                    {showLogout && (
                        <div className="pt-2">
                            <Button
                                variant="ghost"
                                className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-11 px-3 transition-colors"
                                onClick={handleLogout}
                            >
                                <LogOut className="h-4 w-4" />
                                Sair da Conta
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
