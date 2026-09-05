/**
 * Construction des URLs Cloudinary.
 *
 * Rien de lourd ne sort de `public/` : un fichier posé là est tiré depuis
 * l'origine par chaque point de présence du CDN qui ne l'a pas encore, et un
 * lecteur vidéo découpe sa demande en plages d'octets qui ratent le cache
 * séparément. Le projet jumeau (boisbe) a été suspendu pour ça — 29 Go de
 * transfert en une journée pour cinq MP4 de 26 Mo au total.
 *
 * Les médias vivent donc sur Cloudinary, qui les transcode, les redimensionne
 * et plafonne leur débit. Le compte est partagé avec boisbe (`dmqa0y4vd`) :
 * les prises du dépôt sont les mêmes et n'ont pas à être dupliquées.
 */
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dmqa0y4vd"

/**
 * Une image, redimensionnée et servie au format que le navigateur préfère.
 * Sans `width` ni `height` on laisse l'original : utile pour un logo.
 */
export function cloudinaryUrl(publicId, { width, height, crop = "fill" } = {}) {
    if (!publicId) return ""
    // Une URL déjà complète (l'ancien champ `image` des catégories en contient)
    // passe telle quelle : ce n'est pas à l'appelant de faire le tri.
    if (/^https?:\/\//.test(publicId)) return publicId

    const parts = ["f_auto", "q_auto"]
    if (width) parts.push(`w_${width}`)
    if (height) parts.push(`h_${height}`)
    if (width || height) parts.push(`c_${crop}`)

    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${parts.join(",")}/${publicId}`
}

/**
 * Une vidéo, avec plafond de débit.
 *
 * `maxBitrate` est le réglage qui compte : sans lui une prise de quarante
 * secondes pèse 7 Mo, avec lui 2,5 Mo. La largeur seule ne suffit pas — elle
 * réduit la définition, pas le débit alloué à chaque image.
 */
export function cloudinaryVideoUrl(
    publicId,
    { width = 1200, quality = "auto:eco", maxBitrate = "900k" } = {},
) {
    if (!publicId) return ""
    const parts = ["f_auto", `q_${quality}`, `w_${width}`, `br_${maxBitrate}`]
    return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${parts.join(",")}/${publicId}`
}

/**
 * La première image d'une vidéo, en JPEG — l'affiche pendant que rien ne
 * charge. `so_0` demande la seconde zéro.
 */
export function cloudinaryVideoPosterUrl(publicId, { width, height, crop = "fill" } = {}) {
    if (!publicId) return ""
    const parts = ["f_auto", "q_auto", "so_0"]
    if (width) parts.push(`w_${width}`)
    if (height) parts.push(`h_${height}`)
    if (width || height) parts.push(`c_${crop}`)
    return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${parts.join(",")}/${publicId}.jpg`
}
