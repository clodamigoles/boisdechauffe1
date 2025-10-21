import { useMemo, memo } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

const PageButton = memo(({ page, isActive = false, isDisabled = false, onClick, children }) => (
    <motion.button
        whileHover={!isDisabled ? { scale: 1.05 } : {}}
        whileTap={!isDisabled ? { scale: 0.95 } : {}}
        onClick={onClick}
        disabled={isDisabled}
        className={`
            relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors min-w-[2.5rem]
            ${isActive
                ? 'bg-amber-600 text-white shadow-sm'
                : isDisabled
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }
        `}
        aria-label={children ? undefined : `Page ${page}`}
        aria-current={isActive ? 'page' : undefined}
    >
        {children || page}
    </motion.button>
))

PageButton.displayName = 'PageButton'

export default function Pagination({ currentPage, totalPages, onPageChange, maxVisiblePages = 5 }) {
    if (totalPages <= 1) return null

    const visiblePages = useMemo(() => {
        const pages = []
        const halfVisible = Math.floor(maxVisiblePages / 2)

        let startPage = Math.max(1, currentPage - halfVisible)
        let endPage = Math.min(totalPages, currentPage + halfVisible)

        // Ajuster si on est près du début ou de la fin
        if (endPage - startPage + 1 < maxVisiblePages) {
            if (startPage === 1) {
                endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
            } else {
                startPage = Math.max(1, endPage - maxVisiblePages + 1)
            }
        }

        // Ajouter la première page et les ellipses si nécessaire
        if (startPage > 1) {
            pages.push(1)
            if (startPage > 2) {
                pages.push('ellipsis-start')
            }
        }

        // Ajouter les pages visibles
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i)
        }

        // Ajouter les ellipses et la dernière page si nécessaire
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push('ellipsis-end')
            }
            pages.push(totalPages)
        }

        return pages
    }, [currentPage, totalPages, maxVisiblePages])

    const handlePrevious = () => {
        if (currentPage > 1) onPageChange(currentPage - 1)
    }

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1)
    }

    const handleGoToPage = (e) => {
        if (e.key === 'Enter') {
            const page = parseInt(e.target.value)
            if (page >= 1 && page <= totalPages && page !== currentPage) {
                onPageChange(page)
                e.target.value = ''
            }
        }
    }

    return (
        <nav className="flex items-center justify-between" aria-label="Pagination">
            {/* Info sur les résultats */}
            <div className="hidden sm:block">
                <p className="text-sm text-gray-700">
                    Page <span className="font-medium">{currentPage}</span> sur{' '}
                    <span className="font-medium">{totalPages}</span>
                </p>
            </div>

            {/* Contrôles de pagination */}
            <div className="flex items-center gap-2">
                {/* Bouton Précédent */}
                <PageButton
                    isDisabled={currentPage === 1}
                    onClick={handlePrevious}
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline ml-1">Précédent</span>
                </PageButton>

                {/* Pages - Desktop */}
                <div className="hidden sm:flex items-center gap-1">
                    {visiblePages.map((page, index) => {
                        if (typeof page === 'string' && page.startsWith('ellipsis')) {
                            return (
                                <span 
                                    key={page} 
                                    className="px-2 py-2 text-gray-500"
                                    aria-hidden="true"
                                >
                                    <MoreHorizontal className="w-4 h-4" />
                                </span>
                            )
                        }

                        return (
                            <PageButton
                                key={page}
                                page={page}
                                isActive={page === currentPage}
                                onClick={() => onPageChange(page)}
                            />
                        )
                    })}
                </div>

                {/* Pages mobiles (simplifiées) */}
                <div className="sm:hidden flex items-center">
                    <span className="px-3 py-2 text-sm text-gray-700">
                        {currentPage} / {totalPages}
                    </span>
                </div>

                {/* Bouton Suivant */}
                <PageButton
                    isDisabled={currentPage === totalPages}
                    onClick={handleNext}
                >
                    <span className="hidden sm:inline mr-1">Suivant</span>
                    <ChevronRight className="w-4 h-4" />
                </PageButton>
            </div>

            {/* Aller à la page (optionnel pour les grandes listes) */}
            {totalPages > 10 && (
                <div className="hidden lg:flex items-center gap-2">
                    <label htmlFor="goto-page" className="text-sm text-gray-700">
                        Aller à la page :
                    </label>
                    <input
                        id="goto-page"
                        type="number"
                        min="1"
                        max={totalPages}
                        placeholder={currentPage.toString()}
                        className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                        onKeyPress={handleGoToPage}
                    />
                </div>
            )}
        </nav>
    )
}