import { FileText } from "lucide-react"

import LegalPage from "@/components/layout/LegalPage"

/**
 * Le contenu vit dans les paramètres, en allemand et en français, et s'édite
 * depuis l'administration. Cette page n'est plus qu'un gabarit — voir
 * `components/layout/LegalPage.jsx` pour le rendu commun aux quatre.
 */
export default function TermsPage() {
    return (
        <LegalPage
            documentKey="cgv"
            titleKey="legal.termsTitle"
            introKey="legal.termsIntro"
            icon={FileText}
        />
    )
}
