import { Html, Head, Main, NextScript } from "next/document"

import { DEFAULT_LOCALE } from "@/lib/i18n"

/**
 * `lang` suit la langue de la page.
 *
 * Il était figé à `fr` pendant que le widget GTranslate réécrivait le texte
 * par-dessus : un lecteur d'écran annonçait de l'allemand avec une prononciation
 * française, et les moteurs de recherche lisaient une page déclarée française.
 * `_document` n'a pas de routeur — la langue résolue est dans `__NEXT_DATA__`.
 */
export default function Document(props) {
    const locale = props.__NEXT_DATA__?.locale ?? DEFAULT_LOCALE

    return (
        <Html lang={locale}>
            <Head>
                <script
                    async
                    src="https://www.googletagmanager.com/gtag/js?id=AW-17674405589"
                />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', 'AW-17674405589');
                        `,
                    }}
                />
            </Head>
            <body className="antialiased">
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
