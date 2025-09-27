import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Link from 'next/link';
import Layout from '@/components/Layout/Layout';
import ProductCard from '@/components/Product/ProductCard';
import CategoryCard from '@/components/Category/CategoryCard';

// Particules flottantes animées
const FloatingParticles = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-primary-300 rounded-full opacity-20"
                    initial={{
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                    }}
                    animate={{
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                    }}
                    transition={{
                        duration: Math.random() * 20 + 10,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            ))}
        </div>
    );
};

// Composant pour les statistiques animées
const AnimatedCounter = ({ end, duration = 2, suffix = "" }) => {
    const [count, setCount] = useState(0);
    const ref = useRef();
    const isInView = useInView(ref);

    useEffect(() => {
        if (isInView) {
            let startTime;
            const animate = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = (timestamp - startTime) / (duration * 1000);

                if (progress < 1) {
                    setCount(Math.floor(end * progress));
                    requestAnimationFrame(animate);
                } else {
                    setCount(end);
                }
            };
            requestAnimationFrame(animate);
        }
    }, [isInView, end, duration]);

    return <span ref={ref}>{count}{suffix}</span>;
};

// Animation variants avancées
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3,
            delayChildren: 0.2
        }
    }
};

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 50,
        scale: 0.9
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};

const heroVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: "easeOut"
        }
    }
};

