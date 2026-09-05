/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    /**
     * Deux marchés, deux langues.
     *
     * L'allemand est la langue par défaut : c'est le marché visé, et le
     * routage du Pages Router sert la langue par défaut sans préfixe. Une
     * visite sur `/brennholz` est donc allemande, `/fr/brennholz` française.
     *
     * La détection par `Accept-Language` est active — c'est le défaut, et le
     * schéma de configuration n'accepte que `false` en valeur explicite. Un
     * visiteur dont le navigateur réclame le français est envoyé une fois vers
     * `/fr` ; son choix explicite est ensuite mémorisé par Next dans le cookie
     * `NEXT_LOCALE`, qui l'emporte sur l'en-tête.
     */
    i18n: {
        locales: ["de", "fr"],
        defaultLocale: "de",
    },

    images: {
        remotePatterns: [
            { protocol: "https", hostname: "res.cloudinary.com" },
        ],
    },
}

export default nextConfig
