import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/supabase'

// type Goal = Database['public']['Tables']['goals']['Row']
type GoalInsert = Database['public']['Tables']['goals']['Insert']

export function useGoals() {
    const [loading, setLoading] = useState(false)

    const addGoal = async (goal: Omit<GoalInsert, 'user_id' | 'created_at'>) => {
        try {
            setLoading(true)
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) throw new Error('No user logged in')

            const { error } = await supabase.from('goals').insert({
                ...goal,
                user_id: session.user.id
            })

            if (error) throw error
            return { error: null }
        } catch (error) {
            console.error('Error adding goal:', error)
            return { error }
        } finally {
            setLoading(false)
        }
    }

    const updateGoalAmount = async (id: string, current_amount: number) => {
        try {
            const { error } = await supabase
                .from('goals')
                .update({ current_amount })
                .eq('id', id)
            if (error) throw error
        } catch (error) {
            console.error(error)
        }
    }

    const deleteGoal = async (id: string) => {
        try {
            const { error } = await supabase.from('goals').delete().eq('id', id)
            if (error) throw error
        } catch (error) {
            console.error(error)
        }
    }

    return { addGoal, updateGoalAmount, deleteGoal, loading }
}
