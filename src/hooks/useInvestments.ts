import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export type InvestmentType = 'stock' | 'fixed_income' | 'real_estate_fund' | 'crypto' | 'other'

export interface Investment {
    id: string
    user_id: string
    name: string
    symbol: string | null
    type: InvestmentType
    quantity: number
    average_price: number
    current_price: number | null
    created_at: string
    updated_at: string
}

export function useInvestments() {
    const [investments, setInvestments] = useState<Investment[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchInvestments = useCallback(async () => {
        try {
            setLoading(true)
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data, error } = await supabase
                .from('investments')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (error) throw error
            setInvestments(data || [])

            // Try to update prices if symbols exist
            updatePrices(data || [])
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    const updatePrices = async (assets: Investment[]) => {
        const symbols = assets.filter(a => a.symbol && a.type !== 'fixed_income').map(a => a.symbol).join(',')
        if (!symbols) return

        try {
            // Brapi requires a token, let's try to see if we can use a placeholder or suggest one
            // For now, I'll implement a try-catch for the fetch
            const response = await fetch(`https://brapi.dev/api/quote/${symbols}?token=`)
            const data = await response.json()

            if (data?.results) {
                for (const result of data.results) {
                    const price = result.regularMarketPrice
                    const asset = assets.find(a => a.symbol?.toUpperCase() === result.symbol.toUpperCase())
                    if (asset && price) {
                        await supabase
                            .from('investments')
                            .update({ current_price: price })
                            .eq('id', asset.id)
                    }
                }
                // Don't re-trigger fetch to avoid loop, just update local state if needed
                // But simple way is to just let the NEXT fetch see it
            }
        } catch (e) {
            console.warn("Failed to fetch prices from Brapi (likely missing token)", e)
        }
    }

    useEffect(() => {
        fetchInvestments()
    }, [fetchInvestments])

    const addInvestment = async (investment: Omit<Investment, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'current_price'>) => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            const { error } = await supabase
                .from('investments')
                .insert([{ ...investment, user_id: user.id }])

            if (error) throw error
            await fetchInvestments()
            return true
        } catch (err: any) {
            setError(err.message)
            return false
        }
    }

    const updateInvestment = async (id: string, investment: Partial<Investment>) => {
        try {
            const { error } = await supabase
                .from('investments')
                .update(investment)
                .eq('id', id)

            if (error) throw error
            await fetchInvestments()
            return true
        } catch (err: any) {
            setError(err.message)
            return false
        }
    }

    const deleteInvestment = async (id: string) => {
        try {
            const { error } = await supabase
                .from('investments')
                .delete()
                .eq('id', id)

            if (error) throw error
            await fetchInvestments()
            return true
        } catch (err: any) {
            setError(err.message)
            return false
        }
    }

    return {
        investments,
        loading,
        error,
        addInvestment,
        updateInvestment,
        deleteInvestment,
        refresh: fetchInvestments
    }
}
