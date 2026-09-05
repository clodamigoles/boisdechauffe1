import Image from "next/image"
import { useRouter } from "next/router"

import { cloudinaryUrl } from "@/lib/cloudinary-url"
import { DEPOT_GALLERY } from "@/constants/media"
import { localized, useT } from "@/lib/i18n"

/**
 * Les photos du dépôt.
 *
 * Le site montrait jusqu'ici une seule image d'en-tête et une photo de camion,
 * toutes deux génériques. Acheter du bois en ligne demande de croire sur
 * parole qu'il y a un stock, un séchage et un quai derrière la boutique :
 * ces photos-là sont l'argument, et elles valent mieux que trois lignes de
 * texte qui promettent la même chose.
 *
 * La mise en page est en colonnes CSS plutôt qu'en grille : les prises sont
 * tantôt en portrait, tantôt en paysage, et une grille les aurait toutes
 * recadrées au même format — c'est-à-dire coupées.
 */
export default function DepotGallery() {
    const t = useT()
    const { locale } = useRouter()

    if (DEPOT_GALLERY.length === 0) return null

    return (
        <section id="depot" className="py-16 bg-white scroll-mt-24" aria-labelledby="depot-title">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl">
                    <h2 id="depot-title" className="text-2xl lg:text-3xl font-bold text-gray-900">
                        {t("home.galleryTitle")}
                    </h2>
                    <p className="mt-3 text-gray-600 leading-relaxed">{t("home.galleryIntro")}</p>
                </div>

                <div className="mt-10 gap-5 sm:columns-2 lg:columns-3">
                    {DEPOT_GALLERY.map((image, index) => {
                        const caption = localized(image.caption, locale)
                        const alt = localized(image.alt, locale) || caption

                        return (
                            <figure
                                key={`${image.publicId}-${index}`}
                                className="mb-5 break-inside-avoid overflow-hidden rounded-xl border border-gray-200 bg-white"
                            >
                                <div
                                    className="relative bg-gray-100"
                                    style={{ aspectRatio: image.width / image.height }}
                                >
                                    <Image
                                        src={cloudinaryUrl(image.publicId, { width: 800, crop: "fit" })}
                                        alt={alt}
                                        fill
                                        sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 92vw"
                                        // Les deux premières sont visibles sans
                                        // défiler sur un écran large ; les autres
                                        // attendent qu'on descende.
                                        loading={index < 2 ? "eager" : "lazy"}
                                        className="object-cover"
                                    />
                                </div>
                                {caption ? (
                                    <figcaption className="border-t border-gray-100 px-4 py-3 text-sm leading-snug text-gray-600">
                                        {caption}
                                    </figcaption>
                                ) : null}
                            </figure>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
