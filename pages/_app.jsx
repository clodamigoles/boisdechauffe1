import Head from "next/head"

import "@/styles/Tailwind.css"
import "@/styles/Global.css"

import GT from "@/components/ui/GT"

export default function App({ Component, pageProps }) {
    return (
        <>
            <Head>
                <link rel="icon" href="/favicon.ico" />
                <link rel="icon" type="image/svg+xml" href="/images/logo.svg" />
                <link rel="apple-touch-icon" href="/images/logo.svg" />
                <meta property="og:image" content="/images/logo.svg" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:image" content="/images/logo.svg" />
            </Head>
            <GT />
            <Component {...pageProps} />
        </>
    )
}