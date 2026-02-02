import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useGoals } from "@/hooks/useGoals"
import { Pencil } from "lucide-react"
import type { Database } from "@/types/supabase"

type Goal = Database['public']['Tables']['goals']['Row']

interface UpdateGoalDialogProps {
    goal: Goal
    onUpdate: () => void
}

export function UpdateGoalDialog({ goal, onUpdate }: UpdateGoalDialogProps) {
    const [open, setOpen] = useState(false)
    const [amount, setAmount] = useState(goal.current_amount?.toString() || "0")
    const { updateGoalAmount, loading } = useGoals()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await updateGoalAmount(goal.id, Number(amount))
        setOpen(false)
        onUpdate()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] glass border-white/10">
                <DialogHeader>
                    <DialogTitle>Atualizar Progresso</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="current">Valor Guardado (R$)</Label>
                        <Input
                            id="current"
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="bg-secondary/50"
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Salvando..." : "Salvar Progresso"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
