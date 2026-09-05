import { useEffect, useState } from "react"

import { cachedAPI } from "@/lib/api"

/**
 * Les catégories actives, pour la navigation.
 *
 * L'en-tête et le pied de page listaient les quatre catégories en dur, avec
 * leurs libellés français et leurs slugs recopiés à la main — un doublon en
 * était déjà la preuve dans le pied de page. Une catégorie renommée ou
 * désactivée dans l'administration ne changeait rien au menu.
 *
 * La liste vient donc de la base. Le cache de `cachedAPI` fait qu'un seul
 * appel part, quel que soit le nombre de composants qui l'appellent, et le
 * repli est un tableau vide : un menu sans sous-menu vaut mieux qu'un menu qui
 * promet des pages inexistantes.
 */
export function useCategories() {
    const [categories, setCategories] = useState([])

    useEffect(() => {
        let cancelled = false

        cachedAPI.categories
            .getAll({ isActive: true })
            .then((result) => {
                if (!cancelled) setCategories(result?.data || [])
            })
            .catch(() => {
                if (!cancelled) setCategories([])
            })

        return () => {
            cancelled = true
        }
    }, [])

    return categories
}

export default useCategories
