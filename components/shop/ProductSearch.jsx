import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'

export default function ProductSearch({ value, onChange, placeholder = "Rechercher..." }) {
    const [searchTerm, setSearchTerm] = useState(value || '')

    useEffect(() => {
        setSearchTerm(value || '')
    }, [value])

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            onChange(searchTerm)
        }, 300) // Debounce de 300ms

        return () => clearTimeout(timeoutId)
    }, [searchTerm, onChange])

    const handleClear = () => {
        setSearchTerm('')
        onChange('')
    }

    return (
        <div className="relative">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                />
                {searchTerm && (
                    <button
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    )
}