import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'

export default function ProductSearch({ value, onChange, placeholder = "Rechercher..." }) {
    const [searchTerm, setSearchTerm] = useState(value || '')
    const timeoutRef = useRef(null)

    // Sync avec la prop value
    useEffect(() => {
        setSearchTerm(value || '')
    }, [value])

    // Debounce optimisé avec cleanup
    useEffect(() => {
        // Annuler le timeout précédent
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        // Ne pas déclencher onChange si la valeur n'a pas changé
        if (searchTerm === value) {
            return
        }

        // Créer un nouveau timeout
        timeoutRef.current = setTimeout(() => {
            onChange(searchTerm)
        }, 500) // 500ms pour éviter trop d'appels API

        // Cleanup
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [searchTerm]) // Retirer onChange et value des dépendances pour éviter boucles

    const handleClear = () => {
        setSearchTerm('')
        onChange('')
    }

    const handleChange = (e) => {
        setSearchTerm(e.target.value)
    }

    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
                type="text"
                value={searchTerm}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                aria-label={placeholder}
            />
            {searchTerm && (
                <button
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Effacer la recherche"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    )
}