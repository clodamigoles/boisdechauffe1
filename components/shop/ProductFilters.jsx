import { useState, useMemo, memo } from 'react'
import { motion } from 'framer-motion'
import { X, RotateCcw, Check, ChevronDown, ChevronUp } from 'lucide-react'
import Button from '../ui/Button'

// Composants memoized pour éviter les re-renders
const FilterSection = memo(({ title, isExpanded, onToggle, children }) => (
    <div className="border-b border-gray-200 pb-6 last:border-b-0">
        <button
            onClick={onToggle}
            className="flex items-center justify-between w-full py-3 text-left hover:text-gray-900 transition-colors"
            aria-expanded={isExpanded}
        >
            <h3 className="text-sm font-medium text-gray-900">{title}</h3>
            {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
        </button>
        <motion.div
            initial={false}
            animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
        >
            <div className="pt-2 space-y-3">
                {children}
            </div>
        </motion.div>
    </div>
))

FilterSection.displayName = 'FilterSection'

const CheckboxFilter = memo(({ value, isChecked, onChange, label, count }) => (
    <label className="flex items-center space-x-3 cursor-pointer group">
        <div className="relative flex-shrink-0">
            <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => onChange(e.target.checked ? value : '')}
                className="sr-only"
            />
            <div className={`w-4 h-4 rounded border-2 transition-colors ${
                isChecked
                    ? 'bg-amber-600 border-amber-600'
                    : 'border-gray-300 group-hover:border-amber-400'
            }`}>
                {isChecked && (
                    <Check className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
                )}
            </div>
        </div>
        <span className="text-sm text-gray-700 flex-1">{label}</span>
        {count !== undefined && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {count}
            </span>
        )}
    </label>
))

CheckboxFilter.displayName = 'CheckboxFilter'

const RadioFilter = memo(({ value, isSelected, onChange, label, count }) => (
    <label className="flex items-center space-x-3 cursor-pointer group">
        <div className="relative flex-shrink-0">
            <input
                type="radio"
                checked={isSelected}
                onChange={() => onChange(value)}
                className="sr-only"
            />
            <div className={`w-4 h-4 rounded-full border-2 transition-colors ${
                isSelected
                    ? 'bg-amber-600 border-amber-600'
                    : 'border-gray-300 group-hover:border-amber-400'
            }`}>
                {isSelected && (
                    <div className="w-2 h-2 bg-white rounded-full absolute top-1 left-1" />
                )}
            </div>
        </div>
        <span className="text-sm text-gray-700 flex-1">{label}</span>
        {count !== undefined && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {count}
            </span>
        )}
    </label>
))

RadioFilter.displayName = 'RadioFilter'

const FilterTag = memo(({ label, onRemove }) => (
    <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1 rounded-full"
    >
        <span>{label}</span>
        <button
            onClick={onRemove}
            className="ml-1 hover:text-amber-900 transition-colors"
            aria-label={`Retirer le filtre ${label}`}
        >
            <X className="w-3 h-3" />
        </button>
    </motion.span>
))

FilterTag.displayName = 'FilterTag'

