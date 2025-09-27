'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

import { SITE_CONFIG } from '@/constants/config'

export default function TestimonialsSection() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const testimonials = SITE_CONFIG.testimonials

    // Auto-rotation des témoignages
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [testimonials.length])

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    }

    const goToSlide = (index) => {
        setCurrentIndex(index)
    }

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
            />
        ))
    }

    return (
        <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Ce que disent nos clients
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Découvrez les témoignages de nos clients satisfaits à travers toute la France.
                    </p>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    {/* Carousel principal */}
                    <div className="relative overflow-hidden rounded-2xl">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {testimonials.map((testimonial, index) => (
                                <div
                                    key={testimonial.id}
                                    className="min-w-full px-8 py-12 bg-white shadow-xl"
                                >
                                    <div className="text-center">
                                        {/* Quote icon */}
                                        <Quote className="h-12 w-12 text-amber-400 mx-auto mb-6" />

                                        {/* Rating */}
                                        <div className="flex justify-center space-x-1 mb-6">
                                            {renderStars(testimonial.rating)}
                                        </div>

                                        {/* Comment */}
                                        <blockquote className="text-xl md:text-2xl text-gray-700 italic mb-8 leading-relaxed">
                                            "{testimonial.comment}"
                                        </blockquote>

                                        {/* Author */}
                                        <div className="flex items-center justify-center space-x-4">
                                            <div className="relative w-16 h-16 rounded-full overflow-hidden">
                                                <Image
                                                    src={testimonial.avatar}
                                                    alt={testimonial.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="text-left">
                                                <div className="font-semibold text-gray-900 text-lg">
                                                    {testimonial.name}
                                                </div>
                                                <div className="text-gray-600">
                                                    {testimonial.location}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation arrows */}
                    <button
                        onClick={prevTestimonial}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white hover:bg-amber-50 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                    >
                        <ChevronLeft className="h-6 w-6 text-gray-600" />
                    </button>

                    <button
                        onClick={nextTestimonial}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white hover:bg-amber-50 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                    >
                        <ChevronRight className="h-6 w-6 text-gray-600" />
                    </button>

                    {/* Dots indicator */}
                    <div className="flex justify-center space-x-2 mt-8">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                                        ? 'bg-amber-600 scale-125'
                                        : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Stats supplémentaires */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div>
                        <div className="text-4xl font-bold text-amber-600 mb-2">1000+</div>
                        <div className="text-gray-600">Clients satisfaits</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-amber-600 mb-2">4.9/5</div>
                        <div className="text-gray-600">Note moyenne</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-amber-600 mb-2">95%</div>
                        <div className="text-gray-600">Clients fidèles</div>
                    </div>
                </div>
            </div>
        </section>
    )
}