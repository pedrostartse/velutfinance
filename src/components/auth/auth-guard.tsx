import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const seedCategories = async (userId: string) => {
            try {
                const { data: existing } = await supabase
                    .from('categories')
                    .select('name')
                    .eq('user_id', userId)
                    .limit(1)

                if (existing && existing.length > 0) return

                const defaultCategories = [
                    { name: 'Alimentação', type: 'expense', user_id: userId },
                    { name: 'Transporte', type: 'expense', user_id: userId },
                    { name: 'Lazer', type: 'expense', user_id: userId },
                    { name: 'Moradia', type: 'expense', user_id: userId },
                    { name: 'Saúde', type: 'expense', user_id: userId },
                    { name: 'Educação', type: 'expense', user_id: userId },
                    { name: 'Vestuário', type: 'expense', user_id: userId },
                    { name: 'Esporte', type: 'expense', user_id: userId },
                    { name: 'Salário', type: 'income', user_id: userId },
                    { name: 'Investimentos', type: 'income', user_id: userId },
                    { name: 'Investimentos', type: 'expense', user_id: userId },
                    { name: 'Outros', type: 'income', user_id: userId },
                ]

                await supabase.from('categories').insert(defaultCategories)
            } catch (error) {
                console.error("Error seeding categories:", error)
            }
        }

        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                navigate("/login")
            } else {
                seedCategories(session.user.id)
            }
            setLoading(false)
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (!session) {
                navigate("/login")
            } else if (event === 'SIGNED_IN') {
                seedCategories(session.user.id)
            }
        })

        return () => subscription.unsubscribe()
    }, [navigate])

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return <>{children}</>
}
