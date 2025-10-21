import "@/styles/Tailwind.css"
import "@/styles/Global.css"

import GT from "@/components/ui/GT"

export default function App({ Component, pageProps }) {
    return (
        <>
            <GT />
            <Component {...pageProps} />
        </>
    )
}