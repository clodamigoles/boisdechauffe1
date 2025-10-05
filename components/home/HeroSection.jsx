import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Play, ArrowRight, Users, Clock, Shield, Award } from 'lucide-react'

import Button from '../ui/Button'
import { heroVariants } from '../../utils/animations'

export default function HeroSection() {
    const [isVideoLoaded, setIsVideoLoaded] = useState(false)
    const videoRef = useRef(null)

    useEffect(() => {
        const video = videoRef.current
        if (video) {
            const handleLoadedData = () => setIsVideoLoaded(true)
            video.addEventListener('loadeddata', handleLoadedData)
            return () => video.removeEventListener('loadeddata', handleLoadedData)
        }
    }, [])

    const stats = [
        // { value: '15+', label: 'Années d\'expérience', icon: Award },
        // { value: '50k+', label: 'Clients satisfaits', icon: Users },
        { value: '5j', label: 'Livraison express', icon: Clock },
        { value: '99%', label: 'Qualité garantie', icon: Shield }
    ]

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-900">
            {/* Vidéo Background */}
            <div className="absolute inset-0 z-0">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover opacity-60"
                    poster="/images/hero-poster.png"
                >
                    <source src="/videos/hero-background.mp4" type="video/mp4" />
                </video>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/60 to-transparent" />
            </div>

            {/* Contenu Principal */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        variants={heroVariants}
                        initial="initial"
                        animate="enter"
                        className="text-center lg:text-left"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-6"
                        >
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                            Livraison 4/5j partout dans l'UE
                        </motion.div>

                        {/* Titre Principal */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
                        >
                            Bois de Chauffage
                            <span className="block text-amber-400">
                                Premium
                            </span>
                        </motion.h1>

                        {/* Sous-titre */}
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="text-xl text-gray-300 mb-8 max-w-lg leading-relaxed"
                        >
                            Découvrez notre sélection exclusive de bois séché premium.
                            Chêne, Hêtre, Charme - Livraison rapide, qualité garantie
                        </motion.p>

                        {/* Boutons d'Action */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                            className="flex flex-col sm:flex-row gap-4 mb-12"
                        >
                            <Link href="/shop">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="flex items-center justify-center space-x-2"
                                >
                                    <span>Commander Maintenant</span>
                                    <ArrowRight className="w-5 h-5" />
                                </Button>
                            </Link>
                            {/* <Button
                                variant="secondary"
                                size="lg"
                                className="flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20"
                            >
                                <Play className="w-5 h-5" />
                                <span>Voir la Vidéo</span>
                            </Button> */}
                        </motion.div>

                        {/* Statistiques */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 0.8 }}
                            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
                        >
                            {stats.map((stat, index) => {
                                const IconComponent = stat.icon
                                return (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 1.2 + index * 0.1 }}
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        className="text-center"
                                    >
                                        <div className="flex justify-center mb-2">
                                            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                                <IconComponent className="w-6 h-6 text-amber-400" />
                                            </div>
                                        </div>
                                        <div className="text-2xl font-bold text-white mb-1">
                                            {stat.value}
                                        </div>
                                        <div className="text-sm text-gray-300 font-medium">
                                            {stat.label}
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </motion.div>
                    </motion.div>

                    {/* Section Droite - Contenu Supplémentaire */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                        className="hidden lg:block"
                    >
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                            <h3 className="text-2xl font-bold text-white mb-6">
                                Pourquoi nous choisir ?
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { title: 'Qualité Premium', desc: 'Bois séché < 18% d\'humidité' },
                                    { title: 'Livraison Rapide', desc: '24-48h partout en France' },
                                    { title: 'Prix Transparents', desc: 'Devis gratuit, sans surprise' },
                                    { title: 'Service Client', desc: 'Équipe d\'experts à votre écoute' }
                                ].map((item, index) => (
                                    <motion.div
                                        key={item.title}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 1.4 + index * 0.1 }}
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

                {/* Indicateur de défilement */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:block"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex flex-col items-center space-y-2 text-white/60"
                    >
                        <span className="text-sm font-medium">Découvrir</span>
                        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                            <motion.div
                                animate={{ y: [0, 12, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-1 h-1 bg-white/60 rounded-full mt-2"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}