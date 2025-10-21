import { useState, useMemo, memo } from 'react'
import { motion } from 'framer-motion'
import { X, RotateCcw, Check, ChevronDown, ChevronUp } from 'lucide-react'
import Button from '../ui/Button'
import { useTranslation } from '@/lib/useTranslation'

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
    const { t } = useTranslation('shop')
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
        { value: 'chene', label: t('filters.essences.chene'), count: 12 },
        { value: 'hetre', label: t('filters.essences.hetre'), count: 8 },
        { value: 'charme', label: t('filters.essences.charme'), count: 6 },
        { value: 'mix', label: t('filters.essences.mix'), count: 4 },
        { value: 'granules', label: t('filters.essences.granules'), count: 3 },
        { value: 'compresse', label: t('filters.essences.compresse'), count: 2 },
        { value: 'allume-feu', label: t('filters.essences.allume-feu'), count: 1 }
    ], [t])

    const priceRanges = useMemo(() => [
        { value: '0-50', label: t('filters.priceRanges.0-50'), count: 8 },
        { value: '50-100', label: t('filters.priceRanges.50-100'), count: 15 },
        { value: '100-200', label: t('filters.priceRanges.100-200'), count: 12 },
        { value: '200-500', label: t('filters.priceRanges.200-500'), count: 6 },
        { value: '500+', label: t('filters.priceRanges.500+'), count: 3 }
    ], [t])

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
            active.push({ key: 'inStock', label: t('filters.features.inStock') })
        }
        
        if (filters.badges) {
            const badgeKey = `filters.badges.${filters.badges}`
            active.push({ key: 'badges', label: t(badgeKey) })
        }
        
        if (filters.promotion === 'true') {
            active.push({ key: 'promotion', label: t('filters.features.promotion') })
        }
        
        if (filters.search) {
            active.push({ key: 'search', label: `"${filters.search}"` })
        }
        
        return active
    }, [filters, categories, essences, priceRanges, t])

    return (
        <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${mobile ? 'p-4' : 'p-6'}`}>
            {/* En-tête */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-gray-900">{t('filters.title')}</h2>
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
                        <span>{t('filters.reset')}</span>
                    </Button>
                )}
            </div>

            <div className="space-y-6">
                {/* Catégories */}
                <FilterSection
                    title={t('filters.sections.categories')}
                    isExpanded={expandedSections.category}
                    onToggle={() => toggleSection('category')}
                >
                    <div className="space-y-3">
                        <RadioFilter
                            value=""
                            isSelected={!filters.category}
                            onChange={(value) => onChange('category', value)}
                            label={t('filters.categories.all')}
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
                    title={t('filters.sections.essences')}
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
                    title={t('filters.sections.price')}
                    isExpanded={expandedSections.price}
                    onToggle={() => toggleSection('price')}
                >
                    <div className="space-y-3">
                        <RadioFilter
                            value=""
                            isSelected={!filters.priceRange}
                            onChange={(value) => onChange('priceRange', value)}
                            label={t('filters.priceRanges.all')}
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
                    title={t('filters.sections.features')}
                    isExpanded={expandedSections.features}
                    onToggle={() => toggleSection('features')}
                >
                    <div className="space-y-3">
                        <CheckboxFilter
                            value={true}
                            isChecked={filters.inStock}
                            onChange={(checked) => onChange('inStock', checked)}
                            label={t('filters.features.inStock')}
                        />
                        <CheckboxFilter
                            value="premium"
                            isChecked={filters.badges === 'premium'}
                            onChange={(checked) => onChange('badges', checked ? 'premium' : '')}
                            label={t('filters.features.premium')}
                        />
                        <CheckboxFilter
                            value="bestseller"
                            isChecked={filters.badges === 'bestseller'}
                            onChange={(checked) => onChange('badges', checked ? 'bestseller' : '')}
                            label={t('filters.features.bestseller')}
                        />
                        <CheckboxFilter
                            value="nouveau"
                            isChecked={filters.badges === 'nouveau'}
                            onChange={(checked) => onChange('badges', checked ? 'nouveau' : '')}
                            label={t('filters.features.new')}
                        />
                        <CheckboxFilter
                            value="promotion"
                            isChecked={filters.promotion === 'true'}
                            onChange={(checked) => onChange('promotion', checked ? 'true' : '')}
                            label={t('filters.features.promotion')}
                        />
                    </div>
                </FilterSection>
            </div>

            {/* Filtres actifs */}
            {activeFiltersCount > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">{t('filters.activeFilters')}</h4>
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