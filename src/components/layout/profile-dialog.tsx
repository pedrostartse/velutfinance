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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Copy, Check, Mail, Shield, LogOut, CalendarClock, CreditCard } from "lucide-react"

interface ProfileDialogProps {
    trigger: React.ReactNode
    showLogout?: boolean
}

export function ProfileDialog({ trigger, showLogout }: ProfileDialogProps) {
    const navigate = useNavigate()
    const [user, setUser] = useState<{ email?: string; id: string } | null>(null)
    const [copied, setCopied] = useState(false)
    const [closingDay, setClosingDay] = useState<string>("18")
    const [savingSettings, setSavingSettings] = useState(false)
    const [saveSuccess, setSaveSuccess] = useState(false)

    useEffect(() => {
        async function loadProfile() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUser({ email: user.email, id: user.id })

                // Load settings
                const { data: settings } = await supabase
                    .from('user_settings')
                    .select('card_closing_day')
                    .eq('user_id', user.id)
                    .single()

                if (settings) {
                    setClosingDay(settings.card_closing_day.toString())
                }
            }
        }
        loadProfile()
    }, [])

    const handleSaveSettings = async () => {
        if (!user) return

        const day = parseInt(closingDay)
        if (isNaN(day) || day < 1 || day > 31) {
            alert("Por favor, insira um dia válido (1-31)")
            return
        }

        try {
            setSavingSettings(true)
            const { error } = await supabase
                .from('user_settings')
                .upsert({
                    user_id: user.id,
                    card_closing_day: day,
                    updated_at: new Date().toISOString()
                })

            if (error) throw error

            setSaveSuccess(true)
            setTimeout(() => setSaveSuccess(false), 3000)
        } catch (error) {
            console.error('Error saving settings:', error)
            alert('Erro ao salvar configurações')
        } finally {
            setSavingSettings(false)
        }
    }

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

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b">
                            <CreditCard className="h-4 w-4 text-primary" />
                            <h3 className="text-sm font-semibold">Configurações do Cartão</h3>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="closingDay">Dia de Fechamento da Fatura</Label>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <div className="relative flex-1">
                                    <CalendarClock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="closingDay"
                                        type="number"
                                        min={1}
                                        max={31}
                                        className="pl-9 w-full"
                                        value={closingDay}
                                        onChange={(e) => {
                                            setClosingDay(e.target.value)
                                            setSaveSuccess(false)
                                        }}
                                    />
                                </div>
                                <Button
                                    onClick={handleSaveSettings}
                                    disabled={savingSettings || saveSuccess}
                                    className={`w-full sm:w-auto transition-all ${saveSuccess ? "bg-emerald-500 hover:bg-emerald-600 text-white" : ""}`}
                                >
                                    {savingSettings ? (
                                        "Salvando..."
                                    ) : saveSuccess ? (
                                        <>
                                            <Check className="h-4 w-4 mr-2" />
                                            Salvo!
                                        </>
                                    ) : (
                                        "Salvar"
                                    )}
                                </Button>
                            </div>
                            <p className="text-[11px] text-muted-foreground">
                                O ciclo da fatura será calculado com base neste dia.
                            </p>
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
