/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    i18n: {
        locales: ['en', 'fr', 'de', 'es'],
        defaultLocale: 'en',
        localeDetection: true,
    },
    images: {
        domains: ['res.cloudinary.com'],
    }
}

export default nextConfig