import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, Droplets } from 'lucide-react'

import Button from '../ui/ActionButton'
import { heroVariants } from '@/utils/animations'
import { cloudinaryUrl } from '@/lib/cloudinary-url'
import { HERO_SLIDES } from '@/constants/media'
import { localized, useT } from '@/lib/i18n'

/** Durée d'affichage d'une photo avant la suivante. */
const SLIDE_MS = 6000

export default function HeroSection() {
    const t = useT()
    const { locale } = useRouter()
    const [index, setIndex] = useState(0)
    const [isStill, setIsStill] = useState(false)

    // Un visiteur qui a demandé moins d'animations à son système ne veut pas
    // d'un fond qui change tout seul toutes les six secondes.
    useEffect(() => {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
        const sync = () => setIsStill(reduced.matches)
        sync()
        reduced.addEventListener('change', sync)
        return () => reduced.removeEventListener('change', sync)
    }, [])

    useEffect(() => {
        if (isStill || HERO_SLIDES.length < 2) return
        const timer = window.setTimeout(
            () => setIndex((current) => (current + 1) % HERO_SLIDES.length),
            SLIDE_MS,
        )
        return () => window.clearTimeout(timer)
    }, [index, isStill])

    const stats = [
        { value: t('home.heroStatMoistureValue'), label: t('home.heroStatMoisture'), icon: Droplets },
        { value: t('home.heroStatLeadTimeValue'), label: t('home.heroStatLeadTime'), icon: Clock },
    ]

    const reasons = [
        { title: t('home.trustDry'), desc: t('home.trustDryText') },
        { title: t('home.trustOrigin'), desc: t('home.trustOriginText') },
        { title: t('home.trustDelivery'), desc: t('home.trustDeliveryText') },
        { title: t('home.trustService'), desc: t('home.trustServiceText') },
    ]

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-900">
            {/* Fond photographique.
                Le fond était une seule image générique. Ce sont maintenant de
                vraies photos du dépôt qui se succèdent — la première est
                prioritaire, c'est elle qui compte pour le LCP ; les suivantes
                ne se chargent qu'après. */}
            <div className="absolute inset-0 z-0">
                {HERO_SLIDES.map((slide, position) => (
                    <div
                        key={slide.publicId}
                        aria-hidden={position !== index}
                        className={`absolute inset-0 transition-opacity duration-1000 motion-reduce:transition-none ${position === index ? 'opacity-60' : 'opacity-0'
                            }`}
                    >
                        <Image
                            src={cloudinaryUrl(slide.publicId, { width: 1920, height: 1080 })}
                            alt={position === index ? localized(slide.alt, locale) : ''}
                            fill
                            priority={position === 0}
                            loading={position === 0 ? undefined : 'lazy'}
                            sizes="100vw"
                            className="object-cover"
                        />
                    </div>
                ))}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/60 to-transparent" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        variants={heroVariants}
                        initial="initial"
                        animate="enter"
                        className="text-center lg:text-left"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-6"
                        >
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                            {t('home.heroBadge')}
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
                        >
                            {t('home.heroTitle')}
                            <span className="block text-amber-400">{t('home.heroTitleAccent')}</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="text-xl text-gray-300 mb-8 max-w-lg leading-relaxed"
                        >
                            {t('home.heroSubtitle')}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                            className="flex flex-col sm:flex-row items-center gap-4 mb-12 lg:justify-start justify-center"
                        >
                            <Link href="/shop">
                                <Button variant="primary" size="lg" className="flex items-center justify-center space-x-2">
                                    <span>{t('home.heroCta')}</span>
                                    <ArrowRight className="w-5 h-5" />
                                </Button>
                            </Link>
                            {/* Un lien d'ancre vers la galerie : la preuve est
                                plus bas sur la page, autant y conduire. */}
                            <a
                                href="#depot"
                                className="text-white font-semibold underline underline-offset-8 decoration-white/40 hover:decoration-white transition-colors"
                            >
                                {t('home.heroSecondary')}
                            </a>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 0.8 }}
                            className="grid grid-cols-2 gap-6 max-w-sm mx-auto lg:mx-0"
                        >
                            {stats.map((stat, position) => {
                                const IconComponent = stat.icon
                                return (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 1.2 + position * 0.1 }}
                                        className="text-center lg:text-left"
                                    >
                                        <div className="flex justify-center lg:justify-start mb-2">
                                            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                                <IconComponent className="w-6 h-6 text-amber-400" />
                                            </div>
                                        </div>
                                        <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                                        <div className="text-sm text-gray-300 font-medium">{stat.label}</div>
                                    </motion.div>
                                )
                            })}
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                        className="hidden lg:block"
                    >
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                            <h2 className="text-2xl font-bold text-white mb-6">{t('home.trustTitle')}</h2>
                            <div className="space-y-4">
                                {reasons.map((item, position) => (
                                    <motion.div
                                        key={item.title}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 1.4 + position * 0.1 }}
                                        className="flex items-start space-x-3"
                                    >
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                                        <div>
                                            <div className="text-white font-medium">{item.title}</div>
                                            <div className="text-gray-300 text-sm">{item.desc}</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
