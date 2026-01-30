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
        }
    }
}
