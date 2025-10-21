import { motion } from 'framer-motion'
import Image from 'next/image'

export default function TestimonialCard({ testimonial, featured = false, compact = false }) {
    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <span
                key={i}
                className={`${i < rating ? 'text-yellow-400' : 'text-gray-300'} ${featured ? 'text-xl' : 'text-sm'
                    }`}
            >
                ⭐
            </span>
        ))
    }

    if (compact) {
        return (
            <div className="text-center">
                {/* Avatar */}
                <div className="w-16 h-16 mx-auto mb-4 relative">
                    <Image
                        src={testimonial.avatar || '/images/avatars/default.jpg'}
                        alt={testimonial.name}
                        fill
                        className="rounded-full object-cover border-2 border-gray-200"
                    />
                    {testimonial.verified && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                        </div>
                    )}
                </div>

                {/* Étoiles */}
                <div className="flex justify-center mb-3">
                    {renderStars(testimonial.rating)}
                </div>

                {/* Commentaire */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    "{testimonial.shortComment || testimonial.comment}"
                </p>

                {/* Auteur */}
                <div>
                    <div className="font-semibold text-gray-900 text-sm">
                        {testimonial.name}
                    </div>
                    <div className="text-xs text-gray-500">
                        {testimonial.location}
                    </div>
                </div>
            </div>
        )
    }

    if (featured) {
        return (
            <div className="text-center max-w-3xl mx-auto">
                {/* Citation principale */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="text-6xl text-amber-400 mb-4">"</div>
                    <blockquote className="text-2xl md:text-3xl text-gray-700 font-medium leading-relaxed mb-6">
                        {testimonial.comment}
                    </blockquote>
                    <div className="text-6xl text-amber-400 transform rotate-180">"</div>
                </motion.div>

                {/* Étoiles */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="flex justify-center mb-6"
                >
                    {renderStars(testimonial.rating)}
                </motion.div>

                {/* Auteur */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="flex items-center justify-center space-x-4"
                >
                    <div className="w-16 h-16 relative">
                        <Image
                            src={testimonial.avatar || '/images/avatars/default.jpg'}
                            alt={testimonial.name}
                            fill
                            className="rounded-full object-cover border-3 border-amber-200"
                        />
                        {testimonial.verified && (
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                                <span className="text-white text-xs">✓</span>
                            </div>
                        )}
                    </div>

                    <div className="text-left">
                        <div className="font-bold text-xl text-gray-900">
                            {testimonial.name}
                        </div>
                        <div className="text-gray-600">
                            {testimonial.location}
                        </div>
                        {testimonial.productPurchased && (
                            <div className="text-sm text-amber-600 font-medium">
                                A acheté : {testimonial.productPurchased}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        )
    }

    // Version par défaut
    return (
        <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
        >
            {/* En-tête */}
            <div className="flex items-start space-x-4 mb-4">
                <div className="w-12 h-12 relative flex-shrink-0">
                    <Image
                        src={testimonial.avatar || '/images/avatars/default.jpg'}
                        alt={testimonial.name}
                        fill
                        className="rounded-full object-cover"
                    />
                    {testimonial.verified && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                        </div>
                    )}
                </div>

                <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                        <div className="font-semibold text-gray-900">
                            {testimonial.name}
                        </div>
                        <div className="flex">
                            {renderStars(testimonial.rating)}
                        </div>
                    </div>
                    <div className="text-sm text-gray-500">
                        {testimonial.location}
                    </div>
                </div>
            </div>

            {/* Commentaire */}
            <blockquote className="text-gray-600 mb-4 leading-relaxed">
                "{testimonial.shortComment || testimonial.comment}"
            </blockquote>

            {/* Produit acheté */}
            {testimonial.productPurchased && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                        Produit acheté :
                    </div>
                    <div className="text-sm font-medium text-amber-600">
                        {testimonial.productPurchased}
                    </div>
                </div>
            )}

            {/* Badge vérifié */}
            {testimonial.verified && (
                <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                    <span className="mr-1">✓</span>
                    Achat vérifié
                </div>
            )}
        </motion.div>
    )
}