export default function Home({ categories, featuredProducts }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const { scrollY } = useScroll();

    // Parallax effects
    const heroY = useTransform(scrollY, [0, 800], [0, -200]);
    const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

    // Auto-rotate hero slides
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % 3);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const heroSlides = [
        {
            title: "Bois de Chauffage Premium",
            subtitle: "Qualité exceptionnelle pour votre confort hivernal",
            image: "/api/placeholder/800/600",
            cta: "Découvrir nos produits",
            gradient: "from-orange-500 via-red-500 to-pink-500"
        },
        {
            title: "Livraison Express 48h",
            subtitle: "Chez vous rapidement, partout en France",
            image: "/api/placeholder/800/600",
            cta: "Commander maintenant",
            gradient: "from-blue-500 via-purple-500 to-indigo-500"
        },
        {
            title: "Séché & Certifié",
            subtitle: "Taux d'humidité garanti < 20%",
            image: "/api/placeholder/800/600",
            cta: "Nos certifications",
            gradient: "from-green-500 via-teal-500 to-cyan-500"
        }
    ];

    return (
        <Layout>
            {/* Hero Section Améliorée */}
            <section className="relative min-h-screen overflow-hidden">
                {/* Background dynamique */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"
                    style={{ y: heroY, opacity: heroOpacity }}
                />

                {/* Mesh gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-transparent to-wood-500/20" />

                {/* Particules flottantes */}
                <FloatingParticles />

                {/* Contenu principal */}
                <div className="relative z-10 container-custom min-h-screen flex items-center">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
                        {/* Contenu texte */}
                        <motion.div
                            variants={heroVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-8"
                        >
                            <motion.div variants={textVariants}>
                                <motion.span
                                    className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-6"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    🔥 Nouveau : Livraison gratuite dès 500€
                                </motion.span>
                            </motion.div>

                            <motion.h1
                                variants={textVariants}
                                className="text-5xl md:text-7xl font-heading text-white leading-tight"
                            >
                                <motion.span
                                    key={currentSlide}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5 }}
                                    className="block bg-gradient-to-r from-white via-primary-200 to-white bg-clip-text text-transparent"
                                >
                                    {heroSlides[currentSlide].title}
                                </motion.span>
                            </motion.h1>

                            <motion.p
                                variants={textVariants}
                                className="text-xl md:text-2xl text-gray-300 max-w-xl"
                            >
                                {heroSlides[currentSlide].subtitle}
                            </motion.p>

                            <motion.div
                                variants={textVariants}
                                className="flex flex-col sm:flex-row gap-4"
                            >
                                <Link href="/produits">
                                    <motion.button
                                        whileHover={{
                                            scale: 1.05,
                                            boxShadow: "0 20px 40px rgba(245, 158, 11, 0.4)"
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        className="group relative px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-2xl overflow-hidden"
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            {heroSlides[currentSlide].cta}
                                            <motion.span
                                                className="group-hover:translate-x-1 transition-transform"
                                            >
                                                →
                                            </motion.span>
                                        </span>
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-500"
                                            initial={{ scale: 0, opacity: 0 }}
                                            whileHover={{ scale: 1, opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </motion.button>
                                </Link>

                                <Link href="/categories">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-8 py-4 border-2 border-white/30 text-white hover:bg-white/10 font-semibold rounded-2xl backdrop-blur-sm transition-all duration-300"
                                    >
                                        Voir les catégories
                                    </motion.button>
                                </Link>
                            </motion.div>

                            {/* Statistiques animées */}
                            <motion.div
                                variants={textVariants}
                                className="grid grid-cols-3 gap-8 pt-8"
                            >
                                {[
                                    { value: 500, suffix: "+", label: "Clients satisfaits" },
                                    { value: 48, suffix: "h", label: "Livraison rapide" },
                                    { value: 20, suffix: "%", label: "Taux d'humidité max" }
                                ].map((stat, index) => (
                                    <motion.div
                                        key={index}
                                        className="text-center"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <div className="text-3xl md:text-4xl font-heading text-primary-400">
                                            <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                                        </div>
                                        <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>

                        {/* Image/Visuel hero */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="relative"
                        >
                            <motion.div
                                key={currentSlide}
                                initial={{ opacity: 0, rotateY: 90 }}
                                animate={{ opacity: 1, rotateY: 0 }}
                                transition={{ duration: 0.6 }}
                                className="relative w-full h-96 lg:h-[600px] perspective-1000"
                            >
                                {/* Card principale */}
                                <motion.div
                                    className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl transform-gpu"
                                    whileHover={{
                                        rotateY: -5,
                                        rotateX: 5,
                                        scale: 1.02
                                    }}
                                    transition={{ type: "spring", stiffness: 100 }}
                                >
                                    {/* Gradient animé */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${heroSlides[currentSlide].gradient} opacity-90`} />

                                    {/* Pattern overlay */}
                                    <div className="absolute inset-0 bg-wood-texture opacity-20" />

                                    {/* Contenu visuel */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <motion.div
                                            animate={{
                                                rotate: [0, 5, -5, 0],
                                                scale: [1, 1.1, 1]
                                            }}
                                            transition={{
                                                duration: 4,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                            className="text-9xl"
                                        >
                                            🪵
                                        </motion.div>
                                    </div>

                                    {/* Éléments flottants */}
                                    {[
                                        { icon: "🔥", position: "top-6 right-6", delay: 0 },
                                        { icon: "🌲", position: "bottom-6 left-6", delay: 1 },
                                        { icon: "🚚", position: "top-6 left-6", delay: 2 },
                                        { icon: "⭐", position: "bottom-6 right-6", delay: 3 }
                                    ].map((element, index) => (
                                        <motion.div
                                            key={index}
                                            className={`absolute ${element.position} p-4 bg-white/20 backdrop-blur-sm rounded-2xl`}
                                            animate={{
                                                y: [-10, 10, -10],
                                                rotate: [-5, 5, -5]
                                            }}
                                            transition={{
                                                duration: 3 + index,
                                                repeat: Infinity,
                                                delay: element.delay,
                                                ease: "easeInOut"
                                            }}
                                        >
                                            <span className="text-3xl">{element.icon}</span>
                                        </motion.div>
                                    ))}

                                    {/* Glow effect */}
                                    <motion.div
                                        className="absolute inset-0 bg-white/10"
                                        animate={{ opacity: [0, 0.3, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                </motion.div>
                            </motion.div>

                            {/* Slide indicators */}
                            <div className="flex justify-center mt-8 space-x-3">
                                {heroSlides.map((_, index) => (
                                    <motion.button
                                        key={index}
                                        onClick={() => setCurrentSlide(index)}
                                        className={`h-3 rounded-full transition-all duration-300 ${index === currentSlide
                                                ? 'w-8 bg-primary-500'
                                                : 'w-3 bg-white/30 hover:bg-white/50'
                                            }`}
                                        whileHover={{ scale: 1.2 }}
                                        whileTap={{ scale: 0.9 }}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                        <motion.div
                            className="w-1 h-3 bg-white/50 rounded-full mt-2"
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </div>
                </motion.div>
            </section>

            {/* Section Catégories Améliorée */}
            <section className="py-32 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 bg-wood-texture opacity-5" />

                <div className="container-custom relative z-10">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={containerVariants}
                        className="text-center mb-20"
                    >
                        <motion.span
                            variants={textVariants}
                            className="inline-block px-6 py-3 bg-primary-100 text-primary-800 rounded-full text-sm font-semibold mb-6"
                        >
                            ✨ Notre Sélection Premium
                        </motion.span>

                        <motion.h2
                            variants={textVariants}
                            className="text-5xl md:text-6xl font-heading text-gray-900 mb-6"
                        >
                            Nos <span className="bg-gradient-to-r from-primary-600 to-wood-600 bg-clip-text text-transparent">Catégories</span>
                        </motion.h2>

                        <motion.p
                            variants={textVariants}
                            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
                        >
                            Découvrez notre sélection rigoureuse de bois de chauffage premium,
                            adapté à tous vos besoins et soigneusement séché pour un rendement optimal
                        </motion.p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {categories?.map((category, index) => (
                            <motion.div
                                key={category._id}
                                variants={cardVariants}
                                whileHover={{ y: -10 }}
                            >
                                <CategoryCard category={category} />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Section Produits Populaires Améliorée */}
            <section className="py-32 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
                {/* Background effects */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-transparent to-wood-500/10"
                    animate={{
                        background: [
                            "linear-gradient(90deg, rgba(245,158,11,0.1) 0%, transparent 50%, rgba(139,90,60,0.1) 100%)",
                            "linear-gradient(90deg, rgba(139,90,60,0.1) 0%, transparent 50%, rgba(245,158,11,0.1) 100%)"
                        ]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />

                <div className="container-custom relative z-10">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={containerVariants}
                        className="text-center mb-20"
                    >
                        <motion.span
                            variants={textVariants}
                            className="inline-block px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold mb-6"
                        >
                            🏆 Best Sellers
                        </motion.span>

                        <motion.h2
                            variants={textVariants}
                            className="text-5xl md:text-6xl font-heading mb-6"
                        >
                            Produits <span className="bg-gradient-to-r from-primary-400 to-wood-400 bg-clip-text text-transparent">Populaires</span>
                        </motion.h2>

                        <motion.p
                            variants={textVariants}
                            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
                        >
                            Nos meilleures ventes, plébiscitées par plus de 500 clients satisfaits
                        </motion.p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {featuredProducts?.map((product, index) => (
                            <motion.div
                                key={product._id}
                                variants={cardVariants}
                                whileHover={{ scale: 1.02, y: -5 }}
                            >
                                <ProductCard product={product} className="bg-white/5 backdrop-blur-sm border border-white/10" />
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={textVariants}
                        className="text-center mt-16"
                    >
                        <Link href="/produits">
                            <motion.button
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: "0 20px 40px rgba(245, 158, 11, 0.3)"
                                }}
                                whileTap={{ scale: 0.95 }}
                                className="group px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-2xl"
                            >
                                <span className="flex items-center gap-2">
                                    Voir tous les produits
                                    <motion.span
                                        className="group-hover:translate-x-1 transition-transform"
                                    >
                                        →
                                    </motion.span>
                                </span>
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* USP Section */}
            <section className="py-20 bg-gradient-to-br from-primary-50 to-wood-50">
                <div className="container-custom">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {[
                            {
                                icon: "🚚",
                                title: "Livraison Rapide",
                                description: "Livraison en 48h partout en France. Gratuite dès 500€ d'achat."
                            },
                            {
                                icon: "🏆",
                                title: "Qualité Premium",
                                description: "Bois séché naturellement, taux d'humidité garanti inférieur à 20%."
                            },
                            {
                                icon: "🔥",
                                title: "Haut Pouvoir Calorifique",
                                description: "Sélection rigoureuse des meilleures essences pour un rendement optimal."
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                variants={scaleIn}
                                className="text-center p-8 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    className="text-6xl mb-4"
                                >
                                    {item.icon}
                                </motion.div>
                                <h3 className="text-xl font-heading text-gray-800 mb-4">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600">
                                    {item.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-gray-800 text-white">
                <div className="container-custom">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeInUp}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-heading mb-4">
                            Ce que disent nos clients
                        </h2>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Plus de 500 clients nous font confiance
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {[
                            {
                                name: "Marie L.",
                                rating: 5,
                                comment: "Excellent bois, livraison rapide et soignée. Je recommande vivement !"
                            },
                            {
                                name: "Pierre D.",
                                rating: 5,
                                comment: "Qualité exceptionnelle, brûle parfaitement. Service client au top."
                            },
                            {
                                name: "Sophie M.",
                                rating: 5,
                                comment: "Très satisfaite de ma commande. Bois bien sec et conditionnement parfait."
                            }
                        ].map((testimonial, index) => (
                            <motion.div
                                key={index}
                                variants={scaleIn}
                                className="bg-gray-700 p-6 rounded-xl"
                            >
                                <div className="flex mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <span key={i} className="text-yellow-400 text-xl">⭐</span>
                                    ))}
                                </div>
                                <p className="text-gray-300 mb-4 italic">
                                    "{testimonial.comment}"
                                </p>
                                <p className="font-semibold text-primary-400">
                                    {testimonial.name}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Newsletter */}
            <section className="py-20 bg-primary-500">
                <div className="container-custom text-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeInUp}
                        className="max-w-2xl mx-auto"
                    >
                        <h2 className="text-4xl font-heading text-white mb-4">
                            Restez informé de nos offres
                        </h2>
                        <p className="text-xl text-primary-100 mb-8">
                            Inscrivez-vous à notre newsletter pour recevoir nos promotions
                            et conseils d'experts
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Votre email"
                                className="flex-1 px-6 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:outline-none"
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-3 bg-white text-primary-500 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                S'inscrire
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </Layout>
    )
}

// SSG - Récupération des données au build
export async function getStaticProps() {
    try {
        // En développement, renvoyer des données de test
        const categories = [
            {
                _id: '1',
                name: 'Bois Feuillus',
                slug: 'bois-feuillus',
                description: 'Chêne, hêtre, charme - Excellent pouvoir calorifique',
                image: '/api/placeholder/300/200'
            },
            {
                _id: '2',
                name: 'Bois Résineux',
                slug: 'bois-resineux',
                description: 'Pin, sapin - Allumage facile et rapide',
                image: '/api/placeholder/300/200'
            },
            {
                _id: '3',
                name: 'Palettes & Conditionnés',
                slug: 'palettes-conditionnes',
                description: 'Formats pratiques et prêts à l\'emploi',
                image: '/api/placeholder/300/200'
            },
            {
                _id: '4',
                name: 'Mix Économiques',
                slug: 'mix-economiques',
                description: 'Mélanges qualité prix pour usage quotidien',
                image: '/api/placeholder/300/200'
            }
        ]

        const featuredProducts = [
            {
                _id: '1',
                name: 'Bois de Chêne Premium',
                slug: 'bois-de-chene-premium',
                price: 95,
                compareAtPrice: 110,
                essence: 'chêne',
                unit: 'm³',
                images: [{ url: '/api/placeholder/400/300', alt: 'Bois de chêne', isPrimary: true }],
                badges: ['premium', 'populaire'],
                averageRating: 4.8,
                reviewCount: 24
            },
            {
                _id: '2',
                name: 'Bois de Hêtre Séché',
                slug: 'bois-de-hetre-seche',
                price: 85,
                essence: 'hêtre',
                unit: 'm³',
                images: [{ url: '/api/placeholder/400/300', alt: 'Bois de hêtre', isPrimary: true }],
                badges: ['local'],
                averageRating: 4.7,
                reviewCount: 18
            },
            {
                _id: '3',
                name: 'Palette Mix 1m³',
                slug: 'palette-mix-1m3',
                price: 95,
                essence: 'mix',
                unit: 'palette',
                images: [{ url: '/api/placeholder/400/300', alt: 'Palette mix', isPrimary: true }],
                badges: ['nouveau'],
                averageRating: 4.6,
                reviewCount: 12
            }
        ]

        return {
            props: {
                categories,
                featuredProducts
            },
            revalidate: 3600 // Revalidate every hour
        }
    } catch (error) {
        console.error('Error in getStaticProps:', error)
        return {
            props: {
                categories: [],
                featuredProducts: []
            }
        }
    }
}