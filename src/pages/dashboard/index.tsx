import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { ArrowUpCircle, ArrowDownCircle, DollarSign, Briefcase, TrendingUp, CreditCard, Sparkles, Plus, ArrowRight } from "lucide-react"
import { TransactionDialog } from "@/components/transactions/transaction-dialog"
import { Button } from "@/components/ui/button"

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

    const { balance, income, expense, creditInvoice, totalInvested, totalPatrimony, creditCycleLabel, recentTransactions, categoryStats, monthlyStats } = dashboardData

    const isNewUser = recentTransactions.length === 0 && balance === 0 && totalInvested === 0

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

            {isNewUser && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative overflow-hidden rounded-xl border bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6 md:p-8"
                >
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary shrink-0">
                            <Sparkles className="h-8 w-8" />
                        </div>
                        <div className="flex-1 text-center md:text-left space-y-2">
                            <h2 className="text-xl md:text-2xl font-bold">Olá! Vamos começar sua jornada financeira?</h2>
                            <p className="text-muted-foreground text-sm max-w-2xl">
                                Parece que você ainda não registrou nada. Que tal começar adicionando sua primeira transação ou cadastrando seus investimentos para ter uma visão clara do seu patrimônio?
                            </p>
                            <div className="pt-4 flex flex-wrap justify-center md:justify-start gap-4">
                                <TransactionDialog
                                    trigger={
                                        <Button className="gap-2 shadow-lg shadow-primary/20">
                                            <Plus className="h-4 w-4" />
                                            Primeira Transação
                                        </Button>
                                    }
                                />
                                <Button variant="outline" className="gap-2" onClick={() => navigate('/investments')}>
                                    Ver Investimentos
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                    {/* Visual sugar */}
                    <div className="absolute top-[-20%] right-[-5%] h-64 w-64 bg-primary/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-[-20%] left-[-5%] h-64 w-64 bg-primary/3 rounded-full blur-3xl" />
                </motion.div>
            )}

            {/* Summary Cards */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4"
            >
                {/* HERO CARD: Saldo */}
                <motion.div variants={itemVariants} className="sm:col-span-2 row-span-2">
                    <Card
                        className="h-full cursor-pointer transition-all border-none bg-gradient-to-br from-blue-600 to-indigo-600 shadow-xl active:scale-95 group relative overflow-hidden"
                        onClick={() => navigate('/transactions')}
                    >
                        <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 p-24 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />

                        <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-medium text-white/90">Saldo Disponível</CardTitle>
                            <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                                <DollarSign className="h-5 w-5 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10 pt-4">
                            <div className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                                <AnimatedNumber value={balance} />
                            </div>
                            <p className="text-blue-100 mt-2 text-sm font-medium opacity-90">
                                Dinheiro em conta
                            </p>
                            <div className="mt-8 flex gap-3">
                                <Button variant="secondary" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-md" onClick={(e) => { e.stopPropagation(); navigate('/transactions?type=income'); }}>
                                    <ArrowUpCircle className="mr-2 h-4 w-4" />
                                    Receita
                                </Button>
                                <Button variant="secondary" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-md" onClick={(e) => { e.stopPropagation(); navigate('/transactions?type=expense'); }}>
                                    <ArrowDownCircle className="mr-2 h-4 w-4" />
                                    Despesa
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants} className="sm:col-span-1">
                    <Card
                        className="h-full glass-card cursor-pointer hover:shadow-lg transition-all border-white/5 active:scale-95"
                        onClick={() => navigate('/investments')}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Patrimônio</CardTitle>
                            <Briefcase className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground truncate">
                                <AnimatedNumber value={totalPatrimony} />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants} className="sm:col-span-1">
                    <Card
                        className="h-full glass-card cursor-pointer hover:shadow-lg transition-all active:scale-95 border-white/5"
                        onClick={() => navigate('/investments')}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Investimentos</CardTitle>
                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold truncate">
                                <AnimatedNumber value={totalInvested} />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card
                        className="h-full glass-card cursor-pointer hover:shadow-lg transition-all active:scale-95 border-white/5 hover:border-emerald-500/30"
                        onClick={() => navigate('/transactions?type=income')}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Receitas</CardTitle>
                            <ArrowUpCircle className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold text-emerald-500 truncate">
                                <AnimatedNumber value={income} />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card
                        className="h-full glass-card cursor-pointer hover:shadow-lg transition-all active:scale-95 border-white/5 hover:border-rose-500/30"
                        onClick={() => navigate('/transactions?type=expense')}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Despesas</CardTitle>
                            <ArrowDownCircle className="h-4 w-4 text-rose-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold text-rose-500 truncate">
                                <AnimatedNumber value={expense} />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants} className="sm:col-span-2">
                    <Card
                        className="h-full glass-card cursor-pointer hover:shadow-lg transition-all active:scale-95 border-white/5 hover:border-orange-500/30"
                        onClick={() => navigate('/transactions?method=credit')}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Fatura Atual</CardTitle>
                            <CreditCard className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-2xl font-bold text-orange-500 truncate">
                                        <AnimatedNumber value={creditInvoice} />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {creditCycleLabel ? `Ciclo: ${creditCycleLabel}` : 'Gastos no crédito'}
                                    </p>
                                </div>
                                <Button size="sm" variant="ghost" className="h-8 text-orange-500 hover:text-orange-400 hover:bg-orange-500/10">
                                    Ver Fatura <ArrowRight className="ml-2 h-3 w-3" />
                                </Button>
                            </div>
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
                <Card className="md:col-span-2 lg:col-span-4 transition-all hover:shadow-md border-none bg-gradient-to-br from-white/5 to-white/0">
                    <CardHeader>
                        <CardTitle>Fluxo de Caixa (6 meses)</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyStats}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `R$${value}`}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        content={({ active, payload, label }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="glass-card p-3 rounded-lg border border-white/10 shadow-xl">
                                                        <p className="text-sm font-semibold text-white mb-2">{label}</p>
                                                        {payload.map((p: any) => (
                                                            <div key={p.name} className="flex items-center gap-2 text-xs mb-1">
                                                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: p.fill }} />
                                                                <span className="text-muted-foreground capitalize">{p.name === 'income' ? 'Receita' : 'Despesa'}:</span>
                                                                <span className="font-medium text-white">
                                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(p.value))}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )
                                            }
                                            return null
                                        }}
                                    />
                                    <Legend />
                                    <Bar dataKey="income" name="Receita" fill="#10b981" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="expense" name="Despesa" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2 lg:col-span-3 transition-all hover:shadow-md border-none bg-gradient-to-br from-white/5 to-white/0">
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
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    const data = payload[0].payload
                                                    return (
                                                        <div className="glass-card p-2 px-3 rounded-lg border border-white/10 shadow-xl">
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: data.color }} />
                                                                <span className="text-xs font-medium text-white">{data.name}</span>
                                                            </div>
                                                            <p className="text-sm font-bold text-white mt-1">
                                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(data.value))}
                                                            </p>
                                                        </div>
                                                    )
                                                }
                                                return null
                                            }}
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
