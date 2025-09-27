export const SITE_CONFIG = {
    name: "BoisChauffage Pro",
    tagline: "Bois de Chauffage Premium",
    description: "Livraison dans toute la France",
    email: "contact@boischauffagepro.fr",
    phone: "01 23 45 67 89",
    address: "123 Route Forestière, 45000 Orléans",

    // SEO
    seo: {
        title: "BoisChauffage Pro - Bois de Chauffage Premium",
        description: "Vente de bois de chauffage sec et premium. Livraison rapide dans toute la France. Chêne, hêtre, charme de qualité supérieure.",
        keywords: "bois de chauffage, bois sec, livraison france, chêne, hêtre, palette bois"
    },

    // Hero section
    hero: {
        title: "Bois de Chauffage Premium",
        subtitle: "Livraison dans toute la France",
        ctaText: "Voir nos produits",
        backgroundImage: "/images/hero-bois-chauffage.jpg"
    },

    // Avantages
    advantages: [
        {
            icon: "🌳",
            title: "Qualité Premium",
            description: "Bois sec < 20% humidité, certifié PEFC"
        },
        {
            icon: "🚛",
            title: "Livraison France",
            description: "Expédition rapide dans toute la France"
        },
        {
            icon: "💰",
            title: "Prix Compétitifs",
            description: "Meilleur rapport qualité-prix du marché"
        },
        {
            icon: "📞",
            title: "Service Client",
            description: "Équipe réactive et professionnelle"
        }
    ],

    // Produits populaires (à remplacer par API)
    featuredProducts: [
        {
            id: 1,
            name: "Bois de Chêne",
            essence: "Chêne Premium",
            price: 95,
            unit: "m³",
            image: "/images/products/chene.jpg",
            badge: "Populaire"
        },
        {
            id: 2,
            name: "Bois de Hêtre",
            essence: "Hêtre Séché",
            price: 85,
            unit: "m³",
            image: "/images/products/hetre.jpg",
            badge: null
        },
        {
            id: 3,
            name: "Bois de Charme",
            essence: "Charme Calibré",
            price: 90,
            unit: "m³",
            image: "/images/products/charme.jpg",
            badge: "Nouveau"
        },
        {
            id: 4,
            name: "Mix Feuillus",
            essence: "Mélange Premium",
            price: 80,
            unit: "m³",
            image: "/images/products/mix.jpg",
            badge: "Économique"
        }
    ],

    // Témoignages
    testimonials: [
        {
            id: 1,
            name: "Marie Dubois",
            location: "Lyon",
            rating: 5,
            comment: "Excellent bois, très sec et bien conditionné. Livraison rapide !",
            avatar: "/images/avatars/marie.jpg"
        },
        {
            id: 2,
            name: "Pierre Martin",
            location: "Bordeaux",
            rating: 5,
            comment: "Service impeccable, je recommande vivement. Bois de qualité.",
            avatar: "/images/avatars/pierre.jpg"
        },
        {
            id: 3,
            name: "Sophie Laurent",
            location: "Lille",
            rating: 5,
            comment: "Prix très correct et produit conforme. Parfait pour ma cheminée.",
            avatar: "/images/avatars/sophie.jpg"
        }
    ],

    // Navigation
    navigation: [
        { name: "Accueil", href: "/" },
        { name: "Produits", href: "/produits" },
        { name: "À propos", href: "/a-propos" },
        { name: "Contact", href: "/contact" }
    ],

    // Footer links
    footerLinks: {
        legal: [
            { name: "Mentions légales", href: "/mentions-legales" },
            { name: "CGV", href: "/cgv" },
            { name: "Politique de confidentialité", href: "/confidentialite" }
        ],
        help: [
            { name: "FAQ", href: "/faq" },
            { name: "Livraison", href: "/livraison" },
            { name: "Retours", href: "/retours" }
        ],
        social: [
            { name: "Facebook", href: "https://facebook.com", icon: "facebook" },
            { name: "Instagram", href: "https://instagram.com", icon: "instagram" }
        ]
    }
}