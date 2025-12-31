import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Needs install class-variance-authority and @radix-ui/react-slot if not present, but for now simple version
// Simplified for now until we install those packages or decide to use them
// Actually, let's keep it simple and standard HTML button for now to avoid dep hell unless requested
// But wait, making it nice means using these usually.
// Let's stick to standard tailwind classes for now in the component directly to be safe, 
// or just standard props.

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {

        const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"

        const variants = {
            primary: "bg-blue-600 text-white hover:bg-blue-700",
            secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
            outline: "border border-gray-200 bg-transparent hover:bg-gray-100 text-gray-900",
            ghost: "hover:bg-gray-100 hover:text-gray-900 text-gray-600",
            danger: "bg-red-600 text-white hover:bg-red-700",
        }

        const sizes = {
            sm: "h-8 px-3 text-xs",
            md: "h-10 px-4 py-2",
            lg: "h-12 px-8 text-lg",
        }

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
