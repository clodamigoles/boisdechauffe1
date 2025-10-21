import { Search, Package, Filter } from 'lucide-react'
import Button from './Button'
import { useTranslation } from '@/lib/useTranslation'

export default function EmptyState({
    type = 'search',
    title,
    description,
    actionLabel,
    onAction,
    className = ''
}) {
    const { t } = useTranslation('shop')
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
        const typeKey = type || 'default'
        return {
            title: t(`empty.${typeKey}.title`),
            description: t(`empty.${typeKey}.description`),
            action: t(`empty.${typeKey}.action`)
        }
    }

    const IconComponent = getIcon()
    const defaultContent = getDefaultContent()
    const finalTitle = title || defaultContent.title
    const finalDescription = description || defaultContent.description
    const finalActionLabel = actionLabel || defaultContent.action

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

            {(finalActionLabel || onAction) && onAction && (
                <Button
                    variant="primary"
                    onClick={onAction}
                >
                    {finalActionLabel}
                </Button>
            )}
        </div>
    )
}