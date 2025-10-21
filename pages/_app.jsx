import { useEffect } from 'react'
import { useRouter } from 'next/router'
import "@/styles/Tailwind.css"
import "@/styles/Global.css"

export default function App({ Component, pageProps }) {
    const router = useRouter()

    // Inject translations into window for client-side access
    useEffect(() => {
        if (pageProps.translations) {
            window.__TRANSLATIONS__ = pageProps.translations
        }
        
        // Set locale in window for easy access
        if (router.locale) {
            window.__LOCALE__ = router.locale
        }
    }, [pageProps.translations, router.locale])

    return (
        <>
            <Component {...pageProps} />
        </>
    )
}