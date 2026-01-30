import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { ArrowUpCircle, ArrowDownCircle, DollarSign, CalendarDays, CreditCard } from "lucide-react"
import { TransactionDialog } from "@/components/transactions/transaction-dialog"

import { useDashboardData } from "@/hooks/useDashboardData"
import { supabase } from "@/lib/supabase"

import { useState, useEffect } from "react"
import { PeriodFilter } from "@/components/ui/period-filter"
import type { Period } from "@/components/ui/period-filter"

export function Dashboard() {
    const [period, setPeriod] = useState<Period>('current_month')
    const { data: dashboardData, loading } = useDashboardData(period)
    const [subTotal, setSubTotal] = useState(0)

    useEffect(() => {
        const fetchSubs = async () => {
            const { data } = await supabase.from('subscriptions').select('amount').eq('active', true)
            if (data) setSubTotal(data.reduce((acc: number, s: { amount: number }) => acc + Number(s.amount), 0))
        }
        fetchSubs()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-muted-foreground animate-pulse">Carregando dados do painel...</p>
            </div>
        )
    }

    const { balance, income, expense, creditInvoice, recentTransactions, categoryStats } = dashboardData

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-sm text-muted-foreground">Bem-vindo ao seu controle financeiro.</p>
                </div>
                <div className="flex items-center gap-3">
                    <PeriodFilter value={period} onChange={setPeriod} />
                    <TransactionDialog />
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                <Card className="col-span-2 md:col-span-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Saldo em Conta</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance)}
                        </div>
                        <p className="text-xs text-muted-foreground">Dinheiro disponível (Débito)</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Receitas</CardTitle>
                        <ArrowUpCircle className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-500">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(income)}
                        </div>
                        <p className="text-xs text-muted-foreground">Entradas no período</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Despesas</CardTitle>
                        <ArrowDownCircle className="h-4 w-4 text-rose-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-rose-500">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(expense)}
                        </div>
                        <p className="text-xs text-muted-foreground">Saídas no período</p>
                    </CardContent>
                </Card>
                <Card className="border-orange-200 bg-orange-50/30">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Fatura (Crédito)</CardTitle>
                        <CreditCard className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(creditInvoice)}
                        </div>
                        <p className="text-xs text-muted-foreground">Gasto pendente no cartão</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Assinaturas</CardTitle>
                        <CalendarDays className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subTotal)}
                        </div>
                        <p className="text-xs text-muted-foreground">Custo fixo mensal ativo</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts area */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="md:col-span-2 lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Gastos por Categoria</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            {categoryStats.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoryStats}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {categoryStats.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value: any) =>
                                                new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value) || 0)
                                            }
                                        />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
                                    <p>Sem dados de despesas</p>
                                    <p className="text-sm">Adicione despesas para ver o gráfico.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2 lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Últimas Transações</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentTransactions.length > 0 ? (
                                recentTransactions.map((t) => (
                                    <div key={t.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium leading-none">{t.description}</p>
                                                <span className={cn(
                                                    "text-[9px] px-1 py-0 rounded-full uppercase font-bold",
                                                    t.payment_method === 'credit'
                                                        ? "bg-orange-100 text-orange-600 border border-orange-200"
                                                        : "bg-blue-100 text-blue-600 border border-blue-200"
                                                )}>
                                                    {t.payment_method === 'credit' ? 'C' : 'D'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{t.categories?.name || 'Sem Categoria'}</p>
                                        </div>
                                        <div className={`font-medium ${t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                            {t.type === 'income' ? '+' : '-'}
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(t.amount))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex h-[200px] flex-col items-center justify-center text-center text-muted-foreground italic">
                                    <p>Nenhuma transação recente</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
