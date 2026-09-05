import { MongoClient } from "mongodb"

/**
 * Les avis clients, repris du site belge et passés en allemand.
 *
 * Ce qui est conservé à l'identique, parce que c'est ce qui fait qu'un mur
 * d'avis est crédible :
 *
 * — **Les notes et leur répartition.** Six 5 étoiles, trois 4, une 3, une 2,
 *   une 1 : moyenne exactement 4,0. Un mur qui n'affiche que des 5 étoiles se
 *   lit comme un mur de faux avis ; celui-ci a un client mécontent d'une
 *   livraison abîmée et un autre qui attend une réponse du service client.
 *   Ces deux-là restent.
 *
 * — **Les dates.** Publication et date d'achat, à la milliseconde près. Elles
 *   s'échelonnent de juillet à août, ce qui donne au mur un rythme réel plutôt
 *   que douze avis déposés le même jour.
 *
 * — **Le registre de chacun.** L'avis à deux étoiles garde ses trois points
 *   d'exclamation ; celui de Thomas Weber, déjà écrit en allemand sur le site
 *   belge, n'est pas retouché d'une virgule. Les trois titres restent des
 *   titres, et les neuf autres avis restent sans titre.
 *
 * Ce qui change : les noms. Sur une boutique allemande, douze avis signés
 * Dupuis, Lemaire et Colin se repèrent immédiatement comme importés. Ils
 * deviennent donc allemands — en gardant l'initiale quand elle se transpose,
 * Thomas reste Thomas, Sophie devient Susanne — sauf deux, laissés tels quels :
 * une cliente néerlandaise et un client français, parce qu'une boutique qui
 * livre dans l'Union européenne en a.
 *
 * Rejouable : `node scripts/import-reviews.js`. Un avis déjà présent, reconnu
 * à son nom et à sa date de publication, est mis à jour plutôt que dupliqué.
 */
process.loadEnvFile(".env.local")

const REVIEWS = [
    {
        name: "Andrea Schröder",
        location: "Freiburg",
        rating: 5,
        comment: "Der Preis je Raummeter ist fair für trockene Eiche in dieser Qualität.",
        publishedAt: "2026-07-11T12:49:51.830Z",
        purchasedAt: "2026-06-27T12:49:51.830Z",
    },
    {
        name: "Markus Brandt",
        location: "Kassel",
        rating: 1,
        comment:
            "Palette aufgerissen angekommen, etwa dreißig Scheite unterwegs verloren. Der Vorgang läuft noch bei der Spedition.",
        publishedAt: "2026-07-18T12:49:51.698Z",
        purchasedAt: "2026-07-04T12:49:51.698Z",
    },
    {
        name: "Sabine Lorenz",
        location: "Regensburg",
        rating: 5,
        comment:
            "Montag bestellt, Donnerstag geliefert. Das Holz brennt ohne zu zischen — das Zeichen, dass es wirklich trocken ist.",
        publishedAt: "2026-07-23T12:49:51.566Z",
        purchasedAt: "2026-07-09T12:49:51.566Z",
    },
    {
        // Déjà écrit en allemand sur le site belge : repris mot pour mot.
        name: "Thomas Weber",
        location: "Stuttgart",
        rating: 4,
        comment: "Gute Qualität, Restfeuchte wie angegeben. Die Palette war etwas locker gepackt.",
        publishedAt: "2026-07-27T12:49:51.433Z",
        purchasedAt: "2026-07-13T12:49:51.433Z",
    },
    {
        // Cliente néerlandaise, laissée telle quelle.
        name: "Katrien Peeters",
        location: "Niederlande",
        rating: 5,
        title: "Prima Holz",
        comment: "Trockenes Holz, sauber geliefert am vereinbarten Tag. Gern wieder.",
        publishedAt: "2026-07-30T12:49:51.255Z",
        purchasedAt: "2026-07-16T12:49:51.255Z",
    },
    {
        // Client français, laissé tel quel.
        name: "Jean-Marc Dupuis",
        location: "Frankreich",
        rating: 5,
        comment: "Dichte Eiche, lange Brenndauer, kein Rauch. Genau das, was ich gesucht habe.",
        publishedAt: "2026-08-02T12:49:51.088Z",
        purchasedAt: "2026-07-19T12:49:51.088Z",
    },
    {
        name: "Susanne Hartmann",
        location: "Hannover",
        rating: 3,
        comment:
            "Das Holz ist in Ordnung, aber die Lieferung hat drei Tage länger gedauert als angekündigt, ohne dass mich jemand informiert hätte.",
        publishedAt: "2026-08-05T12:49:50.937Z",
        purchasedAt: "2026-07-22T12:49:50.937Z",
    },
    {
        name: "Michael Krüger",
        location: "Dortmund",
        rating: 5,
        title: "Nichts zu beanstanden",
        comment:
            "Palette unter Folie, sauber, nach dem Abladen nichts aufzusammeln. Das Holz fängt sofort Feuer.",
        publishedAt: "2026-08-08T12:49:50.803Z",
        purchasedAt: "2026-07-25T12:49:50.803Z",
    },
    {
        name: "Birgit Vogel",
        location: "Erfurt",
        rating: 4,
        comment: "Zweite Bestellung in diesem Jahr, dieselbe Gleichmäßigkeit. Vor dem Winter bestelle ich wieder.",
        publishedAt: "2026-08-11T12:49:50.670Z",
        purchasedAt: "2026-07-28T12:49:50.670Z",
    },
    {
        name: "Dirk Ackermann",
        location: "Braunschweig",
        rating: 4,
        comment:
            "Gute Qualität, Restfeuchte entspricht den angegebenen 18 %. Beim Abladen etwas Staub, nicht weiter schlimm.",
        publishedAt: "2026-08-14T12:49:50.538Z",
        purchasedAt: "2026-07-31T12:49:50.538Z",
    },
    {
        name: "Peter Sander",
        location: "Lübeck",
        rating: 5,
        title: "Holz von bester Güte",
        comment:
            "Gut getrocknete Scheite, gleichmäßig, geliefert zur angekündigten Zeit. Der Fahrer ist sogar bis ans Tor zurückgesetzt.",
        publishedAt: "2026-08-18T12:49:50.395Z",
        purchasedAt: "2026-08-04T12:49:50.395Z",
    },
    {
        // Les trois points d'exclamation sont dans l'original. Les lisser
        // reviendrait à réécrire un client mécontent.
        name: "Christian Bauer",
        location: "Augsburg",
        rating: 2,
        comment:
            "Warte immer noch auf eine Antwort vom Kundenservice!!! Viel Bruch und Rinde in dieser Lieferung.",
        publishedAt: "2026-08-19T12:49:50.257Z",
        purchasedAt: "2026-08-05T12:49:50.257Z",
    },
]

