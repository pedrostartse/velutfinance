import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { TransactionDialog } from "@/components/transactions/transaction-dialog"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Pencil, Trash2 } from "lucide-react"
import { useTransactions } from "@/hooks/useTransactions"
import { Button } from "@/components/ui/button"

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
    const { deleteTransaction } = useTransactions()

    const fetchTransactions = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('transactions')
                .select('*, categories(*)')
                .order('date', { ascending: false })

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
    }, [])

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
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Transações</h1>
                <TransactionDialog onSuccess={fetchTransactions} />
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
                            <div className="flex items-center justify-between p-4">
                                <div className="flex flex-col gap-1">
                                    <span className="font-semibold">{t.description}</span>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <span>{format(new Date(t.date), "dd 'de' MMM, yyyy", { locale: ptBR })}</span>
                                        <span>•</span>
                                        <span>{t.categories?.name || 'Sem Categoria'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className={`font-bold ${t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
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
