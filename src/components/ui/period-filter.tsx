import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "lucide-react"

export type Period = 'current_month' | 'last_month' | 'last_3_months' | 'all'

interface PeriodFilterProps {
    value: Period
    onChange: (value: Period) => void
}

export function PeriodFilter({ value, onChange }: PeriodFilterProps) {
    return (
        <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Select value={value} onValueChange={(val: Period) => onChange(val)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecionar Período" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="current_month">Mês Atual</SelectItem>
                    <SelectItem value="last_month">Mês Anterior</SelectItem>
                    <SelectItem value="last_3_months">Últimos 3 Meses</SelectItem>
                    <SelectItem value="all">Todo o Período</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