export default function ProductFilters({ filters, categories, onChange, onReset, mobile = false }) {
    const [expandedSections, setExpandedSections] = useState({
        category: true,
        essence: true,
        price: true,
        features: true
    })

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }))
    }

    // Données statiques memoized
    const essences = useMemo(() => [
        { value: 'chene', label: 'Chêne', count: 12 },
        { value: 'hetre', label: 'Hêtre', count: 8 },
        { value: 'charme', label: 'Charme', count: 6 },
        { value: 'mix', label: 'Mix Feuillus', count: 4 },
        { value: 'granules', label: 'Granulés', count: 3 },
        { value: 'compresse', label: 'Bûches Compressées', count: 2 },
        { value: 'allume-feu', label: 'Allume-feu', count: 1 }
    ], [])

    const priceRanges = useMemo(() => [
        { value: '0-50', label: 'Moins de 50€', count: 8 },
        { value: '50-100', label: '50€ - 100€', count: 15 },
        { value: '100-200', label: '100€ - 200€', count: 12 },
        { value: '200-500', label: '200€ - 500€', count: 6 },
        { value: '500+', label: 'Plus de 500€', count: 3 }
    ], [])

    // Compteur de filtres actifs memoized
    const activeFiltersCount = useMemo(() => {
        return Object.entries(filters).filter(([key, value]) => 
            value && value !== '' && value !== false && 
            key !== 'sort' && key !== 'page'
        ).length
    }, [filters])

    // Liste des filtres actifs pour affichage
    const activeFiltersList = useMemo(() => {
        const active = []
        
        if (filters.category) {
            const cat = categories?.find(c => c.slug === filters.category)
            if (cat) active.push({ key: 'category', label: cat.name })
        }
        
        if (filters.essence) {
            const ess = essences.find(e => e.value === filters.essence)
            if (ess) active.push({ key: 'essence', label: ess.label })
        }
        
        if (filters.priceRange) {
            const price = priceRanges.find(p => p.value === filters.priceRange)
            if (price) active.push({ key: 'priceRange', label: price.label })
        }
        
        if (filters.inStock) {
            active.push({ key: 'inStock', label: 'En stock' })
        }
        
        if (filters.badges) {
            const badgeLabels = {
                premium: 'Premium',
                bestseller: 'Meilleures ventes',
                nouveau: 'Nouveautés'
            }
            active.push({ key: 'badges', label: badgeLabels[filters.badges] || filters.badges })
        }
        
        if (filters.promotion === 'true') {
            active.push({ key: 'promotion', label: 'En promotion' })
        }
        
        if (filters.search) {
            active.push({ key: 'search', label: `"${filters.search}"` })
        }
        
        return active
    }, [filters, categories, essences, priceRanges])

    return (
        <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${mobile ? 'p-4' : 'p-6'}`}>
            {/* En-tête */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-gray-900">Filtres</h2>
                    {activeFiltersCount > 0 && (
                        <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full">
                            {activeFiltersCount}
                        </span>
                    )}
                </div>

                {activeFiltersCount > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onReset}
                        className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                    >
                        <RotateCcw className="w-4 h-4" />
                        <span>Reset</span>
                    </Button>
                )}
            </div>

            <div className="space-y-6">
                {/* Catégories */}
                <FilterSection
                    title="Catégories"
                    isExpanded={expandedSections.category}
                    onToggle={() => toggleSection('category')}
                >
                    <div className="space-y-3">
                        <RadioFilter
                            value=""
                            isSelected={!filters.category}
                            onChange={(value) => onChange('category', value)}
                            label="Toutes les catégories"
                            count={categories?.reduce((sum, cat) => sum + (cat.productCount || 0), 0)}
                        />
                        {categories?.map((category) => (
                            <RadioFilter
                                key={category._id}
                                value={category.slug}
                                isSelected={filters.category === category.slug}
                                onChange={(value) => onChange('category', value)}
                                label={category.name}
                                count={category.productCount}
                            />
                        ))}
                    </div>
                </FilterSection>

                {/* Essences */}
                <FilterSection
                    title="Essences"
                    isExpanded={expandedSections.essence}
                    onToggle={() => toggleSection('essence')}
                >
                    <div className="space-y-3">
                        {essences.map((essence) => (
                            <CheckboxFilter
                                key={essence.value}
                                value={essence.value}
                                isChecked={filters.essence === essence.value}
                                onChange={(value) => onChange('essence', value)}
                                label={essence.label}
                                count={essence.count}
                            />
                        ))}
                    </div>
                </FilterSection>

                {/* Prix */}
                <FilterSection
                    title="Prix"
                    isExpanded={expandedSections.price}
                    onToggle={() => toggleSection('price')}
                >
                    <div className="space-y-3">
                        <RadioFilter
                            value=""
                            isSelected={!filters.priceRange}
                            onChange={(value) => onChange('priceRange', value)}
                            label="Tous les prix"
                        />
                        {priceRanges.map((range) => (
                            <RadioFilter
                                key={range.value}
                                value={range.value}
                                isSelected={filters.priceRange === range.value}
                                onChange={(value) => onChange('priceRange', value)}
                                label={range.label}
                                count={range.count}
                            />
                        ))}
                    </div>
                </FilterSection>

                {/* Caractéristiques */}
                <FilterSection
                    title="Caractéristiques"
                    isExpanded={expandedSections.features}
                    onToggle={() => toggleSection('features')}
                >
                    <div className="space-y-3">
                        <CheckboxFilter
                            value={true}
                            isChecked={filters.inStock}
                            onChange={(checked) => onChange('inStock', checked)}
                            label="En stock uniquement"
                        />
                        <CheckboxFilter
                            value="premium"
                            isChecked={filters.badges === 'premium'}
                            onChange={(checked) => onChange('badges', checked ? 'premium' : '')}
                            label="Produits Premium"
                        />
                        <CheckboxFilter
                            value="bestseller"
                            isChecked={filters.badges === 'bestseller'}
                            onChange={(checked) => onChange('badges', checked ? 'bestseller' : '')}
                            label="Meilleures ventes"
                        />
                        <CheckboxFilter
                            value="nouveau"
                            isChecked={filters.badges === 'nouveau'}
                            onChange={(checked) => onChange('badges', checked ? 'nouveau' : '')}
                            label="Nouveautés"
                        />
                        <CheckboxFilter
                            value="promotion"
                            isChecked={filters.promotion === 'true'}
                            onChange={(checked) => onChange('promotion', checked ? 'true' : '')}
                            label="En promotion"
                        />
                    </div>
                </FilterSection>
            </div>

            {/* Filtres actifs */}
            {activeFiltersCount > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Filtres actifs</h4>
                    <div className="flex flex-wrap gap-2">
                        {activeFiltersList.map((filter) => (
                            <FilterTag
                                key={filter.key}
                                label={filter.label}
                                onRemove={() => onChange(filter.key, filter.key === 'inStock' ? false : '')}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}