import { useEffect } from "react"
import { useMotionValue, useTransform, animate, motion } from "framer-motion"

interface AnimatedNumberProps {
    value: number
    currency?: boolean
}

export function AnimatedNumber({ value, currency = true }: AnimatedNumberProps) {
    const count = useMotionValue(0)
    const rounded = useTransform(count, (latest) => {
        if (currency) {
            return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(latest)
        }
        return Math.round(latest).toString()
    })

    useEffect(() => {
        const controls = animate(count, value, {
            duration: 1.5,
            ease: "easeOut",
        })
        return controls.stop
    }, [value, count])

    return <motion.span className="tabular-nums">{rounded}</motion.span>
}
