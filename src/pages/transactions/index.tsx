import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { TransactionDialog } from "@/components/transactions/transaction-dialog"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Pencil, Trash2 } from "lucide-react"
import { useTransactions } from "@/hooks/useTransactions"
import { Button } from "@/components/ui/button"
import { PeriodFilter } from "@/components/ui/period-filter"
import type { Period } from "@/components/ui/period-filter"
import { startOfMonth, endOfMonth, subMonths } from "date-fns"

type Transaction = {
    id: string
    description: string
    amount: number
    type: 'income' | 'expense'
    date: string
    category_id: string | null
    categories: { name: string, icon: string } | null
}

export function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)
    const [period, setPeriod] = useState<Period>('current_month')
    const { deleteTransaction } = useTransactions()

    const fetchTransactions = async () => {
        try {
            setLoading(true)

            let query = supabase
                .from('transactions')
                .select('*, categories(*)')
                .order('date', { ascending: false })

            if (period !== 'all') {
                let startDate = new Date(0)
                let endDate = new Date()

                if (period === 'current_month') {
                    startDate = startOfMonth(new Date())
                    endDate = endOfMonth(new Date())
                } else if (period === 'last_month') {
                    const lastMonth = subMonths(new Date(), 1)
                    startDate = startOfMonth(lastMonth)
                    endDate = endOfMonth(lastMonth)
                } else if (period === 'last_3_months') {
                    startDate = startOfMonth(subMonths(new Date(), 2))
                    endDate = endOfMonth(new Date())
                }

                query = query
                    .gte('date', startDate.toLocaleDateString('en-CA'))
                    .lte('date', endDate.toLocaleDateString('en-CA'))
            }

            const { data, error } = await query

            if (error) throw error
            if (data) setTransactions(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTransactions()
    }, [period])

    const handleDelete = async (id: string) => {
        if (confirm("Deseja realmente excluir esta transação?")) {
            const success = await deleteTransaction(id)
            if (success) {
                fetchTransactions()
            }
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Transações</h1>
                    <p className="text-sm text-muted-foreground">Histórico de movimentações.</p>
                </div>
                <div className="flex items-center gap-3">
                    <PeriodFilter value={period} onChange={setPeriod} />
                    <TransactionDialog onSuccess={fetchTransactions} />
                </div>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <p className="animate-pulse text-muted-foreground">Carregando transações...</p>
                    </div>
                ) : transactions.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                            <p>Nenhuma transação encontrada.</p>
                            <p className="text-sm">Comece adicionando uma nova receita ou despesa.</p>
                        </CardContent>
                    </Card>
                ) : (
                    transactions.map((t) => (
                        <Card key={t.id} className="overflow-hidden hover:shadow-sm transition-shadow">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
                                <div className="flex flex-col gap-1">
                                    <span className="font-semibold">{t.description}</span>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <span>{format(new Date(t.date + 'T12:00:00'), "dd 'de' MMM, yyyy", { locale: ptBR })}</span>
                                        <span>•</span>
                                        <span>{t.categories?.name || 'Sem Categoria'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end gap-4 border-t pt-3 sm:border-0 sm:pt-0">
                                    <div className={`font-bold text-lg ${t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {t.type === 'income' ? '+' : '-'}
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(t.amount))}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <TransactionDialog
                                            onSuccess={fetchTransactions}
                                            initialData={{
                                                id: t.id,
                                                description: t.description,
                                                amount: t.amount,
                                                type: t.type,
                                                category_id: t.category_id,
                                                date: t.date
                                            }}
                                            trigger={
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            }
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-rose-500"
                                            onClick={() => handleDelete(t.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
