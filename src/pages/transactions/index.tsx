import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { TransactionDialog } from "@/components/transactions/transaction-dialog"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Pencil, Trash2, Filter } from "lucide-react"
import { useTransactions } from "@/hooks/useTransactions"
import { Button } from "@/components/ui/button"
import { PeriodFilter } from "@/components/ui/period-filter"
import type { Period } from "@/components/ui/period-filter"
import { startOfMonth, endOfMonth, subMonths } from "date-fns"
import { useSearchParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { AnimatedNumber } from "@/components/ui/animated-number"

type Transaction = {
    id: string
    description: string
    amount: number
    type: 'income' | 'expense'
    date: string
    category_id: string | null
    payment_method: 'debit' | 'credit'
    categories: { name: string, icon: string } | null
}

export function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)
    const [period, setPeriod] = useState<Period>('current_month')
    const [searchParams, setSearchParams] = useSearchParams()

    // Filters
    const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>(
        (searchParams.get('type') as any) || 'all'
    )
    const [methodFilter, setMethodFilter] = useState<'all' | 'debit' | 'credit'>(
        (searchParams.get('method') as any) || 'all'
    )

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

            if (typeFilter !== 'all') {
                query = query.eq('type', typeFilter)
            }

            if (methodFilter !== 'all') {
                query = query.eq('payment_method', methodFilter)
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
        // Sync URL search params
        const params: any = {}
        if (typeFilter !== 'all') params.type = typeFilter
        if (methodFilter !== 'all') params.method = methodFilter
        setSearchParams(params, { replace: true })
    }, [period, typeFilter, methodFilter])

    const handleDelete = async (id: string) => {
        if (confirm("Deseja realmente excluir esta transação?")) {
            const success = await deleteTransaction(id)
            if (success) {
                fetchTransactions()
            }
        }
    }

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Transações</h1>
                    <p className="text-sm text-muted-foreground">Histórico de movimentações detalhado.</p>
                </div>
                <div className="flex items-center gap-3">
                    <PeriodFilter value={period} onChange={setPeriod} />
                    <TransactionDialog onSuccess={fetchTransactions} />
                </div>
            </motion.div>

            {/* Advanced Filters */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
            >
                <Card className="bg-card/50 backdrop-blur-sm border-dashed">
                    <CardContent className="p-3 sm:p-4">
                        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                            <div className="flex items-center gap-2 mr-2 hidden lg:flex">
                                <Filter className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">Filtros</span>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 flex-1 w-full">
                                {/* Reset All Button */}
                                <Button
                                    variant={(typeFilter === 'all' && methodFilter === 'all') ? "secondary" : "ghost"}
                                    size="sm"
                                    className="h-10 px-4 font-bold rounded-lg border border-dashed border-primary/20"
                                    onClick={() => {
                                        setTypeFilter('all')
                                        setMethodFilter('all')
                                    }}
                                >
                                    Ver Tudo
                                </Button>

                                <div className="h-8 w-px bg-border/50 hidden sm:block" />

                                {/* Tipo Filter */}
                                <div className="flex-1 min-w-[140px] sm:flex-none">
                                    <div className="flex bg-muted/60 rounded-lg p-1">
                                        <Button
                                            variant={typeFilter === 'income' ? "secondary" : "ghost"}
                                            size="sm"
                                            className="flex-1 h-8 px-3"
                                            onClick={() => setTypeFilter(typeFilter === 'income' ? 'all' : 'income')}
                                        >
                                            Receitas
                                        </Button>
                                        <Button
                                            variant={typeFilter === 'expense' ? "secondary" : "ghost"}
                                            size="sm"
                                            className="flex-1 h-8 px-3"
                                            onClick={() => setTypeFilter(typeFilter === 'expense' ? 'all' : 'expense')}
                                        >
                                            Despesas
                                        </Button>
                                    </div>
                                </div>

                                {/* Pagamento Filter */}
                                <div className="flex-1 min-w-[140px] sm:flex-none">
                                    <div className="flex bg-muted/60 rounded-lg p-1">
                                        <Button
                                            variant={methodFilter === 'debit' ? "secondary" : "ghost"}
                                            size="sm"
                                            className="flex-1 h-8 px-3"
                                            onClick={() => setMethodFilter(methodFilter === 'debit' ? 'all' : 'debit')}
                                        >
                                            Débito
                                        </Button>
                                        <Button
                                            variant={methodFilter === 'credit' ? "secondary" : "ghost"}
                                            size="sm"
                                            className="flex-1 h-8 px-3"
                                            onClick={() => setMethodFilter(methodFilter === 'credit' ? 'all' : 'credit')}
                                        >
                                            Crédito
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full lg:w-auto lg:ml-auto">
                                <div className="flex items-center justify-between lg:justify-end gap-4 text-sm font-bold bg-background/50 px-4 py-2.5 rounded-xl border border-dashed shadow-sm">
                                    <span className="text-muted-foreground font-medium">Total Filtrado:</span>
                                    <div className={cn(
                                        "text-lg",
                                        transactions.reduce((acc, t) => acc + (t.type === 'income' ? Number(t.amount) : -Number(t.amount)), 0) >= 0
                                            ? "text-emerald-500"
                                            : "text-rose-500"
                                    )}>
                                        <AnimatedNumber value={transactions.reduce((acc, t) => acc + (t.type === 'income' ? Number(t.amount) : -Number(t.amount)), 0)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <div className="space-y-4">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <p className="animate-pulse text-muted-foreground">Carregando transações...</p>
                    </div>
                ) : transactions.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                                <p>Nenhuma transação encontrada.</p>
                                <p className="text-sm">Comece adicionando uma nova receita ou despesa.</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    <div className="space-y-4 relative">
                        <AnimatePresence mode="popLayout">
                            {transactions.map((t) => (
                                <motion.div
                                    key={t.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                >
                                    <Card className="overflow-hidden hover:shadow-sm transition-shadow">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-semibold">{t.description}</p>
                                                    <span className={cn(
                                                        "text-[10px] px-1.5 py-0.5 rounded-full uppercase font-bold",
                                                        t.payment_method === 'credit'
                                                            ? "bg-orange-100 text-orange-600 border border-orange-200"
                                                            : "bg-blue-100 text-blue-600 border border-blue-200"
                                                    )}>
                                                        {t.payment_method === 'credit' ? 'Crédito' : 'Débito'}
                                                    </span>
                                                </div>
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
                                                            date: t.date,
                                                            payment_method: t.payment_method
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
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    )
}
