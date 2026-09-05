/**
 * Les photos et vidéos du dépôt.
 *
 * Elles vivent sur Cloudinary, dans le compte partagé avec le site belge :
 * ce sont les mêmes prises, il n'y a pas de raison de les dupliquer. Rien de
 * tout cela ne doit repasser par `public/` — voir `lib/cloudinary-url.js`.
 *
 * Les légendes décrivent ce qu'on voit réellement sur l'image. C'est la
 * condition pour qu'elles servent à quelque chose : un `alt` qui répète
 * « bois de chauffage premium » sur huit photos n'aide ni un lecteur d'écran,
 * ni un moteur de recherche, ni le visiteur qui se demande à quoi ressemble
 * l'endroit d'où part sa commande.
 *
 * Les dimensions sont déclarées plutôt que mesurées : le navigateur doit
 * réserver la place avant d'avoir téléchargé le moindre octet, sinon la page
 * saute quand l'image arrive.
 */

/** Le diaporama de l'en-tête d'accueil. */
export const HERO_SLIDES = [
    {
        publicId: "boisbe/settings/tbdcuty4yof1pyzv4w8t",
        width: 960,
        height: 1280,
        alt: {
            de: "Gassen zwischen den gestapelten Trockengittern auf dem Holzplatz, unter blauem Himmel",
            fr: "Allées entre les caisses de séchage empilées sur le parc à bois, sous un ciel bleu",
        },
        caption: {
            de: "Der Holzplatz: Gitterboxen, zum Trocknen aufeinandergestapelt",
            fr: "Le parc à bois : les caisses grillagées, empilées pour le séchage",
        },
    },
    {
        publicId: "boisbe/settings/gxb3d8mat55wovs1zyib",
        width: 1280,
        height: 960,
        alt: {
            de: "Beladener Sattelauflieger mit Gitterboxen voller Scheite, unter Folie",
            fr: "Semi-remorque chargée de caisses grillagées pleines de bûches, sous film",
        },
        caption: {
            de: "Ein beladener Lastwagen, versandfertig",
            fr: "Un camion chargé, prêt à partir",
        },
    },
    {
        publicId: "boisbe/settings/rmbo02tw5foz9qzgvg5v",
        width: 2000,
        height: 1500,
        alt: {
            de: "Mehrere Paletten mit dicht gestapelten Scheiten, unter Schrumpffolie",
            fr: "Plusieurs palettes de bûches serrées, sous housse plastifiée",
        },
        caption: {
            de: "Fertige Paletten, gestapelt und unter Folie",
            fr: "Palettes prêtes, rangées et filmées",
        },
    },
]

/** La galerie « où votre bois est stocké », sous l'en-tête. */
export const DEPOT_GALLERY = [
    {
        publicId: "boisbe/settings/jhcwicalg3wy8ppwzsge",
        width: 800,
        height: 600,
        alt: {
            de: "Holzplatz mit blauen Gitterboxen im Vordergrund und losen Scheithaufen dahinter",
            fr: "Parc à bois avec des caisses métalliques bleues au premier plan et des tas de bûches en vrac derrière",
        },
        caption: {
            de: "Der Holzplatz: Gitterboxen und lose Haufen",
            fr: "Le parc à bois : caisses métalliques et tas en vrac",
        },
    },
    {
        publicId: "boisbe/settings/akiqajighnb0oxsaljk3",
        width: 800,
        height: 533,
        alt: {
            de: "Unter einem Hallendach gestapelte Scheite, mehrere Meter hoch",
            fr: "Bûches empilées sur plusieurs mètres de haut sous la charpente d'un hangar",
        },
        caption: {
            de: "Der überdachte Teil des Lagers",
            fr: "La partie couverte du dépôt",
        },
    },
    {
        publicId: "boisbe/settings/rqpbpbdxio8gu8nnjkdd",
        width: 962,
        height: 1280,
        alt: {
            de: "Offene Lkw-Pritsche, gefüllt mit lose geschütteten Scheiten, im Hintergrund Felder",
            fr: "Benne de camion ouverte, remplie de bûches en vrac, champs à l'arrière-plan",
        },
        caption: {
            de: "Lose Schüttung, direkt auf der Pritsche",
            fr: "Livraison en vrac, à même la benne",
        },
    },
    {
        publicId: "boisbe/settings/vs30ax1jdpzuvgfx6lcc",
        width: 1280,
        height: 960,
        alt: {
            de: "Ein Mann prüft mit einem Handgerät die Ladung an der Flanke des Lastwagens",
            fr: "Un homme vérifie le chargement à l'aide d'un appareil, le long du camion",
        },
        caption: {
            de: "Letzter Blick auf die Ladung, bevor der Lastwagen abfährt",
            fr: "Dernier contrôle du chargement avant le départ",
        },
    },
    {
        publicId: "boisbe/settings/tbdcuty4yof1pyzv4w8t",
        width: 960,
        height: 1280,
        alt: {
            de: "Gassen zwischen den gestapelten Trockengittern, unter blauem Himmel",
            fr: "Allées entre les caisses de séchage empilées, sous un ciel bleu",
        },
        caption: {
            de: "Zwischen den Trockengittern",
            fr: "Entre les caisses de séchage",
        },
    },
    {
        publicId: "boisbe/settings/rmbo02tw5foz9qzgvg5v",
        width: 2000,
        height: 1500,
        alt: {
            de: "Mehrere Paletten mit dicht gestapelten Scheiten, unter Schrumpffolie",
            fr: "Plusieurs palettes de bûches serrées, sous housse plastifiée",
        },
        caption: {
            de: "Eine fertige Palette wiegt über vierhundert Kilo",
            fr: "Une palette prête pèse plus de quatre cents kilos",
        },
    },
    {
        publicId: "boisbe/settings/gxb3d8mat55wovs1zyib",
        width: 1280,
        height: 960,
        alt: {
            de: "Beladener Sattelauflieger mit Gitterboxen voller Scheite, unter Folie",
            fr: "Semi-remorque chargée de caisses grillagées pleines de bûches, sous film",
        },
        caption: {
            de: "Verladen: Gitterboxen unter Folie",
            fr: "Le chargement : caisses sous film",
        },
    },
]

/**
 * La bande de vidéos.
 *
 * Cinq prises au téléphone, toutes en portrait 576 × 1024. Le rapport est
 * déclaré ici pour que la vignette réserve sa place avant le chargement.
 */
const PORTRAIT = 576 / 1024

export const DEPOT_VIDEOS = [
    { publicId: "boisbe/videos/depot-1", ratio: PORTRAIT },
    { publicId: "boisbe/videos/depot-2", ratio: PORTRAIT },
    { publicId: "boisbe/videos/depot-3", ratio: PORTRAIT },
    { publicId: "boisbe/videos/depot-4", ratio: PORTRAIT },
    { publicId: "boisbe/videos/depot-5", ratio: PORTRAIT },
]

/**
 * Réglages de la vignette vidéo.
 *
 * Le plafond de débit est ce qui compte : sans lui, une prise de quarante
 * secondes pèse 7 Mo ; avec, 2,5 Mo. Réduire la largeur seule ne suffit pas —
 * cela baisse la définition, pas le débit alloué à chaque image.
 */
export const REEL_VIDEO = { width: 540, quality: "auto:eco", maxBitrate: "500k" }
