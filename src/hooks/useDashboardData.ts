import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/supabase'
import { startOfMonth, endOfMonth, subMonths, isWithinInterval, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type Transaction = Database['public']['Tables']['transactions']['Row']
type Category = Database['public']['Tables']['categories']['Row']

export type Period = 'current_month' | 'last_month' | 'last_3_months' | 'all'

export function useDashboardData(period: Period = 'current_month') {
    const [data, setData] = useState<{
        balance: number
        income: number
        expense: number
        creditInvoice: number
        totalInvested: number
        totalPatrimony: number
        creditCycleLabel?: string
        recentTransactions: (Transaction & { categories: Category | null })[]
        categoryStats: { name: string; value: number; color: string }[]
        monthlyStats: { name: string; income: number; expense: number }[]
        userName: string
    }>({
        balance: 0,
        income: 0,
        expense: 0,
        creditInvoice: 0,
        totalInvested: 0,
        totalPatrimony: 0,
        creditCycleLabel: '',
        recentTransactions: [],
        categoryStats: [],
        monthlyStats: [],
        userName: ''
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true)
                const { data: { session } } = await supabase.auth.getSession()

                if (!session) {
                    setData({
                        balance: 2450.00,
                        income: 4550.00,
                        expense: 2100.00,
                        creditInvoice: 850.00,
                        totalInvested: 15400.00,
                        totalPatrimony: 17850.00,
                        recentTransactions: [],
                        categoryStats: [
                            { name: 'Alimentação', value: 400, color: '#f43f5e' },
                            { name: 'Moradia', value: 1200, color: '#6366f1' },
                            { name: 'Lazer', value: 300, color: '#10b981' },
                            { name: 'Outros', value: 200, color: '#f59e0b' },
                        ],
                        monthlyStats: [],
                        userName: 'Visitante'
                    })
                    setLoading(false)
                    return
                }

                // Fetch transactions, investments AND user settings
                const [transactionsRes, investmentsRes, settingsRes] = await Promise.all([
                    supabase
                        .from('transactions')
                        .select('*, categories(*)')
                        .order('date', { ascending: false }),
                    supabase
                        .from('investments')
                        .select('*'),
                    supabase
                        .from('user_settings')
                        .select('card_closing_day, full_name')
                        .eq('user_id', session.user.id)
                        .single()
                ])

                if (transactionsRes.error) throw transactionsRes.error
                if (investmentsRes.error) throw investmentsRes.error

                const transactions = transactionsRes.data || []
                const investments = investmentsRes.data || []
                const closingDay = settingsRes.data?.card_closing_day || 18

                // Prioritize name from settings, then metadata
                // If no name is found, return empty string to trigger generic welcome
                const userName = settingsRes.data?.full_name ||
                    session.user.user_metadata?.full_name ||
                    session.user.user_metadata?.name ||
                    ''

                // Calculate Investment Values
                const totalInvested = investments.reduce((acc, inv) => {
                    const price = inv.current_price || inv.average_price
                    return acc + (inv.quantity * price)
                }, 0)

                // Calculate Lifetime Balance (Available Cash)
                const lifetimeIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0)
                const lifetimeDebitExpense = transactions
                    .filter(t => t.type === 'expense' && t.payment_method === 'debit')
                    .reduce((acc, t) => acc + Number(t.amount), 0)

                const balance = lifetimeIncome - lifetimeDebitExpense

                // Define Period Range
                let startDate = new Date(0)
                let endDate = new Date()

                if (period === 'current_month') {
                    startDate = startOfMonth(new Date())
                    endDate = endOfMonth(new Date())
                } else if (period === 'last_month') {
                    const lastMonth = subMonths(new Date(), 1)
                    startDate = startOfMonth(lastMonth)
                    endDate = endOfMonth(lastMonth)
                } else if (period === 'last_3_months') {
                    startDate = startOfMonth(subMonths(new Date(), 2))
                    endDate = endOfMonth(new Date())
                }

                const periodTransactions = period === 'all'
                    ? transactions
                    : transactions.filter(t => {
                        const tDate = new Date(t.date + 'T12:00:00')
                        return isWithinInterval(tDate, { start: startDate, end: endDate })
                    })

                const income = periodTransactions
                    .filter(t => t.type === 'income')
                    .reduce((acc, t) => acc + Number(t.amount), 0)

                const expense = periodTransactions
                    .filter(t => t.type === 'expense')
                    .reduce((acc, t) => acc + Number(t.amount), 0)

                // Specialized Credit Invoice Calculation (Dynamic Closing Day)
                let creditStartDateCredit = new Date(startDate)
                let creditEndDateCredit = new Date(endDate)
                let creditCycleLabel = ''

                if (period === 'current_month') {
                    const today = new Date()
                    const currentMonth = today.getMonth()
                    const currentYear = today.getFullYear()

                    // Invoice ending in this month:
                    // Starts: (ClosingDay + 1) of Prev Month
                    // Ends: ClosingDay of This Month

                    creditStartDateCredit = new Date(currentYear, currentMonth - 1, closingDay + 1)
                    creditEndDateCredit = new Date(currentYear, currentMonth, closingDay, 23, 59, 59)

                    const startLabel = creditStartDateCredit.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
                    const endLabel = creditEndDateCredit.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
                    creditCycleLabel = `${startLabel} - ${endLabel}`
                } else if (period === 'last_month') {
                    const lastMonth = subMonths(new Date(), 1)
                    const m = lastMonth.getMonth()
                    const y = lastMonth.getFullYear()

                    creditStartDateCredit = new Date(y, m - 1, closingDay + 1)
                    creditEndDateCredit = new Date(y, m, closingDay, 23, 59, 59)

                    const startLabel = creditStartDateCredit.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
                    const endLabel = creditEndDateCredit.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
                    creditCycleLabel = `${startLabel} - ${endLabel}`
                }

                const creditInvoice = transactions
                    .filter(t => {
                        if (t.type !== 'expense' || t.payment_method !== 'credit') return false
                        const tDate = new Date(t.date + 'T12:00:00')
                        if (period === 'all') return true
                        return isWithinInterval(tDate, { start: creditStartDateCredit, end: creditEndDateCredit })
                    })
                    .reduce((acc, t) => acc + Number(t.amount), 0)

                const statsMap = new Map<string, number>()
                periodTransactions
                    .filter(t => t.type === 'expense')
                    .forEach(t => {
                        const catName = t.categories?.name || 'Sem Categoria'
                        const current = statsMap.get(catName) || 0
                        statsMap.set(catName, current + Number(t.amount))
                    })

                const categoryStats = Array.from(statsMap.entries()).map(([name, value], index) => ({
                    name,
                    value,
                    color: generateColor(index)
                }))

                // Calculate Monthly Stats (Last 6 Months)
                const monthlyStats = []
                for (let i = 5; i >= 0; i--) {
                    const d = subMonths(new Date(), i)
                    const monthStart = startOfMonth(d)
                    const monthEnd = endOfMonth(d)
                    const monthName = format(d, 'MMM', { locale: ptBR })

                    const monthTransactions = transactions.filter(t => {
                        const tDate = new Date(t.date + 'T12:00:00')
                        return isWithinInterval(tDate, { start: monthStart, end: monthEnd })
                    })

                    const mIncome = monthTransactions
                        .filter(t => t.type === 'income')
                        .reduce((acc, t) => acc + Number(t.amount), 0)

                    const mExpense = monthTransactions
                        .filter(t => t.type === 'expense')
                        .reduce((acc, t) => acc + Number(t.amount), 0)

                    monthlyStats.push({
                        name: monthName.charAt(0).toUpperCase() + monthName.slice(1),
                        income: mIncome,
                        expense: mExpense
                    })
                }

                setData({
                    balance,
                    income,
                    expense,
                    creditInvoice,
                    totalInvested,
                    totalPatrimony: balance + totalInvested,
                    creditCycleLabel,
                    recentTransactions: periodTransactions.slice(0, 5),
                    categoryStats,
                    monthlyStats,
                    userName
                })

            } catch (error) {
                console.error('Error fetching dashboard data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [period])

    return { data, loading }
}

function generateColor(index: number) {
    const colors = [
        '#6366f1', // Indigo (Primary)
        '#ec4899', // Pink (Secondary)
        '#10b981', // Emerald (Success)
        '#f59e0b', // Amber (Warning)
        '#8b5cf6', // Violet
        '#06b6d4', // Cyan
        '#f43f5e', // Rose
        '#3b82f6'  // Blue
    ]
    return colors[index % colors.length]
}
