import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/supabase'

type Transaction = Database['public']['Tables']['transactions']['Row']
type Category = Database['public']['Tables']['categories']['Row']

export function useDashboardData() {
    const [data, setData] = useState<{
        balance: number
        income: number
        expense: number
        recentTransactions: (Transaction & { categories: Category | null })[]
        categoryStats: { name: string; value: number; color: string }[]
    }>({
        balance: 0,
        income: 0,
        expense: 0,
        recentTransactions: [],
        categoryStats: []
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true)

                // Em um app real, filtraríamos pelo mês atual/usuário logado
                // Para demo, pegamos tudo se estiver logado, ou retornamos mock se não estiver

                const { data: { session } } = await supabase.auth.getSession()

                if (!session) {
                    console.log("No session, using mock data")
                    // Return mock data for UI testing without auth
                    setData({
                        balance: 2450.00,
                        income: 4550.00,
                        expense: 2100.00,
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

                const [transactionsResponse] = await Promise.all([
                    supabase
                        .from('transactions')
                        .select('*, categories(*)')
                        .order('date', { ascending: false }),
                    supabase.from('categories').select('*')
                ])

                if (transactionsResponse.error) throw transactionsResponse.error

                const transactions = transactionsResponse.data || []

                const income = transactions
                    .filter(t => t.type === 'income')
                    .reduce((acc, t) => acc + Number(t.amount), 0)

                const expense = transactions
                    .filter(t => t.type === 'expense')
                    .reduce((acc, t) => acc + Number(t.amount), 0)

                // Calculate category stats for pie chart
                const statsMap = new Map<string, number>()
                transactions
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
                    balance: income - expense,
                    income,
                    expense,
                    recentTransactions: transactions.slice(0, 5),
                    categoryStats
                })

            } catch (error) {
                console.error('Error fetching dashboard data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    return { data, loading }
}

function generateColor(index: number) {
    const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']
    return colors[index % colors.length]
}
