import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/supabase'
import { startOfMonth, endOfMonth, subMonths, isWithinInterval } from 'date-fns'

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
        recentTransactions: (Transaction & { categories: Category | null })[]
        categoryStats: { name: string; value: number; color: string }[]
    }>({
        balance: 0,
        income: 0,
        expense: 0,
        creditInvoice: 0,
        totalInvested: 0,
        totalPatrimony: 0,
        recentTransactions: [],
        categoryStats: []
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
                            { name: 'Alimentação', value: 400, color: '#ef4444' },
                            { name: 'Moradia', value: 1200, color: '#3b82f6' },
                            { name: 'Lazer', value: 300, color: '#10b981' },
                            { name: 'Outros', value: 200, color: '#f59e0b' },
                        ]
                    })
                    setLoading(false)
                    return
                }

                // Fetch transactions and investments
                const [transactionsRes, investmentsRes] = await Promise.all([
                    supabase
                        .from('transactions')
                        .select('*, categories(*)')
                        .order('date', { ascending: false }),
                    supabase
                        .from('investments')
                        .select('*')
                ])

                if (transactionsRes.error) throw transactionsRes.error
                if (investmentsRes.error) throw investmentsRes.error

                const transactions = transactionsRes.data || []
                const investments = investmentsRes.data || []

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

                // Only Credit Expenses in the period
                const creditInvoice = periodTransactions
                    .filter(t => t.type === 'expense' && t.payment_method === 'credit')
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

                setData({
                    balance: balance,
                    income,
                    expense,
                    creditInvoice,
                    totalInvested,
                    totalPatrimony: balance + totalInvested,
                    recentTransactions: periodTransactions.slice(0, 5),
                    categoryStats
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
        '#ef4444', // Red
        '#3b82f6', // Blue
        '#10b981', // Emerald
        '#f59e0b', // Amber
        '#8b5cf6', // Violet
        '#ec4899', // Pink
        '#06b6d4', // Cyan
        '#f97316'  // Orange
    ]
    return colors[index % colors.length]
}

