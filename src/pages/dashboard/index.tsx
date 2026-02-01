import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { ArrowUpCircle, ArrowDownCircle, DollarSign, Briefcase, TrendingUp, CreditCard } from "lucide-react"
import { TransactionDialog } from "@/components/transactions/transaction-dialog"

import { useNavigate } from "react-router-dom"
import { useDashboardData } from "@/hooks/useDashboardData"
import { useState } from "react"
import { PeriodFilter } from "@/components/ui/period-filter"
import type { Period } from "@/components/ui/period-filter"
import { motion } from "framer-motion"
import { AnimatedNumber } from "@/components/ui/animated-number"

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

export function Dashboard() {
    const navigate = useNavigate()
    const [period, setPeriod] = useState<Period>('current_month')
    const { data: dashboardData, loading } = useDashboardData(period)

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-muted-foreground animate-pulse">Carregando dados do painel...</p>
            </div>
        )
    }

    const { balance, income, expense, creditInvoice, totalInvested, totalPatrimony, creditCycleLabel, recentTransactions, categoryStats } = dashboardData

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-sm text-muted-foreground">Bem-vindo ao seu controle financeiro.</p>
                </div>
                <div className="flex items-center gap-3">
                    <PeriodFilter value={period} onChange={setPeriod} />
                    <TransactionDialog />
                </div>
            </motion.div>

            {/* Summary Cards */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
            >
                <motion.div variants={itemVariants} className="sm:col-span-2 lg:col-span-1">
                    <Card
                        className="h-full cursor-pointer hover:shadow-md transition-all border-none bg-gradient-to-br from-primary/20 via-primary/10 to-transparent shadow-sm active:scale-95"
                        onClick={() => navigate('/investments')}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Patrimônio Total</CardTitle>
                            <Briefcase className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl md:text-2xl font-bold text-primary truncate">
                                <AnimatedNumber value={totalPatrimony} />
                            </div>
                            <p className="text-xs text-muted-foreground">Saldo + Investimentos</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card
                        className="h-full cursor-pointer hover:shadow-md transition-all bg-card shadow-sm border-primary/20 active:scale-95"
                        onClick={() => navigate('/investments')}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Investimentos</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl md:text-2xl font-bold truncate">
                                <AnimatedNumber value={totalInvested} />
                            </div>
                            <p className="text-xs text-muted-foreground">Valor atual de mercado</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card
                        className="h-full cursor-pointer hover:shadow-md transition-all active:scale-95 shadow-sm"
                        onClick={() => navigate('/transactions')}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Saldo (Débito)</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl md:text-2xl font-bold truncate">
                                <AnimatedNumber value={balance} />
                            </div>
                            <p className="text-xs text-muted-foreground">Dinheiro disponível</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card
                        className="h-full cursor-pointer hover:shadow-md transition-all hover:border-emerald-200 active:scale-95 shadow-sm"
                        onClick={() => navigate('/transactions?type=income')}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Receitas</CardTitle>
                            <ArrowUpCircle className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl md:text-2xl font-bold text-emerald-500 truncate">
                                <AnimatedNumber value={income} />
                            </div>
                            <p className="text-xs text-muted-foreground">Entradas no período</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card
                        className="h-full cursor-pointer hover:shadow-md transition-all hover:border-rose-200 active:scale-95 shadow-sm"
                        onClick={() => navigate('/transactions?type=expense')}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Despesas</CardTitle>
                            <ArrowDownCircle className="h-4 w-4 text-rose-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl md:text-2xl font-bold text-rose-500 truncate">
                                <AnimatedNumber value={expense} />
                            </div>
                            <p className="text-xs text-muted-foreground">Saídas no período</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card
                        className="h-full border-orange-200 bg-orange-50/10 cursor-pointer hover:shadow-md transition-all hover:border-orange-400 active:scale-95 shadow-sm"
                        onClick={() => navigate('/transactions?method=credit')}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Fatura</CardTitle>
                            <CreditCard className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl md:text-2xl font-bold text-orange-600 truncate">
                                <AnimatedNumber value={creditInvoice} />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {creditCycleLabel ? `Ciclo: ${creditCycleLabel}` : 'Gastos no crédito'}
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

            {/* Charts area */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-7"
            >
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
            </motion.div>
        </div>
    )
}
