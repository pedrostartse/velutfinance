export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            categories: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    type: 'income' | 'expense'
                    icon: string | null
                    color: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string
                    name: string
                    type: 'income' | 'expense'
                    icon?: string | null
                    color?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    type?: 'income' | 'expense'
                    icon?: string | null
                    color?: string | null
                    created_at?: string
                }
            }
            transactions: {
                Row: {
                    id: string
                    user_id: string
                    category_id: string | null
                    description: string
                    amount: number
                    date: string
                    status: 'paid' | 'pending'
                    type: 'income' | 'expense'
                    payment_method: 'debit' | 'credit'
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string
                    category_id?: string | null
                    description: string
                    amount: number
                    date?: string
                    status?: 'paid' | 'pending'
                    type: 'income' | 'expense'
                    payment_method?: 'debit' | 'credit'
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    category_id?: string | null
                    description?: string
                    amount?: number
                    date?: string
                    status?: 'paid' | 'pending'
                    type?: 'income' | 'expense'
                    payment_method?: 'debit' | 'credit'
                    created_at?: string
                }
            }
            goals: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    target_amount: number
                    current_amount: number | null
                    deadline: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string
                    name: string
                    target_amount: number
                    current_amount?: number | null
                    deadline?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    target_amount?: number
                    current_amount?: number | null
                    deadline?: string | null
                    created_at?: string
                }
            }
            subscriptions: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    amount: number
                    billing_day: number
                    category_id: string | null
                    active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string
                    name: string
                    amount: number
                    billing_day: number
                    category_id?: string | null
                    active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    amount?: number
                    billing_day?: number
                    category_id?: string | null
                    active?: boolean
                    created_at?: string
                }
            }
            user_settings: {
                Row: {
                    user_id: string
                    card_closing_day: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    user_id: string
                    card_closing_day?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    user_id?: string
                    card_closing_day?: number
                    created_at?: string
                    updated_at?: string
                }
            }
        }
    }
}
