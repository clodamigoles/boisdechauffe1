/**
 * Traduit les catégories de la base de données avec les traductions appropriées
 * Si la traduction n'existe pas, retourne le texte original
 */
export function translateCategory(category, translations) {
    if (!category) return category
    if (!translations || typeof translations !== 'object') return category

    const slug = category.slug
    const categoryTranslation = translations[slug]

    // Si aucune traduction trouvée pour ce slug, retourner la catégorie originale
    if (!categoryTranslation || typeof categoryTranslation !== 'object') {
        console.log(`⚠️  Traduction manquante pour la catégorie: ${slug}`)
        return category
    }

    // Appliquer les traductions avec fallback vers l'original
    return {
        ...category,
        name: categoryTranslation.name && categoryTranslation.name.trim() !== '' 
            ? categoryTranslation.name 
            : category.name,
        shortDescription: categoryTranslation.shortDescription && categoryTranslation.shortDescription.trim() !== '' 
            ? categoryTranslation.shortDescription 
            : category.shortDescription,
        description: categoryTranslation.description && categoryTranslation.description.trim() !== '' 
            ? categoryTranslation.description 
            : category.description
    }
}

/**
 * Traduit un tableau de catégories
 */
export function translateCategories(categories, translations) {
    if (!categories || !Array.isArray(categories)) return categories
    return categories.map(cat => translateCategory(cat, translations))
}

/**
 * Vérifie si une traduction existe pour une catégorie donnée
 */
export function hasTranslation(slug, translations) {
    return translations && translations[slug] && typeof translations[slug] === 'object'
}

