import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Input({
    type = 'text',
    placeholder = '',
    value = '',
    onChange,
    onBlur,
    onFocus,
    required = false,
    disabled = false,
    error = '',
    label = '',
    className = '',
    ...props
}) {
    const [isFocused, setIsFocused] = useState(false)
    const [isValid, setIsValid] = useState(true)

    const handleFocus = (e) => {
        setIsFocused(true)
        onFocus?.(e)
    }

    const handleBlur = (e) => {
        setIsFocused(false)

        // Validation simple
        if (required && !value) {
            setIsValid(false)
        } else if (type === 'email' && value && !isValidEmail(value)) {
            setIsValid(false)
        } else {
            setIsValid(true)
        }

        onBlur?.(e)
    }

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const baseClasses = 'w-full px-4 py-3 border rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed'

    const getInputClasses = () => {
        if (error || !isValid) {
            return `${baseClasses} border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50`
        }
        if (isFocused) {
            return `${baseClasses} border-amber-500 focus:border-amber-500 focus:ring-amber-200 bg-white`
        }
        return `${baseClasses} border-gray-300 focus:border-amber-500 focus:ring-amber-200 hover:border-gray-400 bg-white`
    }

    return (
        <div className="relative">
            {label && (
                <motion.label
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </motion.label>
            )}

            <div className="relative">
                <motion.input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    required={required}
                    disabled={disabled}
                    className={`${getInputClasses()} ${className}`}
                    whileFocus={{ scale: 1.01 }}
                    {...props}
                />

                {/* Indicateur de validation */}
                {value && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                        {isValid && !error ? (
                            <span className="text-green-500 text-lg">✓</span>
                        ) : (
                            <span className="text-red-500 text-lg">✗</span>
                        )}
                    </motion.div>
                )}
            </div>

            {/* Message d'erreur */}
            {(error || !isValid) && (
                <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600"
                >
                    {error || (
                        !isValid && required && !value ? 'Ce champ est requis' :
                            !isValid && type === 'email' ? 'Format d\'email invalide' :
                                'Valeur invalide'
                    )}
                </motion.div>
            )}

            {/* Barre de progression pour mot de passe */}
            {type === 'password' && value && (
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    className="mt-2"
                >
                    <div className="h-1 bg-gray-200 rounded">
                        <div
                            className={`h-full rounded transition-all duration-300 ${value.length < 6 ? 'bg-red-400 w-1/3' :
                                    value.length < 8 ? 'bg-yellow-400 w-2/3' :
                                        'bg-green-400 w-full'
                                }`}
                        />
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                        Force du mot de passe : {
                            value.length < 6 ? 'Faible' :
                                value.length < 8 ? 'Moyenne' :
                                    'Forte'
                        }
                    </div>
                </motion.div>
            )}
        </div>
    )
}