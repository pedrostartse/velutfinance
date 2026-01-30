import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/supabase'

type TransactionInsert = Database['public']['Tables']['transactions']['Insert']
type TransactionUpdate = Database['public']['Tables']['transactions']['Update']

export function useTransactions() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const addTransaction = async (transaction: TransactionInsert) => {
        try {
            setLoading(true)
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Usuário não autenticado')

            const { error } = await supabase
                .from('transactions')
                .insert({ ...transaction, user_id: user.id })

            if (error) throw error
            return true
        } catch (err: any) {
            setError(err.message)
            return false
        } finally {
            setLoading(false)
        }
    }

    const updateTransaction = async (id: string, updates: TransactionUpdate) => {
        try {
            setLoading(true)
            const { error } = await supabase
                .from('transactions')
                .update(updates)
                .eq('id', id)

            if (error) throw error
            return true
        } catch (err: any) {
            setError(err.message)
            return false
        } finally {
            setLoading(false)
        }
    }

    const deleteTransaction = async (id: string) => {
        try {
            setLoading(true)
            const { error } = await supabase
                .from('transactions')
                .delete()
                .eq('id', id)

            if (error) throw error
            return true
        } catch (err: any) {
            setError(err.message)
            return false
        } finally {
            setLoading(false)
        }
    }

    return {
        addTransaction,
        updateTransaction,
        deleteTransaction,
        loading,
        error
    }
}
