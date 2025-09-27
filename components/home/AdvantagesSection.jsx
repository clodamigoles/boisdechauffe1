import { SITE_CONFIG } from '@/constants/config'

export default function AdvantagesSection() {
    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Pourquoi nous choisir ?
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Découvrez les avantages qui font de nous votre partenaire de confiance
                        pour tous vos besoins en bois de chauffage.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {SITE_CONFIG.advantages.map((advantage, index) => (
                        <div
                            key={index}
                            className="group bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center"
                        >
                            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                {advantage.icon}
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                {advantage.title}
                            </h3>

                            <p className="text-gray-600 leading-relaxed">
                                {advantage.description}
                            </p>

                            {/* Petite animation de bordure */}
                            <div className="mt-6 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                        </div>
                    ))}
                </div>

                {/* Section avec garanties supplémentaires */}
                <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <span className="text-2xl">✅</span>
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">Satisfaction Garantie</h4>
                            <p className="text-gray-600 text-sm">Remboursement si non satisfait</p>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <span className="text-2xl">🏆</span>
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">Certifié PEFC</h4>
                            <p className="text-gray-600 text-sm">Gestion durable des forêts</p>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                                <span className="text-2xl">🔥</span>
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">Haut Pouvoir Calorifique</h4>
                            <p className="text-gray-600 text-sm">Maximum de chaleur</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}