/**
 * Les questions fréquentes.
 *
 * Elles vivent ici, dans les deux langues, plutôt que dans les dictionnaires
 * d'interface : ce sont des paragraphes, pas des libellés de boutons, et les
 * mêler aux 470 clés de `messages/` rendait les deux illisibles.
 *
 * **Le contenu précédent était inventé de bout en bout.** Il décrivait une
 * société lyonnaise avec trois zones de livraison françaises, un espace client,
 * le paiement par chèque et en quatre fois sans frais, un certificat d'humidité
 * joint à chaque livraison et des fournisseurs dans un rayon de cent kilomètres.
 * Rien de tout cela n'existe : la boutique ne tient pas de compte client,
 * accepte le virement et la carte, livre en Allemagne par Land, et le séchage
 * est mesuré sans être certifié par un tiers.
 *
 * Chaque réponse ci-dessous décrit ce que le site fait vraiment. Quand une
 * réponse dépend d'un réglage — le seuil de livraison gratuite, les délais —,
 * elle reprend la valeur affichée ailleurs sur le site plutôt que d'en inventer
 * une seconde.
 */

export const FAQ_CATEGORIES = [
    { id: "all", label: { de: "Alle Fragen", fr: "Toutes les questions" }, icon: "help" },
    { id: "order", label: { de: "Bestellen", fr: "Commander" }, icon: "package" },
    { id: "payment", label: { de: "Bezahlen", fr: "Payer" }, icon: "card" },
    { id: "delivery", label: { de: "Lieferung", fr: "Livraison" }, icon: "truck" },
    { id: "wood", label: { de: "Holz & Qualität", fr: "Bois & qualité" }, icon: "shield" },
]

