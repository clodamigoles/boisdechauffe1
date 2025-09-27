import "@/styles/Tailwind.css"
import "@/styles/Global.css"
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function App({ Component, pageProps }) {
    const router = useRouter()

    // Analytics et tracking (optionnel)
    useEffect(() => {
        const handleRouteChange = (url) => {
            // Ici vous pouvez ajouter Google Analytics, Facebook Pixel, etc.
            // gtag('config', 'GA_MEASUREMENT_ID', {
            //     page_path: url,
            // })
        }

        router.events.on('routeChangeComplete', handleRouteChange)
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange)
        }
    }, [router.events])

    return (
        <>
            <Head>
                {/* Meta tags de base */}
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="description" content="BoisChauffage Pro - Votre spécialiste du bois de chauffage premium. Qualité garantie, livraison rapide partout en France." />
                <meta name="keywords" content="bois de chauffage, bois sec, livraison bois, chauffage écologique, chêne, hêtre, bois premium" />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="BoisChauffage Pro" />
                <meta property="og:description" content="Bois de chauffage premium séché et certifié. Livraison rapide partout en France." />
                <meta property="og:image" content="/og-image.jpg" />

                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:title" content="BoisChauffage Pro" />
                <meta property="twitter:description" content="Bois de chauffage premium séché et certifié" />

                {/* Favicon */}
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

                {/* Fonts preload */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </Head>

            <Component {...pageProps} />
        </>
    )
}