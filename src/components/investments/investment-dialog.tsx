import { useState } from "react"
import { useInvestments } from "@/hooks/useInvestments"
import type { InvestmentType, Investment } from "@/hooks/useInvestments"
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

export function InvestmentDialog({
    trigger,
    onSuccess,
    initialData
}: {
    trigger?: React.ReactNode
    onSuccess?: () => void
    initialData?: Investment
}) {
    const [open, setOpen] = useState(false)
    const { addInvestment, updateInvestment, loading } = useInvestments()
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        symbol: initialData?.symbol || "",
        type: (initialData?.type as InvestmentType) || "stock",
        quantity: initialData?.quantity.toString() || "",
        average_price: initialData?.average_price.toString() || "",
        current_price: initialData?.current_price?.toString() || initialData?.average_price.toString() || ""
    })

    const isEditing = !!initialData

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const payload = {
            name: formData.name,
            symbol: formData.symbol.toUpperCase(),
            type: formData.type,
            quantity: Number(formData.quantity.toString().replace(',', '.')),
            average_price: Number(formData.average_price.toString().replace(',', '.')),
            current_price: Number(formData.current_price.toString().replace(',', '.'))
        }

        let success = false
        if (isEditing && initialData) {
            success = await updateInvestment(initialData.id, payload)
        } else {
            success = await addInvestment(payload)
        }

        if (success) {
            setOpen(false)
            if (!isEditing) {
                setFormData({
                    name: "",
                    symbol: "",
                    type: "stock",
                    quantity: "",
                    average_price: "",
                    current_price: ""
                })
            }
            if (onSuccess) onSuccess()
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || <Button size="sm">Adicionar</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Editar Ativo' : 'Novo Ativo'}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Atualize as informações do seu investimento.' : 'Cadastre sua posição para acompanhar o rendimento.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2 text-left">
                            <Label htmlFor="type">Tipo</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(val: InvestmentType) => setFormData({ ...formData, type: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="stock">Ações (BR)</SelectItem>
                                    <SelectItem value="real_estate_fund">FIIs</SelectItem>
                                    <SelectItem value="fixed_income">Renda Fixa</SelectItem>
                                    <SelectItem value="crypto">Cripto</SelectItem>
                                    <SelectItem value="other">Outros</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2 text-left">
                            <Label htmlFor="symbol">Ticker (Símbolo)</Label>
                            <Input
                                id="symbol"
                                value={formData.symbol}
                                onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                                placeholder="EX: PETR4"
                            />
                        </div>
                    </div>

                    <div className="grid gap-2 text-left">
                        <Label htmlFor="name">Nome do Ativo / Instituição</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="EX: Petrobras S.A."
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2 text-left">
                            <Label htmlFor="quantity">Quantidade</Label>
                            <Input
                                id="quantity"
                                type="text"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                placeholder="0.00"
                                required
                            />
                        </div>
                        <div className="grid gap-2 text-left">
                            <Label htmlFor="price">Preço Médio (R$)</Label>
                            <Input
                                id="price"
                                type="text"
                                value={formData.average_price}
                                onChange={(e) => setFormData({ ...formData, average_price: e.target.value })}
                                placeholder="0.00"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid gap-2 text-left">
                        <Label htmlFor="current_price" className="text-primary font-bold">Preço Atual (R$)</Label>
                        <Input
                            id="current_price"
                            type="text"
                            value={formData.current_price}
                            onChange={(e) => setFormData({ ...formData, current_price: e.target.value })}
                            placeholder="0.00"
                            className="border-primary/50"
                        />
                        <p className="text-[10px] text-muted-foreground italic">* O sistema tenta atualizar via API, mas você pode ajustar manualmente.</p>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Salvando..." : (isEditing ? 'Atualizar Ativo' : 'Salvar Ativo')}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
