import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

export default function Breadcrumb({ items }) {
    if (!items || items.length === 0) return null

    return (
        <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                {items.map((item, index) => (
                    <li key={index} className="inline-flex items-center">
                        {index > 0 && (
                            <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
                        )}

                        {item.href ? (
                            <Link
                                href={item.href}
                                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-amber-600 transition-colors"
                            >
                                {index === 0 && <Home className="w-4 h-4 mr-1" />}
                                {item.label}
                            </Link>
                        ) : (
                            <span className="inline-flex items-center text-sm font-medium text-gray-500">
                                {index === 0 && <Home className="w-4 h-4 mr-1" />}
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    )
}