export const FAQ_ITEMS = [
    // ── Bestellen ────────────────────────────────────────────────────────────
    {
        category: "order",
        question: {
            de: "Muss ich ein Kundenkonto anlegen?",
            fr: "Dois-je créer un compte client ?",
        },
        answer: {
            de: "Nein. Die Bestellung läuft ohne Registrierung: Ihre Angaben dienen der Lieferung und der Rechnung, mehr nicht. Es gibt kein Passwort zu merken, also auch keines zu verlieren.",
            fr: "Non. La commande se passe sans inscription : vos coordonnées servent à la livraison et à la facture, rien d'autre. Il n'y a pas de mot de passe à retenir, donc pas de mot de passe à perdre.",
        },
    },
    {
        category: "order",
        question: {
            de: "Wie finde ich meine Bestellung wieder?",
            fr: "Comment retrouver ma commande ?",
        },
        answer: {
            de: "Mit Ihrer Bestellnummer und der beim Kauf verwendeten E-Mail-Adresse, auf der Seite „Bestellung verfolgen“. Notieren Sie die Nummer beim Abschluss: sie steht auch in der Bestätigungs-E-Mail.",
            fr: "Avec votre numéro de commande et l'adresse e-mail utilisée lors de l'achat, sur la page « Suivre ma commande ». Notez ce numéro à la validation : il figure aussi dans l'e-mail de confirmation.",
        },
    },
    {
        category: "order",
        question: {
            de: "Woran sehe ich, ob ein Produkt verfügbar ist?",
            fr: "Comment savoir si un produit est disponible ?",
        },
        answer: {
            de: "Jede Produktseite nennt ihren Bestand. Ist ein Artikel ausverkauft, lässt er sich nicht in den Warenkorb legen. Die angezeigte Verfügbarkeit ist keine Reservierung: sie wird bei der Bestellung festgestellt, und ein Bestand kann zwischen zwei Bestellungen erschöpft sein.",
            fr: "Chaque fiche produit indique son stock. Un article épuisé ne peut pas être ajouté au panier. La disponibilité affichée n'est pas une réservation : elle est constatée au moment de la commande, et un stock peut s'épuiser entre deux commandes.",
        },
    },
    {
        category: "order",
        question: {
            de: "Kann ich meine Bestellung noch ändern oder stornieren?",
            fr: "Puis-je encore modifier ou annuler ma commande ?",
        },
        answer: {
            de: "Schreiben Sie uns so früh wie möglich, mit der Bestellnummer. Solange die Vorbereitung nicht begonnen hat, ist eine Änderung einfach; ist der Lastwagen beladen, ist sie es nicht mehr. Über die Website storniert sich nichts von selbst.",
            fr: "Écrivez-nous le plus tôt possible, avec le numéro de commande. Tant que la préparation n'a pas commencé, une modification est simple ; une fois le camion chargé, elle ne l'est plus. Rien ne s'annule tout seul depuis le site.",
        },
    },

    // ── Bezahlen ─────────────────────────────────────────────────────────────
    {
        category: "payment",
        question: {
            de: "Welche Zahlungsarten akzeptieren Sie?",
            fr: "Quels moyens de paiement acceptez-vous ?",
        },
        answer: {
            de: "Banküberweisung und Kartenzahlung. Welche davon zur Auswahl stehen, sehen Sie in der Übersicht Ihrer Bestellung — was dort nicht steht, ist nicht verfügbar.",
            fr: "Le virement bancaire et la carte. Ceux qui vous sont proposés apparaissent dans le récapitulatif de votre commande — ce qui n'y figure pas n'est pas disponible.",
        },
    },
    {
        category: "payment",
        question: {
            de: "Wie läuft eine Zahlung per Überweisung?",
            fr: "Comment se passe un paiement par virement ?",
        },
        answer: {
            de: "Sie erhalten unsere Bankverbindung und einen Verwendungszweck direkt nach dem Abschluss, auf der Bestellseite und per E-Mail. Übernehmen Sie den Verwendungszweck unverändert: er verbindet Ihre Zahlung mit Ihrer Bestellung. Die Vorbereitung beginnt mit dem Zahlungseingang.",
            fr: "Vous recevez nos coordonnées bancaires et une référence juste après la validation, sur la page de commande et par e-mail. Reportez la référence telle quelle : c'est elle qui relie votre paiement à votre commande. La préparation démarre à réception du paiement.",
        },
    },
    {
        category: "payment",
        question: {
            de: "Kann ich nachweisen, dass ich bezahlt habe?",
            fr: "Puis-je prouver que j'ai payé ?",
        },
        answer: {
            de: "Ja. Auf der Seite Ihrer Bestellung können Sie einen Zahlungsnachweis hochladen — Überweisungsauftrag, Kontoauszug oder Bildschirmfoto, als JPG, PNG oder PDF. Das beschleunigt die Zuordnung, wenn die Überweisung noch unterwegs ist.",
            fr: "Oui. Depuis la page de votre commande, vous pouvez déposer un justificatif — ordre de virement, relevé ou capture d'écran, en JPG, PNG ou PDF. Cela accélère le rapprochement quand le virement est encore en route.",
        },
    },
    {
        category: "payment",
        question: {
            de: "Wohin gehen meine Kartendaten?",
            fr: "Où vont mes données bancaires ?",
        },
        answer: {
            de: "Nicht zu uns. Die Kartenzahlung läuft über den Zahlungsdienstleister; wir speichern keine Kartennummer. Die Verbindung ist verschlüsselt.",
            fr: "Pas chez nous. Le paiement par carte passe par le prestataire de paiement ; nous ne conservons aucun numéro de carte. La connexion est chiffrée.",
        },
    },
    {
        category: "payment",
        question: {
            de: "Bekomme ich eine Rechnung?",
            fr: "Vais-je recevoir une facture ?",
        },
        answer: {
            de: "Ja. Die Rechnung wird nach Zahlungseingang erstellt und an die bei der Bestellung angegebene E-Mail-Adresse geschickt. Für eine gewerbliche Bestellung geben Sie bitte Firmenname und Umsatzsteuer-Identifikationsnummer im Bestellformular an.",
            fr: "Oui. La facture est établie à réception du paiement et envoyée à l'adresse e-mail indiquée lors de la commande. Pour une commande professionnelle, renseignez la raison sociale et le numéro de TVA dans le formulaire.",
        },
    },

    // ── Lieferung ────────────────────────────────────────────────────────────
    {
        category: "delivery",
        question: {
            de: "Wohin liefern Sie?",
            fr: "Où livrez-vous ?",
        },
        answer: {
            de: "In ganz Deutschland, in alle sechzehn Bundesländer, Städte und Dörfer eingeschlossen. Darüber hinaus liefern wir nach Österreich, Frankreich, Belgien, Luxemburg und in die Schweiz. Das Zielland und das Bundesland wählen Sie im Bestellformular.",
            fr: "Dans toute l'Allemagne, ses seize Länder, villes et villages compris. Au-delà, nous livrons en Autriche, en France, en Belgique, au Luxembourg et en Suisse. Le pays et le Land se choisissent dans le formulaire de commande.",
        },
    },
    {
        category: "delivery",
        question: {
            de: "Was kostet die Lieferung?",
            fr: "Combien coûte la livraison ?",
        },
        answer: {
            de: "Der Preis richtet sich nach dem Bundesland — ein Transport nach Baden-Württemberg kostet weniger als einer nach Mecklenburg-Vorpommern. Der Betrag erscheint im Warenkorb, sobald Land und Bundesland gewählt sind, und wird vor der Zahlung wiederholt. Danach kommt nichts hinzu.",
            fr: "Le prix dépend du Land — un transport vers le Bade-Wurtemberg coûte moins qu'un transport vers le Mecklembourg. Le montant apparaît dans le panier dès que le pays et le Land sont choisis, et il est rappelé avant le paiement. Rien ne s'y ajoute ensuite.",
        },
    },
    {
        category: "delivery",
        question: {
            de: "Gibt es eine Versandkostenfreigrenze?",
            fr: "Y a-t-il un seuil de livraison gratuite ?",
        },
        answer: {
            de: "Ja. Ab einem bestimmten Bestellwert zeigt die Übersicht „Kostenlos“ statt eines Tarifs. Die Grenze steht im Warenkorb, mit der Angabe, wie viel noch fehlt.",
            fr: "Oui. À partir d'un certain montant de commande, le récapitulatif affiche « Gratuite » au lieu d'un tarif. Le seuil est indiqué dans le panier, avec ce qu'il reste à atteindre.",
        },
    },
    {
        category: "delivery",
        question: {
            de: "Wie lange dauert eine Lieferung?",
            fr: "Combien de temps prend une livraison ?",
        },
        answer: {
            de: "Vier bis fünf Werktage ab Zahlungseingang. Die Spedition ruft Sie zwei bis acht Tage vorher an, um das Zeitfenster abzustimmen. In der Heizsaison, von Oktober bis Februar, kann es ein bis zwei Tage länger dauern.",
            fr: "Quatre à cinq jours ouvrés à compter de la réception du paiement. Le transporteur vous appelle deux à huit jours avant pour convenir du créneau. En saison de chauffe, d'octobre à février, comptez un à deux jours de plus.",
        },
    },
    {
        category: "delivery",
        question: {
            de: "Wie wird abgeladen?",
            fr: "Comment se passe le déchargement ?",
        },
        answer: {
            de: "Die Ware kommt auf Palette. Der Lastwagen hat eine Hebebühne oder einen Mitnahmestapler und stellt die Palette am Bordstein oder so nah wie möglich an Ihrem Haus ab — dort, wo der Lastwagen hinkommt und fest stehen kann. Der Fahrer trägt nicht in den Keller oder in den Garten.",
            fr: "La marchandise arrive sur palette. Le camion dispose d'un hayon ou d'un chariot embarqué et dépose la palette en bordure de voie ou au plus près de chez vous — là où le camion accède et peut stationner. Le chauffeur ne porte pas jusqu'à la cave ni au fond du jardin.",
        },
    },
    {
        category: "delivery",
        question: {
            de: "Was muss ich für die Anlieferung vorbereiten?",
            fr: "Que dois-je prévoir pour la livraison ?",
        },
        answer: {
            de: "Eine befestigte Zufahrt, die einen Lastzug trägt, und eine ebene Fläche zum Abstellen der Palette. Schreiben Sie Besonderheiten — enge Einfahrt, Tor, Gefälle — in das Feld „Hinweise zur Lieferung“ des Bestellformulars: der Fahrer liest sie vor der Anfahrt.",
            fr: "Un accès stabilisé qui supporte un poids lourd, et une surface plane pour poser la palette. Signalez les particularités — entrée étroite, portail, pente — dans le champ « Précisions pour la livraison » du formulaire : le chauffeur les lit avant de venir.",
        },
    },
    {
        category: "delivery",
        question: {
            de: "Was, wenn ich am Liefertag nicht da bin?",
            fr: "Et si je ne suis pas là le jour de la livraison ?",
        },
        answer: {
            de: "Sagen Sie es beim Anruf der Spedition: ein anderer Termin lässt sich dann noch vereinbaren. Eine Ablage ohne Ihre Anwesenheit ist möglich, wenn Sie sie schriftlich benennen — dann geht die Ware ab dem Abstellen auf Ihr Risiko über.",
            fr: "Dites-le lors de l'appel du transporteur : un autre créneau se convient encore à ce moment-là. Une dépose en votre absence est possible si vous la désignez par écrit — la marchandise est alors à vos risques dès le dépôt.",
        },
    },

    // ── Holz & Qualität ──────────────────────────────────────────────────────
    {
        category: "wood",
        question: {
            de: "Wie trocken ist Ihr Holz?",
            fr: "Quel est le taux d'humidité de votre bois ?",
        },
        answer: {
            de: "Unter 20 % Restfeuchte, und bei den kammergetrockneten Partien meist unter 15 %. Wir messen jede Charge vor dem Versand. Feuchtes Holz gibt etwa die Hälfte seiner Wärme ab und verrußt den Schornstein — deshalb ist das die erste Angabe auf jeder Produktseite.",
            fr: "Sous 20 % d'humidité, et le plus souvent sous 15 % pour les lots séchés au four. Nous mesurons chaque lot avant expédition. Un bois humide rend environ la moitié de sa chaleur et encrasse le conduit — c'est pourquoi c'est la première indication de chaque fiche.",
        },
    },
    {
        category: "wood",
        question: {
            de: "Welche Holzarten bieten Sie an?",
            fr: "Quelles essences proposez-vous ?",
        },
        answer: {
            de: "Vor allem Eiche, Buche und Hainbuche — Harthölzer, die lange und gleichmäßig brennen und eine gute Glut halten. Dazu Birke, die sich leicht entzündet und schnell Wärme gibt, sowie Mischpaletten, die beides verbinden.",
            fr: "Principalement le chêne, le hêtre et le charme — des bois durs qui brûlent longtemps et régulièrement, et tiennent bien la braise. S'y ajoutent le bouleau, qui s'allume facilement et donne une chaleur rapide, et des palettes de mélange qui combinent les deux.",
        },
    },
    {
        category: "wood",
        question: {
            de: "Welche Scheitlänge passt zu meinem Ofen?",
            fr: "Quelle longueur de bûche pour mon appareil ?",
        },
        answer: {
            de: "Messen Sie die Breite Ihres Brennraums und rechnen Sie etwa zehn Zentimeter ab. Üblich sind 25 cm für kleine Kaminöfen, 33 cm für die meisten Öfen und Einsätze, 50 cm für offene Kamine und große Feuerstätten. Diese drei Längen führen wir.",
            fr: "Mesurez la largeur de votre foyer et retirez une dizaine de centimètres. Les longueurs courantes sont 25 cm pour les petits poêles, 33 cm pour la plupart des poêles et inserts, 50 cm pour les cheminées et grands foyers. Nous proposons ces trois longueurs.",
        },
    },
    {
        category: "wood",
        question: {
            de: "Was bedeutet Raummeter?",
            fr: "Que signifie « stère » ?",
        },
        answer: {
            de: "Ein Raummeter ist ein Kubikmeter geschichtetes Scheitholz, einschließlich der Zwischenräume. Kürzere Scheite lassen sich dichter stapeln: derselbe Raummeter ergibt bei 33 cm mehr Holz als bei 50 cm. Auf jeder Produktseite steht das Volumen der Palette, damit sich zwei Angebote vergleichen lassen.",
            fr: "Un stère est un mètre cube de bûches empilées, espaces compris. Des bûches plus courtes se rangent plus serré : à volume égal, du 33 cm contient plus de bois que du 50 cm. Chaque fiche indique le volume de la palette, pour que deux offres se comparent.",
        },
    },
    {
        category: "wood",
        question: {
            de: "Wie lagere ich das Holz richtig?",
            fr: "Comment stocker le bois correctement ?",
        },
        answer: {
            de: "Trocken, luftig und vor Regen geschützt — am besten unter einem nach vorn offenen, seitlich und oben geschlossenen Unterstand. Stapeln Sie nicht direkt auf dem Boden und nicht dicht an eine Wand: die Luft muss durch. Unter dichter Folie eingepackt schimmelt auch trockenes Holz.",
            fr: "Au sec, à l'air, et à l'abri de la pluie — idéalement sous un abri ouvert devant, fermé sur les côtés et le dessus. N'empilez pas à même le sol ni collé à un mur : l'air doit passer. Emballé sous une bâche hermétique, même un bois sec moisit.",
        },
    },
    {
        category: "wood",
        question: {
            de: "Woher kommt Ihr Holz?",
            fr: "D'où vient votre bois ?",
        },
        answer: {
            de: "Aus deutschen Wäldern. Es wird vor Ort gespalten und getrocknet und ohne Zwischenhändler verkauft. Die Fotos und Videos auf der Startseite zeigen den Holzplatz, die Trocknung und die Verladung — so, wie sie sind.",
            fr: "De forêts allemandes. Il est fendu et séché sur place, et vendu sans intermédiaire. Les photos et vidéos de la page d'accueil montrent le parc à bois, le séchage et le chargement — tels qu'ils sont.",
        },
    },
    {
        category: "wood",
        question: {
            de: "Was tun, wenn die Lieferung nicht stimmt?",
            fr: "Que faire si la livraison n'est pas conforme ?",
        },
        answer: {
            de: "Schreiben Sie uns innerhalb weniger Tage, mit der Bestellnummer und Fotos. Holz ist ein Naturprodukt: Farbe, Stärke und ein Anteil Rinde schwanken von Partie zu Partie. Fehlt aber Menge, ist das Holz sichtlich zu feucht oder die Palette beschädigt angekommen, klären wir das — meist in wenigen Nachrichten.",
            fr: "Écrivez-nous sous quelques jours, avec le numéro de commande et des photos. Le bois est un produit naturel : la teinte, la grosseur et une part d'écorce varient d'un lot à l'autre. Mais s'il manque du volume, si le bois est visiblement trop humide ou si la palette est arrivée abîmée, nous réglons — le plus souvent en quelques messages.",
        },
    },
]
