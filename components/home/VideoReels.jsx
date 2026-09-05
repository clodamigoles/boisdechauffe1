import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ArrowLeft, ArrowRight, Play } from "lucide-react"

import { cloudinaryVideoPosterUrl, cloudinaryVideoUrl } from "@/lib/cloudinary-url"
import { DEPOT_VIDEOS, REEL_VIDEO } from "@/constants/media"
import { useT } from "@/lib/i18n"

/**
 * Les vidéos du dépôt, en bande défilante.
 *
 * Une seule vidéo est lue à la fois, et rien ne se télécharge tant qu'on n'a
 * pas cliqué : la vignette est une image extraite de la seconde zéro. Cinq
 * lecteurs en lecture automatique auraient tiré une trentaine de mégaoctets
 * à chaque visite de la page d'accueil.
 *
 * L'observateur d'intersection arrête la lecture quand la vidéo sort de
 * l'écran. Sans lui, faire défiler la page laisse du son derrière soi et
 * continue à consommer du réseau pour une image que personne ne regarde.
 */
export default function VideoReels() {
    const t = useT()
    const railRef = useRef(null)
    const playerRef = useRef(null)
    const [playing, setPlaying] = useState(-1)

    useEffect(() => {
        const video = playerRef.current
        if (!video) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) setPlaying(-1)
            },
            { threshold: 0.25 },
        )
        observer.observe(video)
        return () => observer.disconnect()
    }, [playing])

    // Un défilement d'exactement une vignette : on mesure la carte plutôt que
    // de coder une largeur, qui changerait avec le point de rupture.
    const scrollBy = useCallback((direction) => {
        const rail = railRef.current
        const card = rail?.firstElementChild
        if (!rail || !card) return
        const step = card.getBoundingClientRect().width + 20
        rail.scrollBy({ left: step * direction, behavior: "smooth" })
    }, [])

    if (DEPOT_VIDEOS.length === 0) return null

    return (
        <section id="videos" className="py-16 bg-gray-50 scroll-mt-24" aria-labelledby="videos-title">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div className="max-w-2xl">
                        <h2 id="videos-title" className="text-2xl lg:text-3xl font-bold text-gray-900">
                            {t("home.videosTitle")}
                        </h2>
                        <p className="mt-3 text-gray-600 leading-relaxed">{t("home.videosIntro")}</p>
                    </div>

                    <div className="hidden sm:flex shrink-0 items-center gap-1">
                        <button
                            type="button"
                            aria-label={t("home.videosPrevious")}
                            onClick={() => scrollBy(-1)}
                            className="grid size-10 place-items-center rounded-lg text-gray-500 hover:bg-white hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            aria-label={t("home.videosNext")}
                            onClick={() => scrollBy(1)}
                            className="grid size-10 place-items-center rounded-lg text-gray-500 hover:bg-white hover:text-gray-900 transition-colors"
                        >
                            <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </button>
                    </div>
                </div>

                <ul className="-mx-4 mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 [scrollbar-width:thin]" ref={railRef}>
                    {DEPOT_VIDEOS.map((video, index) => {
                        const isPlaying = playing === index
                        const label = t("home.videosItem", { index: index + 1, total: DEPOT_VIDEOS.length })
                        const poster = cloudinaryVideoPosterUrl(video.publicId)

                        return (
                            <li
                                key={video.publicId}
                                className="w-[62vw] max-w-[280px] shrink-0 snap-start sm:w-[240px] lg:w-[260px]"
                            >
                                <div
                                    className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-100 shadow-sm"
                                    style={{ aspectRatio: video.ratio }}
                                >
                                    {isPlaying ? (
                                        <video
                                            ref={playerRef}
                                            aria-label={label}
                                            src={cloudinaryVideoUrl(video.publicId, REEL_VIDEO)}
                                            poster={poster}
                                            autoPlay
                                            controls
                                            playsInline
                                            loop
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => setPlaying(index)}
                                            aria-label={`${t("home.videosPlay")} — ${label}`}
                                            className="group absolute inset-0 block h-full w-full"
                                        >
                                            <Image
                                                src={poster}
                                                alt=""
                                                fill
                                                sizes="(min-width: 1024px) 260px, (min-width: 640px) 240px, 62vw"
                                                className="object-cover"
                                            />
                                            <span className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/15" />
                                            <span className="absolute inset-0 m-auto grid size-14 place-items-center rounded-full bg-white/90 text-gray-900 shadow-md backdrop-blur-sm transition-transform duration-200 group-hover:scale-105">
                                                <Play className="w-6 h-6 translate-x-px" aria-hidden="true" />
                                            </span>
                                        </button>
                                    )}
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </section>
    )
}
