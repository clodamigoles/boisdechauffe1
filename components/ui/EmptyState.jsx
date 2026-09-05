import { Search, Package, Filter } from 'lucide-react'
import Button from './ActionButton'
import { useT } from '@/lib/i18n'

export default function EmptyState({
    type = 'search',
    title,
    description,
    actionLabel,
    onAction,
    className = ''
}) {
    const t = useT()
    const getIcon = () => {
        switch (type) {
            case 'search':
                return Search
            case 'products':
                return Package
            case 'filter':
                return Filter
            default:
                return Search
        }
    }

    const getDefaultContent = () => {
        switch (type) {
            case 'search':
                return {
                    title: t('empty.searchTitle'),
                    description: t('empty.searchText')
                }
            case 'products':
                return {
                    title: t('empty.productsTitle'),
                    description: t('empty.productsText')
                }
            case 'filter':
                return {
                    title: t('empty.filteredTitle'),
                    description: t('empty.filteredText')
                }
            default:
                return {
                    title: t('empty.genericTitle'),
                    description: t('empty.genericText')
                }
        }
    }

    const IconComponent = getIcon()
    const defaultContent = getDefaultContent()
    const finalTitle = title || defaultContent.title
    const finalDescription = description || defaultContent.description

    return (
        <div className={`text-center py-12 ${className}`}>
            <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <IconComponent className="w-8 h-8 text-gray-400" />
                </div>
            </div>

            <h3 className="text-lg font-medium text-gray-900 mb-2">
                {finalTitle}
            </h3>

            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {finalDescription}
            </p>

            {actionLabel && onAction && (
                <Button
                    variant="primary"
                    onClick={onAction}
                >
                    {actionLabel}
                </Button>
            )}
        </div>
    )
}