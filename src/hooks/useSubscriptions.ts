import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/supabase'

type SubscriptionInsert = Database['public']['Tables']['subscriptions']['Insert']
type SubscriptionUpdate = Database['public']['Tables']['subscriptions']['Update']

export function useSubscriptions() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const addSubscription = async (subscription: SubscriptionInsert) => {
        try {
            setLoading(true)
            const { error } = await supabase
                .from('subscriptions')
                .insert(subscription)

            if (error) throw error
            return true
        } catch (err: any) {
            setError(err.message)
            return false
        } finally {
            setLoading(false)
        }
    }

    const updateSubscription = async (id: string, subscription: SubscriptionUpdate) => {
        try {
            setLoading(true)
            const { error } = await supabase
                .from('subscriptions')
                .update(subscription)
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

    const deleteSubscription = async (id: string) => {
        try {
            setLoading(true)
            const { error } = await supabase
                .from('subscriptions')
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

    const toggleSubscriptionStatus = async (id: string, currentStatus: boolean) => {
        return updateSubscription(id, { active: !currentStatus })
    }

    return {
        addSubscription,
        updateSubscription,
        deleteSubscription,
        toggleSubscriptionStatus,
        loading,
        error
    }
}
