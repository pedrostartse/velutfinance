import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { GoalDialog } from "@/components/goals/goal-dialog"
import { UpdateGoalDialog } from "@/components/goals/update-goal-dialog"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Target, Calendar as CalendarIcon, TrendingUp } from "lucide-react"

type Goal = Database['public']['Tables']['goals']['Row']

export function GoalsPage() {
    const [goals, setGoals] = useState<Goal[]>([])
    const [loading, setLoading] = useState(true)

    const fetchGoals = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('goals')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            if (data) setGoals(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchGoals()
    }, [])

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Metas de Economia</h1>
                <GoalDialog onGoalAdded={fetchGoals} />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <p>Carregando metas...</p>
                ) : goals.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in zoom-in-50 duration-500">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                            <Target className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold">Nenhuma meta ainda</h3>
                        <p className="mb-4 text-sm text-muted-foreground">
                            Defina objetivos financeiros para acompanhar seu progresso.
                        </p>
                        <GoalDialog onGoalAdded={fetchGoals} />
                    </div>
                ) : (
                    goals.map((goal) => {
                        const progress = Math.min(100, Math.round(((goal.current_amount || 0) / goal.target_amount) * 100))

                        return (
                            <Card key={goal.id} className="transition-all hover:shadow-md">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center justify-between text-lg">
                                        <span className="truncate pr-2">{goal.name}</span>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="text-xs font-normal px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                                                {progress}%
                                            </span>
                                            <UpdateGoalDialog goal={goal} onUpdate={fetchGoals} />
                                        </div>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-end justify-between text-sm">
                                            <span className="text-muted-foreground">Progresso</span>
                                            <span className="font-medium">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(goal.current_amount || 0)}
                                                <span className="text-muted-foreground mx-1">/</span>
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(goal.target_amount)}
                                            </span>
                                        </div>

                                        <Progress value={progress} className="h-2" />

                                        {goal.deadline && (
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                                                <CalendarIcon className="h-3 w-3" />
                                                <span>Alvo: {format(new Date(goal.deadline), "dd 'de' MMM, yyyy", { locale: ptBR })}</span>
                                            </div>
                                        )}

                                        {!goal.deadline && (
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                                                <TrendingUp className="h-3 w-3" />
                                                <span>Sem prazo definido</span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })
                )}
            </div>
        </div>
    )
}
