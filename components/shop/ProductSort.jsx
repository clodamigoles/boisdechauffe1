import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'

export default function ProductSort({ value, onChange }) {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)

    const sortOptions = useMemo(() => [
        { value: 'name-asc', label: 'Nom A-Z' },
        { value: 'name-desc', label: 'Nom Z-A' },
        { value: 'price-asc', label: 'Prix croissant' },
        { value: 'price-desc', label: 'Prix décroissant' },
        { value: 'rating-desc', label: 'Mieux notés' },
        { value: 'sales-desc', label: 'Plus vendus' },
        { value: 'created-desc', label: 'Plus récents' },
        { value: 'created-asc', label: 'Plus anciens' }
    ], [])

    const selectedOption = useMemo(() => 
        sortOptions.find(option => option.value === value) || sortOptions[0],
        [sortOptions, value]
    )

    const handleSelect = useCallback((optionValue) => {
        onChange(optionValue)
        setIsOpen(false)
    }, [onChange])

    const toggleDropdown = useCallback(() => {
        setIsOpen(prev => !prev)
    }, [])

    // Fermer le dropdown au clic extérieur
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            return () => document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    // Fermer avec Escape
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape' && isOpen) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            return () => document.removeEventListener('keydown', handleEscape)
        }
    }, [isOpen])

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors min-w-[180px]"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className="text-gray-600">Trier par :</span>
                <span className="text-gray-900 flex-1 text-left">{selectedOption.label}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                        role="listbox"
                    >
                        <div className="py-2">
                            {sortOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleSelect(option.value)}
                                    className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-900 transition-colors text-left"
                                    role="option"
                                    aria-selected={value === option.value}
                                >
                                    <span>{option.label}</span>
                                    {value === option.value && (
                                        <Check className="w-4 h-4 text-amber-600 flex-shrink-0" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}