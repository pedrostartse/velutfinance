import { useEffect, useState } from "react"
import { useSubscriptions } from "@/hooks/useSubscriptions"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { CalendarDays } from "lucide-react"

type Category = {
    id: string
    name: string
    type: 'income' | 'expense'
}

export type SubscriptionFormData = {
    id?: string
    name: string
    amount: string | number
    billing_day: number
    category_id: string | null
    active: boolean
}

export function SubscriptionDialog({
    initialData,
    onSuccess,
    trigger
}: {
    initialData?: SubscriptionFormData
    onSuccess?: () => void
    trigger?: React.ReactNode
}) {
    const [open, setOpen] = useState(false)
    const { addSubscription, updateSubscription, loading } = useSubscriptions()
    const [categories, setCategories] = useState<Category[]>([])
    const [fetchingCategories, setFetchingCategories] = useState(false)

    const [formData, setFormData] = useState<SubscriptionFormData>(initialData || {
        name: "",
        amount: "",
        billing_day: 1,
        category_id: "",
        active: true
    })

    const isEditing = !!initialData?.id

    useEffect(() => {
        if (open) {
            fetchCategories()
            if (initialData) {
                setFormData(initialData)
            }
        }
    }, [open, initialData])

    const fetchCategories = async () => {
        try {
            setFetchingCategories(true)
            const { data, error } = await supabase
                .from('categories')
                .select('id, name, type')
                .eq('type', 'expense')

            if (error) throw error
            if (data) setCategories(data)
        } catch (error) {
            console.error("Error fetching categories:", error)
        } finally {
            setFetchingCategories(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const submissionData = {
            name: formData.name,
            amount: Number(formData.amount),
            billing_day: Number(formData.billing_day),
            category_id: formData.category_id || null,
            active: formData.active
        }

        let success = false
        if (isEditing && initialData.id) {
            success = await updateSubscription(initialData.id, submissionData)
        } else {
            success = await addSubscription(submissionData)
        }

        if (success) {
            setOpen(false)
            if (!isEditing) {
                setFormData({
                    name: "",
                    amount: "",
                    billing_day: 1,
                    category_id: "",
                    active: true
                })
            }
            if (onSuccess) onSuccess()
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="gap-2">
                        <CalendarDays className="h-4 w-4" />
                        Nova Assinatura
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Editar Assinatura" : "Nova Assinatura"}</DialogTitle>
                    <DialogDescription>
                        Gerencie seus custos fixos mensais (Netflix, Spotify, etc.)
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nome da Assinatura</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Ex: Netflix"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="amount">Valor (R$)</Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                placeholder="0,00"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="billing_day">Dia do Vencimento</Label>
                            <Input
                                id="billing_day"
                                type="number"
                                min="1"
                                max="31"
                                value={formData.billing_day}
                                onChange={(e) => setFormData({ ...formData, billing_day: parseInt(e.target.value) || 1 })}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="category">Categoria</Label>
                        <Select
                            value={formData.category_id ?? undefined}
                            onValueChange={(val) => setFormData({ ...formData, category_id: val })}
                            disabled={fetchingCategories}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={fetchingCategories ? "Carregando..." : "Selecione"} />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? "Salvando..." : (isEditing ? "Atualizar" : "Salvar Assinatura")}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
