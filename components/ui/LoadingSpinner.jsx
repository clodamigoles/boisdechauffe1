import { Loader2 } from 'lucide-react'

export default function LoadingSpinner({
    size = 'md',
    color = 'amber',
    className = '',
    text = ''
}) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-12 h-12'
    }

    const colorClasses = {
        amber: 'text-amber-600',
        gray: 'text-gray-600',
        white: 'text-white'
    }

    return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
            <Loader2
                className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
            />
            {text && (
                <p className={`mt-2 text-sm ${colorClasses[color]}`}>
                    {text}
                </p>
            )}
        </div>
    )
}