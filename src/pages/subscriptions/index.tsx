import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SubscriptionDialog } from "@/components/subscriptions/subscription-dialog"
import { Pencil, Trash2, Calendar } from "lucide-react"
import { useSubscriptions } from "@/hooks/useSubscriptions"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

type Subscription = {
    id: string
    name: string
    amount: number
    billing_day: number
    active: boolean
    category_id: string | null
    categories: { name: string } | null
}

export function SubscriptionsPage() {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
    const [loading, setLoading] = useState(true)
    const { deleteSubscription, toggleSubscriptionStatus } = useSubscriptions()

    const fetchSubscriptions = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('subscriptions')
                .select('*, categories(name)')
                .order('name')

            if (error) throw error
            if (data) setSubscriptions(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSubscriptions()
    }, [])

    const handleDelete = async (id: string) => {
        if (confirm("Deseja realmente excluir esta assinatura?")) {
            const success = await deleteSubscription(id)
            if (success) fetchSubscriptions()
        }
    }

    const handleToggle = async (id: string, currentStatus: boolean) => {
        const success = await toggleSubscriptionStatus(id, currentStatus)
        if (success) fetchSubscriptions()
    }

    const totalActive = subscriptions
        .filter(s => s.active)
        .reduce((acc, curr) => acc + Number(curr.amount), 0)

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Assinaturas</h1>
                    <p className="text-muted-foreground">Gerencie seus custos fixos mensais.</p>
                </div>
                <SubscriptionDialog onSuccess={fetchSubscriptions} />
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card className="md:col-span-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Custo Mensal Ativo</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalActive)}
                        </div>
                        <p className="text-xs text-muted-foreground">Total das assinaturas ativas</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <p className="animate-pulse text-muted-foreground">Carregando assinaturas...</p>
                ) : subscriptions.length === 0 ? (
                    <Card className="md:col-span-3">
                        <CardContent className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                            <p>Nenhuma assinatura encontrada.</p>
                            <p className="text-sm">Adicione sua primeira assinatura mensal!</p>
                        </CardContent>
                    </Card>
                ) : (
                    subscriptions.map((s) => (
                        <Card key={s.id} className={!s.active ? "opacity-60" : ""}>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-lg">{s.name}</h3>
                                        <p className="text-sm text-muted-foreground">{s.categories?.name || 'Sem Categoria'}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="text-xl font-bold">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(s.amount)}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] uppercase font-bold text-muted-foreground">
                                                {s.active ? 'Ativa' : 'Pausada'}
                                            </span>
                                            <Switch
                                                checked={s.active}
                                                onCheckedChange={() => handleToggle(s.id, s.active)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                                    <Calendar className="h-4 w-4" />
                                    <span>Vence todo dia {s.billing_day}</span>
                                </div>
                                <div className="flex items-center justify-end gap-2 pt-4 border-t">
                                    <SubscriptionDialog
                                        onSuccess={fetchSubscriptions}
                                        initialData={{
                                            id: s.id,
                                            name: s.name,
                                            amount: s.amount,
                                            billing_day: s.billing_day,
                                            category_id: s.category_id,
                                            active: s.active
                                        }}
                                        trigger={
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        }
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => handleDelete(s.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
