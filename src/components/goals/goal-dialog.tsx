import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { useGoals } from "@/hooks/useGoals"

export function GoalDialog({ onGoalAdded }: { onGoalAdded: () => void }) {
    const [open, setOpen] = useState(false)
    const { addGoal, loading } = useGoals()

    // Form states
    const [name, setName] = useState("")
    const [target, setTarget] = useState("")
    const [current, setCurrent] = useState("0")
    const [deadline, setDeadline] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        await addGoal({
            name,
            target_amount: Number(target),
            current_amount: Number(current),
            deadline: deadline || null
        })

        setOpen(false)
        onGoalAdded()

        // Reset form
        setName("")
        setTarget("")
        setCurrent("0")
        setDeadline("")
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nova Meta
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Definir Nova Meta</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome da Meta</Label>
                        <Input
                            id="name"
                            placeholder="Ex: Viagem, Carro Novo"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="target">Valor Alvo (R$)</Label>
                            <Input
                                id="target"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={target}
                                onChange={(e) => setTarget(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="current">Já guardado (R$)</Label>
                            <Input
                                id="current"
                                type="number"
                                step="0.01"
                                value={current}
                                onChange={(e) => setCurrent(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="deadline">Prazo (Opcional)</Label>
                        <Input
                            id="deadline"
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Salvando..." : "Criar Meta"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
