import Script from "next/script"

export default function GT() {
    return (
        <>
            <div className="gtranslate_wrapper"></div>
            <Script id="gtranslate-settings" strategy="beforeInteractive">
                {`window.gtranslateSettings = {"default_language":"fr","native_language_names":true,"detect_browser_language":true,"languages":["fr","es","de","en"],"wrapper_selector":".gtranslate_wrapper","flag_style":"3d"}`}
            </Script>
            <Script
                src="https://cdn.gtranslate.net/widgets/latest/float.js"
                strategy="afterInteractive"
            />
        </>
    )
}