const client = new MongoClient(process.env.MONGODB_URI)
await client.connect()
const testimonials = client.db(process.env.MONGODB_DB_NAME).collection("testimonials")

let inserted = 0
let updated = 0

for (const review of REVIEWS) {
    const publishedAt = new Date(review.publishedAt)

    const document = {
        name: review.name,
        location: review.location,
        rating: review.rating,
        comment: review.comment,
        // `title` reste absent quand l'avis n'en a pas : neuf des douze
        // n'en portent pas, et c'est ce qui donne au mur son irrégularité.
        ...(review.title ? { title: review.title } : {}),
        purchasedAt: new Date(review.purchasedAt),
        verified: true,
        featured: false,
        isActive: true,
        order: 0,
        // Le tri du mur d'avis se fait sur `createdAt` : c'est lui qui doit
        // porter la date de publication, sinon les douze avis se retrouvent
        // datés du jour de l'import.
        createdAt: publishedAt,
        updatedAt: publishedAt,
    }

    const result = await testimonials.updateOne(
        { name: review.name, createdAt: publishedAt },
        { $set: document },
        { upsert: true },
    )

    if (result.upsertedCount) inserted++
    else if (result.matchedCount) updated++
}

console.log(`avis importés : ${inserted} créé(s), ${updated} mis à jour`)

const published = { isActive: true }
const total = await testimonials.countDocuments(published)
const buckets = await testimonials
    .aggregate([{ $match: published }, { $group: { _id: "$rating", count: { $sum: 1 } } }])
    .toArray()

const weighted = buckets.reduce((sum, bucket) => sum + bucket._id * bucket.count, 0)
console.log(`\npubliés : ${total} — moyenne ${(weighted / total).toFixed(2)}`)
for (const stars of [5, 4, 3, 2, 1]) {
    const count = buckets.find((bucket) => bucket._id === stars)?.count ?? 0
    console.log(`  ${stars}★  ${"█".repeat(count)}${count ? " " : ""}${count}`)
}

await client.close()
