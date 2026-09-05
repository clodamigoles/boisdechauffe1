import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { useT } from '@/lib/i18n'

export default function ProductBreadcrumb({ product }) {
    const t = useT()
    const breadcrumbs = [
        { name: t('nav.home'), href: "/", icon: Home },
        { name: t('nav.shopShort'), href: "/shop" },
        // { name: product.category?.name || "Produits", href: `/shop?category=${product.category?.slug}` },
        { name: product.name, href: `/produits/${product.slug}`, current: true },
    ]

    return (
        <nav className="flex" aria-label={t('product.breadcrumb')}>
            <ol className="flex items-center space-x-2">
                {breadcrumbs.map((breadcrumb, index) => (
                    <li key={breadcrumb.name} className="flex items-center">
                        {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />}
                        {breadcrumb.current ? (
                            <span className="text-sm font-medium text-gray-900 line-clamp-1">{breadcrumb.name}</span>
                        ) : (
                            <Link
                                href={breadcrumb.href}
                                className="text-sm font-medium text-gray-500 hover:text-amber-600 transition-colors flex items-center space-x-1"
                            >
                                {breadcrumb.icon && <breadcrumb.icon className="w-4 h-4" />}
                                <span>{breadcrumb.name}</span>
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    )
}