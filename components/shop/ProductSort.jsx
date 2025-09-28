import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'

export default function ProductSort({ value, onChange }) {
    const [isOpen, setIsOpen] = useState(false)

    const sortOptions = [
        { value: 'name-asc', label: 'Nom A-Z' },
        { value: 'name-desc', label: 'Nom Z-A' },
        { value: 'price-asc', label: 'Prix croissant' },
        { value: 'price-desc', label: 'Prix décroissant' },
        { value: 'rating-desc', label: 'Mieux notés' },
        { value: 'sales-desc', label: 'Plus vendus' },
        { value: 'created-desc', label: 'Plus récents' },
        { value: 'created-asc', label: 'Plus anciens' }
    ]

    const selectedOption = sortOptions.find(option => option.value === value)

    const handleSelect = (optionValue) => {
        onChange(optionValue)
        setIsOpen(false)
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors min-w-[160px]"
            >
                <span>Trier par :</span>
                <span className="text-gray-900">{selectedOption?.label}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Overlay */}
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown Menu */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20"
                        >
                            <div className="py-2">
                                {sortOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleSelect(option.value)}
                                        className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-900 transition-colors"
                                    >
                                        <span>{option.label}</span>
                                        {value === option.value && (
                                            <Check className="w-4 h-4 text-amber-600" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}