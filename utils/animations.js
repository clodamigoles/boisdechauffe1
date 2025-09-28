// Variants pour les animations de page
export const pageVariants = {
    initial: {
        opacity: 0,
        y: 20
    },
    enter: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.43, 0.13, 0.23, 0.96]
        }
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.3,
            ease: [0.43, 0.13, 0.23, 0.96]
        }
    }
}

// Variants pour le hero
export const heroVariants = {
    initial: {
        opacity: 0,
        y: 60
    },
    enter: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 1.2,
            ease: [0.43, 0.13, 0.23, 0.96],
            staggerChildren: 0.2
        }
    }
}

// Variants pour les conteneurs avec enfants
export const containerVariants = {
    initial: {
        opacity: 0
    },
    animate: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3
        }
    },
    exit: {
        opacity: 0,
        transition: {
            staggerChildren: 0.05,
            staggerDirection: -1
        }
    }
}

// Variants pour les éléments individuels
export const itemVariants = {
    initial: (custom) => ({
        opacity: 0,
        y: 50,
        scale: 0.9,
        transition: {
            delay: custom * 0.1
        }
    }),
    animate: (custom) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.6,
            ease: [0.43, 0.13, 0.23, 0.96],
            delay: custom * 0.1
        }
    }),
    exit: {
        opacity: 0,
        y: -20,
        scale: 0.95,
        transition: {
            duration: 0.3
        }
    }
}

// Variants pour les éléments flottants
export const floatingVariants = {
    initial: {
        y: 0,
        opacity: 0.3
    },
    animate: {
        y: [-20, 20, -20],
        opacity: [0.3, 0.8, 0.3],
        transition: {
            duration: 6,
            ease: "easeInOut",
            repeat: Infinity
        }
    }
}

// Variants pour les cartes de produits
export const cardVariants = {
    initial: {
        opacity: 0,
        scale: 0.9,
        y: 50
    },
    animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.43, 0.13, 0.23, 0.96]
        }
    },
    hover: {
        y: -8,
        scale: 1.02,
        transition: {
            duration: 0.3,
            ease: "easeOut"
        }
    },
    tap: {
        scale: 0.98
    }
}

// Variants pour les boutons
export const buttonVariants = {
    initial: {
        scale: 1
    },
    hover: {
        scale: 1.05,
        transition: {
            duration: 0.2,
            ease: "easeOut"
        }
    },
    tap: {
        scale: 0.95,
        transition: {
            duration: 0.1
        }
    }
}

// Variants pour les modales et overlays
export const modalVariants = {
    initial: {
        opacity: 0,
        scale: 0.8,
        y: 50
    },
    animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: [0.43, 0.13, 0.23, 0.96]
        }
    },
    exit: {
        opacity: 0,
        scale: 0.8,
        y: 50,
        transition: {
            duration: 0.2
        }
    }
}

// Variants pour les overlays
export const overlayVariants = {
    initial: {
        opacity: 0
    },
    animate: {
        opacity: 1,
        transition: {
            duration: 0.3
        }
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.2
        }
    }
}

// Variants pour les slideshows
export const slideVariants = {
    enter: (direction) => ({
        x: direction > 0 ? 1000 : -1000,
        opacity: 0
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1
    },
    exit: (direction) => ({
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0
    })
}

// Transitions personnalisées
export const transitions = {
    spring: {
        type: "spring",
        stiffness: 500,
        damping: 30
    },
    smooth: {
        ease: [0.43, 0.13, 0.23, 0.96],
        duration: 0.6
    },
    quick: {
        ease: "easeOut",
        duration: 0.3
    },
    bounce: {
        type: "spring",
        stiffness: 300,
        damping: 20
    }
}

// Variants pour les révélations au scroll
export const revealVariants = {
    hidden: {
        opacity: 0,
        y: 75
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.43, 0.13, 0.23, 0.96]
        }
    }
}

// Variants pour les animations de texte
export const textVariants = {
    hidden: {
        opacity: 0,
        y: 20
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut"
        }
    }
}

// Variants pour les animations de fade
export const fadeVariants = {
    initial: {
        opacity: 0
    },
    animate: {
        opacity: 1,
        transition: {
            duration: 0.6
        }
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.3
        }
    }
}

// Variants pour les animations de scale
export const scaleVariants = {
    initial: {
        scale: 0.8,
        opacity: 0
    },
    animate: {
        scale: 1,
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: [0.43, 0.13, 0.23, 0.96]
        }
    },
    exit: {
        scale: 0.8,
        opacity: 0,
        transition: {
            duration: 0.3
        }
    }
}

// Fonction utilitaire pour créer des délais échelonnés
export const staggerDelay = (index, baseDelay = 0.1) => ({
    delay: index * baseDelay
})

// Fonction utilitaire pour les animations de reveal au scroll
export const createRevealAnimation = (delay = 0) => ({
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true, amount: 0.1 },
    transition: { delay }
})

// Variants pour les notifications/toasts
export const toastVariants = {
    initial: {
        opacity: 0,
        y: -50,
        scale: 0.3
    },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: [0.43, 0.13, 0.23, 0.96]
        }
    },
    exit: {
        opacity: 0,
        y: -50,
        scale: 0.5,
        transition: {
            duration: 0.2
        }
    }
}