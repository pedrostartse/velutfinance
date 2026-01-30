import { motion } from "framer-motion"
import { TrendingUp, Plus, ArrowUpRight, ArrowDownRight, Briefcase, PieChart, Trash2, RefreshCw, Pencil, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useInvestments } from "@/hooks/useInvestments"
import { AnimatedNumber } from "@/components/ui/animated-number"
import { InvestmentDialog } from "@/components/investments/investment-dialog"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export function InvestmentsPage() {
    const { investments, loading, deleteInvestment, refresh } = useInvestments()

    const totalInvested = investments.reduce((acc, inv) => acc + (inv.quantity * inv.average_price), 0)
    const currentTotal = investments.reduce((acc, inv) => acc + (inv.quantity * (inv.current_price || inv.average_price)), 0)
    const totalProfit = currentTotal - totalInvested
    const profitPercentage = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0

    return (
        <div className="space-y-8 pb-10">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Investimentos</h1>
                    <p className="text-muted-foreground mt-1">Acompanhe seu patrimônio em tempo real.</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 text-muted-foreground hover:text-primary bg-background border"
                        onClick={() => refresh()}
                        title="Atualizar cotações"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    <InvestmentDialog
                        trigger={
                            <Button className="gap-2 shadow-lg shadow-primary/20">
                                <Plus className="h-4 w-4" />
                                Novo Ativo
                            </Button>
                        }
                    />
                </div>
            </header>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="overflow-hidden border-none bg-gradient-to-br from-primary/10 via-primary/5 to-transparent shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Patrimônio Atual</CardTitle>
                            <Briefcase className="w-4 h-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold tracking-tighter sm:text-3xl">
                                <AnimatedNumber value={currentTotal} />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Valor total de todos os ativos
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Total Investido</CardTitle>
                            <PieChart className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold tracking-tighter sm:text-3xl">
                                <AnimatedNumber value={totalInvested} />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Capital inicial aplicado
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Rentabilidade Total</CardTitle>
                            {totalProfit >= 0 ? (
                                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                            ) : (
                                <ArrowDownRight className="w-4 h-4 text-rose-500" />
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold tracking-tighter sm:text-3xl ${totalProfit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                <AnimatedNumber value={totalProfit} />
                            </div>
                            <p className={`text-xs font-bold mt-1 ${totalProfit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {totalProfit >= 0 ? '+' : ''}{profitPercentage.toFixed(2)}% de lucro/prejuízo
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Assets List */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold px-1">Meus Ativos</h2>
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                ) : investments.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                            <TrendingUp className="h-10 w-10 mb-4 opacity-20" />
                            <p>Você ainda não cadastrou nenhum investimento.</p>
                            <p className="text-sm">Clique em "Novo Ativo" para começar.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {investments.map((inv, index) => {
                            const currentVal = inv.quantity * (inv.current_price || inv.average_price)
                            const investedVal = inv.quantity * inv.average_price
                            const profit = currentVal - investedVal
                            const profitPer = investedVal > 0 ? (profit / investedVal) * 100 : 0

                            return (
                                <motion.div
                                    key={inv.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 * index }}
                                >
                                    <Card className="group hover:shadow-lg transition-all border-primary/10 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <CardContent className="p-5">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="font-bold text-xl group-hover:text-primary transition-colors truncate tracking-tight">{inv.symbol || inv.name}</h3>
                                                </div>
                                                <div className="flex items-center">
                                                    <div className="flex opacity-0 group-hover:opacity-100 transition-all transform translate-x-1 group-hover:translate-x-0">
                                                        <InvestmentDialog
                                                            initialData={inv}
                                                            trigger={
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/5">
                                                                    <Pencil className="h-3.5 w-3.5" />
                                                                </Button>
                                                            }
                                                        />
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                                                            onClick={() => {
                                                                if (confirm('Deseja excluir este ativo?')) deleteInvestment(inv.id)
                                                            }}
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4 mb-6">
                                                <div className="flex justify-between items-end border-b border-dashed pb-2">
                                                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Valor Atual</span>
                                                    <span className="font-bold text-xl tracking-tight"><AnimatedNumber value={currentVal} /></span>
                                                </div>

                                                {inv.type !== 'fixed_income' ? (
                                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                                        <div className="space-y-0.5">
                                                            <p className="text-[10px] text-muted-foreground uppercase font-semibold">Preço Médio</p>
                                                            <p className="font-medium text-sm text-foreground/90">R$ {inv.average_price.toFixed(2)}</p>
                                                        </div>
                                                        <div className="space-y-0.5 text-right">
                                                            <p className="text-[10px] text-muted-foreground uppercase font-semibold">Preço Atual</p>
                                                            <p className="font-medium text-sm text-foreground/90">R$ {(inv.current_price || inv.average_price).toFixed(2)}</p>
                                                        </div>
                                                        <div className="space-y-0.5">
                                                            <p className="text-[10px] text-muted-foreground uppercase font-semibold">Quantidade</p>
                                                            <p className="font-medium text-sm text-foreground/90">{inv.quantity}</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-0.5">
                                                        <p className="text-[10px] text-muted-foreground uppercase font-semibold">Valor Aplicado</p>
                                                        <p className="font-medium text-sm text-foreground/90">R$ {inv.average_price.toFixed(2)}</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-auto pt-4 border-t flex items-center justify-between">
                                                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
                                                    <Calendar className="h-3 w-3 opacity-70" />
                                                    {format(new Date(inv.created_at), "dd/MM/yyyy", { locale: ptBR })}
                                                </div>
                                                <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${profit >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                                                    }`}>
                                                    {profit >= 0 ? '+' : ''}{profitPer.toFixed(1)}%
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
