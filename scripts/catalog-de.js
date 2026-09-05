/**
 * Traduction allemande du catalogue.
 *
 * Elle est écrite ici plutôt que saisie dans l'administration parce qu'elle
 * doit pouvoir être relue, corrigée et rejouée : `node scripts/translate-catalog.js`
 * réapplique ce fichier sur la base sans toucher au français.
 *
 * Trois décisions sur le fond, qui ne relèvent pas de la traduction :
 *
 * 1. **L'origine devient allemande.** Le catalogue français annonçait « bois
 *    d'origine France » ; le site s'adresse désormais au marché allemand et
 *    revendique du bois allemand. C'est une affirmation commerciale, pas une
 *    tournure de phrase : elle doit être vraie côté approvisionnement.
 *
 * 2. **Les certifications ne sont pas transposées.** « Certifié NF » est une
 *    marque française : la remplacer par une équivalence allemande reviendrait
 *    à inventer un certificat, ce que le droit allemand de la concurrence
 *    sanctionne durement. La mention disparaît de la version allemande plutôt
 *    que d'être traduite. En revanche DIN Plus, EN plus A1 et FSC sont des
 *    référentiels européens réellement portés par ces produits : ils restent.
 *    « BSL », propre au Royaume-Uni, tombe pour la même raison que NF.
 *
 * 3. **Les incohérences de contenu sont corrigées, pas recopiées.** Une fiche
 *    « demi-palette » annonçait 52 filets dans un texte titré 54 ; une autre
 *    parlait de granulés pour barbecue au milieu d'une fiche de briquettes.
 *    Ces passages sont réécrits en allemand sur ce que le produit est.
 */

/** Clé : le slug du produit en base. */
export const PRODUCT_TRANSLATIONS = {
    "palette-bois-de-chauffage-25-cm": {
        name: "Brennholz-Palette — 25 cm",
        shortDescription:
            "Trockene Scheite aus Eiche, Hainbuche und Buche, unter 10 % Restfeuchte. Gespalten, entrindet und getrocknet.\n\nMit 25 cm passen diese Scheite in nahezu jeden Kaminofen. Auf Palette geliefert, lassen sie sich mühelos bewegen und einlagern.",
        description: "",
        seoTitle: "Brennholz-Palette 25 cm — Eiche, Hainbuche, Buche",
        seoDescription:
            "Brennholzscheite in 25 cm, unter 10 % Restfeuchte, aus Eiche, Hainbuche und Buche. Auf Palette geliefert.",
    },

    "12-grands-sacs-a-filet-bouleau": {
        name: "12 große Netzsäcke — Birke",
        shortDescription:
            "Entspricht etwa einem gefüllten Bausack. Dieselben Scheite wie in unseren Kisten — kammergetrocknetes Hartholz. Ideal für Hanglagen, Treppen und enge Zugänge, wo eine Kiste nicht durchkommt. Bei einer Kiesauffahrt sind Netzsäcke die richtige Wahl.",
        description:
            "Beschreibung\nDie 12 Netzsäcke sind die kleinste Menge kammergetrockneten Hartholzes, die wir liefern.\nSie entsprechen ungefähr einem gefüllten Standard-Bausack. Netzsäcke sind vielseitiger als eine Kiste: sie kommen dorthin, wo der Zugang eng oder unbefestigt ist — eine Kiesauffahrt, ein paar Stufen —, lassen sich einzeln anheben, im Schuppen einlagern und Sack für Sack ins Haus tragen.\nUnsere Kunden stapeln 12 Netzsäcke im Schnitt in weniger als fünf Minuten in den Holzunterstand. Alle unsere Scheite sind auf unter 20 % Restfeuchte kammergetrocknet, meist liegt der Wert bei 15 % oder darunter.\n\nWeitere Angaben\nVersandgewicht 180 kg",
        seoTitle: "12 Netzsäcke Birke — kammergetrocknetes Brennholz",
        seoDescription:
            "12 große Netzsäcke kammergetrocknete Birkenscheite, unter 20 % Restfeuchte. Für enge Zugänge und Kiesauffahrten.",
    },

    "24-grands-sacs-a-filet-bouleau": {
        name: "24 große Netzsäcke — Birke",
        shortDescription:
            "Entspricht etwa zwei gefüllten Bausäcken. Dieselben Scheite wie in unseren Kisten — kammergetrocknetes Hartholz. Ideal für Hanglagen, Treppen und enge Zugänge. Der Fahrer stellt die Netze am Bordstein oder so nah wie möglich am Haus ab; von dort lassen sie sich von Hand weitertragen.",
        description:
            "Beschreibung\nKammergetrocknete Hartholzscheite.\n24 große Netzsäcke, was ungefähr zwei gefüllten Bausäcken entspricht. Es sind dieselben Scheite wie in unseren Kisten — kammergetrocknetes Hartholz. Sie eignen sich für Lieferungen an Häuser in Hanglage, mit Stufen oder engen Durchgängen, wo eine Kiste nicht abgestellt werden kann. Geliefert wird auf Palette; von dort lassen sich die Netze in jeden Schuppen oder Nebenraum bringen.\nBei einer Kiesauffahrt sind Netzsäcke die richtige Wahl — sie werden am Bordstein oder so nah wie möglich abgestellt und können von Hand weiterbewegt werden. Die Scheite passen in die meisten Kaminöfen und offenen Kamine. Sie sind gespalten und nicht länger als 25 cm.\n\nWeitere Angaben\nVersandgewicht 400 kg",
        seoTitle: "24 Netzsäcke Birke — kammergetrocknetes Brennholz",
        seoDescription:
            "24 große Netzsäcke kammergetrocknete Birkenscheite, rund 400 kg. Auf Palette geliefert, von Hand weiterzubewegen.",
    },

    "33-cm-melange-85p-bois-durs-palette-1-7-m3": {
        name: "33 cm — Mischholz 85 % Hartholz — Palette 1,7 m³",
        shortDescription:
            "Die Palette enthält mehrere Holzarten, überwiegend Harthölzer: Esche, Buche und Hainbuche, dazu ein Anteil weicheres Holz. Das ergibt ein gutes Gleichgewicht zwischen Glut und lebhafter Flamme, ohne den Ofen zu verrußen.",
        description:
            "Beschreibung\nPalette mit 1,7 m³, gespaltene Scheite in 33 cm, zu 85 % aus Hartholz und zu 15 % aus Edelkastanie. Natürlich getrocknet, unter 20 % Restfeuchte.\nDas Holz ist sauber auf 33 cm gespalten — das Maß, das in einen modernen Kaminofen, einen kleinen Einsatz oder einen geschlossenen Kamin passt.\nEdelkastanie ist ein weiches Laubholz: sie fängt leicht Feuer und gibt gute Wärme, brennt aber schneller ab als ein Hartholz.\n\nRestfeuchte\nUnter 20 %\nHolzart\n85 % Hartholz (Hainbuche, Esche, Buche), 15 % Edelkastanie\n\nWeitere Angaben\nVolumen\n1,7 m³\nTrocknung\nNatürlich, im Freien\nHolzart\nMischung aus Hart- und Weichholz\nScheitlänge\n33 cm",
        seoTitle: "Brennholz 33 cm — 85 % Hartholz, Palette 1,7 m³",
        seoDescription:
            "Gespaltene Scheite in 33 cm, 85 % Hartholz, natürlich getrocknet unter 20 % Restfeuchte. Palette mit 1,7 m³.",
    },

    "50-cm-melange-80p-bois-durs-palette-1-2-m3": {
        name: "50 cm — Mischholz 80 % Hartholz — Palette 1,2 m³",
        shortDescription:
            "Dieses Palettenholz besteht aus Buche, Esche, Eiche und Pappel (80 % Hartholz). Lagern Sie es belüftet und vor Nässe geschützt, damit es nicht schimmelt. Die kleine Palette eignet sich für begrenzten Lagerplatz. Sie ist mit einer zu 100 % recycelbaren Folie abgedeckt.",
        description:
            "Beschreibung\nGespaltene Scheite in 50 cm, Mischung mit 80 % Hartholz, natürlich getrocknet.\nDas Holz trocknet an der freien Luft. Dafür wird keine zusätzliche Energie aufgewendet, was den CO₂-Ausstoß gegenüber der Kammertrocknung senkt.\nDie Zusammensetzung dieser Palette bildet ab, was in unseren Wäldern wächst: überwiegend Laubhölzer — Buche, Esche, Hainbuche und Ahorn — und einige weichere Arten, die das Anzünden erleichtern, vor allem Birke und Pappel.\n\nRestfeuchte\nUnter 20 %\nHolzart\n80 % Hartholz, 20 % Weichholz\n\nWeitere Angaben\nVolumen\n1,2 m³\nTrocknung\nNatürlich, im Freien\nHolzart\nMischung aus Hart- und Weichholz\nScheitlänge\n50 cm",
        seoTitle: "Brennholz 50 cm — 80 % Hartholz, Palette 1,2 m³",
        seoDescription:
            "Gespaltene Scheite in 50 cm, 80 % Hartholz, natürlich getrocknet. Kleine Palette mit 1,2 m³ für begrenzten Lagerplatz.",
    },

    "50-cm-melange-de-bois-durs-palette-2-m3": {
        name: "50 cm — Hartholzmischung — Palette 2 m³",
        shortDescription:
            "Diese Scheite sind auf 50 cm gespalten und passen in Kamine und Kamineinsätze. Sie eignen sich für große offene und geschlossene Feuerstätten.",
        description:
            "Beschreibung\nPalette mit 2 m³, gespaltene Scheite in 50 bis 55 cm, Hartholzmischung aus Esche, Buche und Hainbuche.\nDamit Holz richtig nachtrocknet, muss es trocken, belüftet und vor Nässe geschützt lagern.\nAm besten unter einem nach vorn offenen, seitlich und oben geschlossenen Unterstand: die Luft zieht durch, der Regen bleibt draußen.\n\nRestfeuchte\nUnter 20 %\nHolzart\nHartholzmischung\n\nWeitere Angaben\nVolumen\n2 m³\nTrocknung\nNatürlich, im Freien\nHolzart\nHartholz (Laubholz)\nScheitlänge\n50 cm",
        seoTitle: "Brennholz 50 cm — Hartholz, Palette 2 m³",
        seoDescription:
            "Gespaltene Hartholzscheite in 50 cm — Esche, Buche, Hainbuche. Palette mit 2 m³, unter 20 % Restfeuchte.",
    },

    "54-filets-bouleau-kiln-dried-logs-500kg": {
        name: "54 Netzsäcke Birke, kammergetrocknet (500 kg)",
        shortDescription:
            "Wenn eine ganze Kiste Scheite zu viel ist, gibt es diese halbe Palette mit 54 Netzen. Leicht zu transportieren, abzuladen und einzulagern: rund 500 kg, mengenmäßig zwischen unserer kleinen und unserer großen Kiste.",
        description:
            "Beschreibung\nBirke ist wie Esche ein Hartholz und ein gutes Brennholz — besonders, wenn schnell Wärme gefragt ist.\nBirkenrinde ist ein hervorragender Anzünder: sie ist papierartig und verströmt einen eigenen, leicht süßlichen Geruch. Mit ihrer silbrigen, sich ablösenden Rinde ist Birke außerdem das Holz der Wahl, wenn der Stapel sichtbar bleibt. Wir empfehlen sie für gelegentliche Feuer, bei denen es schnell warm werden soll.\nIn Kombination mit langsamer brennenden Scheiten kommt sie am besten zur Geltung.\n\nWeitere Angaben\nRestfeuchte\n18 % oder weniger\nGewicht\n500 kg\nScheitlänge\n23–25 cm (passt in 95 % der Öfen)\nScheitdurchmesser\n6–15 cm\nInnenmaß des Netzes\n45 × 55 cm",
        seoTitle: "54 Netzsäcke Birke, kammergetrocknet — 500 kg",
        seoDescription:
            "Halbe Palette mit 54 Netzsäcken Birkenscheite, kammergetrocknet auf 18 % oder weniger. Scheitlänge 23–25 cm.",
    },

    "bois-de-chauffage-hetre-50-cm": {
        name: "Brennholz Buche 50 cm",
        shortDescription:
            "Brennholz nach Bedarf kaufen, statt auf Vorrat. Zusammensetzung: 90 % Hartholzarten.\n\nHolzart: Buche.",
        description:
            "Brennholz nach Bedarf kaufen, statt auf Vorrat. Zusammensetzung: 90 % Hartholzarten.\n\nHolzart: Buche.",
        seoTitle: "Brennholz Buche 50 cm",
        seoDescription: "Buchenscheite in 50 cm, 90 % Hartholz. Brennholz nach Bedarf kaufen.",
    },

    "briquettes-bois-vierge": {
        name: "Holzbriketts aus Frischholz",
        shortDescription:
            "Holzbriketts aus Frischholz erster Güte, für alle, die einen hochwertigen Brennstoff mit hoher Wärmeleistung suchen. Hergestellt aus zu 100 % regional geschlagenem, FSC-zertifiziertem Frischholz, mit einer Restfeuchte unter 20 %. Der passende Brennstoff für Scheitholzkessel, Kaminofen oder offenen Kamin — im Haus wie im Betrieb.",
        description:
            "Beschreibung\nHolzbriketts mit hoher Dichte und hohem Wärmeertrag.\nTrockener Brennstoff bedeutet niedrige Emissionen und ein Feuer ohne Ärger, bei hohem Energie- und Wärmewert.\n\nWeitere Angaben\nMaße\nLänge 1,2 m × Breite 1,2 m × Höhe 1,2 m\nUngefähres Gewicht\n960 kg\nUngefähre Brikettlänge\n25 cm\nVolumen\n2,2 m³",
        seoTitle: "Holzbriketts aus Frischholz — hohe Wärmeleistung",
        seoDescription:
            "Holzbriketts aus FSC-zertifiziertem Frischholz, unter 20 % Restfeuchte. Für Scheitholzkessel, Kaminofen und offenen Kamin.",
    },

    "briquettes-de-bois": {
        name: "Holzbriketts",
        shortDescription:
            "Geeignet für Kaminöfen, Mehrstoff-Öfen und offene Kamine, ebenso für holzbefeuerte Pizzaöfen. Brikettmaß etwa 280 × 90 mm, Heizwert rund 4,8 kWh/kg.",
        description:
            "Beschreibung\nHergestellt aus Sägenebenprodukten regionaler Herkunft.\nAnders als die meisten Briketts kommen diese ohne zugesetzte Bindeharze aus — eine Überlegung wert, wenn Nachhaltigkeit zählt.\nWeil sie kürzer ausfallen, passen sie in mehr Öfen, ohne dass man sie brechen müsste. Sie dehnen sich beim Abbrand aus, aber deutlich weniger als andere Briketts, die wir geprüft haben. Das liegt am Ausgangsmaterial und an der Art, wie sie verpresst werden.\nAuf einem eingebrannten Feuer haben wir eine Brenndauer von etwa 1,5 bis 2 Stunden gemessen.\nDanach glimmen sie eine weitere Stunde nach, insgesamt also rund drei Stunden. Wie immer hängen Brenn- und Glimmdauer vom Ofen und von der Betriebsweise ab; der Wert ist ein Mittel aus mehreren Wochen Versuch an verschiedenen Öfen.",
        seoTitle: "Holzbriketts — ohne zugesetzte Bindemittel",
        seoDescription:
            "Holzbriketts aus regionalen Sägenebenprodukten, ohne Bindeharze. Heizwert rund 4,8 kWh/kg, Brenndauer 1,5 bis 2 Stunden.",
    },

    "briquettes-de-bois-demi-palette": {
        name: "Holzbriketts — halbe Palette",
        shortDescription:
            "Hergestellt aus Sägenebenprodukten regionaler Herkunft, sind diese Briketts eine ernsthafte Alternative zu kammergetrockneten Scheiten. Sie bestehen aus verpresster Holzbiomasse — Sägemehl und Hackschnitzel.",
        description:
            "Geeignet für Kaminöfen, Mehrstoff-Öfen und offene Kamine.\nBriketts liefern je ausgegebenem Euro rund 50 % mehr Wärme als Scheitholz — sie sind trockener und dichter. Dass sie aus Holzresten anderer Fertigungen entstehen, aus Möbel- oder Bauholz, spricht zusätzlich für sie.",
        seoTitle: "Holzbriketts — halbe Palette",
        seoDescription:
            "Halbe Palette Holzbriketts aus regionalen Sägenebenprodukten. Rund 50 % mehr Wärme je Euro als Scheitholz.",
    },

    "briquettes-de-bois-palette-complete": {
        name: "Holzbriketts — ganze Palette",
        shortDescription:
            "Hergestellt aus Sägenebenprodukten regionaler Herkunft, sind diese Briketts eine ernsthafte Alternative zu kammergetrockneten Scheiten. Sie bestehen aus verpresster Holzbiomasse — Sägemehl und Hackschnitzel.",
        description:
            "Geeignet für Kaminöfen, Mehrstoff-Öfen und offene Kamine.\nBriketts liefern je ausgegebenem Euro rund 50 % mehr Wärme als Scheitholz — sie sind trockener und dichter. Dass sie aus Holzresten anderer Fertigungen entstehen, aus Möbel- oder Bauholz, spricht zusätzlich für sie.",
        seoTitle: "Holzbriketts — ganze Palette",
        seoDescription:
            "Ganze Palette Holzbriketts aus regionalen Sägenebenprodukten. Rund 50 % mehr Wärme je Euro als Scheitholz.",
    },

    "briquettes-de-bois-quart-de-palette": {
        name: "Holzbriketts — Viertelpalette",
        shortDescription:
            "Hergestellt aus Sägenebenprodukten regionaler Herkunft. Diese Briketts sind eine ernsthafte Alternative zu kammergetrockneten Scheiten und bestehen aus verpresster Holzbiomasse — Sägemehl und Hackschnitzel.",
        description:
            "Geeignet für Kaminöfen, Mehrstoff-Öfen und offene Kamine.\nBriketts liefern je ausgegebenem Euro rund 50 % mehr Wärme als Scheitholz — sie sind trockener und dichter. Dass sie aus Holzresten anderer Fertigungen entstehen, aus Möbel- oder Bauholz, spricht zusätzlich für sie.",
        seoTitle: "Holzbriketts — Viertelpalette",
        seoDescription:
            "Viertelpalette Holzbriketts aus regionalen Sägenebenprodukten. Der kleinste Gebinde­umfang unseres Sortiments.",
    },

    "granules-de-bois-de-hetre-de-60sacs-x-15kg": {
        name: "Buchenholzpellets — 60 Säcke à 15 kg",
        shortDescription:
            "Holzpellets für Pelletheizungen und Pelletöfen. Schüttdichte 800 kg/m³, Länge bis 32 mm, Restfeuchte 7 %. Nach EN plus A1.",
        description:
            "Holzpellets mit hohem Heizwert\nWirtschaftlich: Pellets sind sehr dicht und lassen sich mit niedriger Restfeuchte — unter 10 % — herstellen, was einen sehr hohen Ausbrand ermöglicht. Die hohe Dichte erlaubt außerdem ein kompaktes Lager und einen wirtschaftlichen Transport über weite Strecken.\nUmweltverträglich: Pellets sind ein nachwachsender Brennstoff, der die Netto-Kohlenstoffemissionen gegenüber fossilen Brennstoffen deutlich senkt.\n\nGewicht\n900 kg",
        seoTitle: "Buchenholzpellets EN plus A1 — 60 Säcke à 15 kg",
        seoDescription:
            "Buchenholzpellets nach EN plus A1, Schüttdichte 800 kg/m³, Restfeuchte 7 %. Palette mit 60 Säcken à 15 kg.",
    },

    "granules-de-bois-din-plus-75-sacs-x-10-kg": {
        name: "Holzpellets DIN Plus — 75 Säcke à 10 kg",
        shortDescription:
            "Heizwert über 5 kWh/kg, Schüttdichte mindestens 600 kg/m³, Durchmesser 8 mm. Restfeuchte bei Anlieferung höchstens 10 %, Aschegehalt 0,5 %.",
        description:
            "Produktart\nHolzpellets\nDas Ausgangsmaterial — Sägemehl und vergleichbare Reststoffe — läuft durch die Mühle und wird zu Holzmehl vermahlen. Die Masse geht in den Trockner und von dort in die Pelletpresse, wo sie zu Pellets verdichtet wird.\n\nGewicht\n750 kg\nHeizwert\nüber 5 kWh/kg",
        seoTitle: "Holzpellets DIN Plus — 75 Säcke à 10 kg",
        seoDescription:
            "DIN-Plus-zertifizierte Holzpellets, 8 mm, Heizwert über 5 kWh/kg, Aschegehalt 0,5 %. Palette mit 750 kg.",
    },

    "granules-de-bois-melanges-650kg-en-plus-a1": {
        name: "Holzpellets, Mischholz 650 kg — EN plus A1",
        shortDescription:
            "Diese Pellets unterscheiden sich von den üblichen Mischpaletten: sie bestehen zu 60 % aus Weichholz und zu 40 % aus Hartholz. Diese Mischung brennt sauberer und gibt mehr Wärme ab als die meisten anderen Mischungen dieser Güteklasse.",
        description:
            "Wenn Sie etwas mehr Wärme aus Ihren Pellets holen wollen, sind das die richtigen.\nDem Ausgangsmaterial wird ein höherer Feuchteanteil entzogen, was den Abbrand heißer macht. Verarbeitet werden Nadel- und Laubhölzer wie Eiche, Ahorn, Birke, Buche, Esche, Kirsche und Schwarznuss.\nDas eigentliche Merkmal dieser Pellets ist neben dem heißen, sauberen Abbrand der ausgesprochen geringe Feinanteil im Sack. Beim Einfüllen in den Ofen fällt auf, wie sauber und gleichmäßig verpresst jedes Pellet ist. Die niedrige Restfeuchte sorgt außerdem für sehr wenig Asche und keine Glanzrußbildung.\n\nFeinanteil\nunter 0,50 %",
        seoTitle: "Holzpellets Mischholz EN plus A1 — 650 kg",
        seoDescription:
            "Holzpellets nach EN plus A1, 60 % Weichholz und 40 % Hartholz, sehr geringer Feinanteil. Palette mit 650 kg.",
    },

    "palette-premium-de-25-sacs-de-15-kg-din-plus": {
        name: "Holzbriketts Premium — Palette mit 25 Säcken à 15 kg",
        shortDescription:
            "Diese Briketts sind eine ernsthafte Alternative zu Scheitholz: zu 100 % europäisch und DIN-Plus-zertifiziert. Geliefert auf Palette. Stellen Sie die Palette in Garage, Schuppen oder Keller — Spalten und Stapeln erledigen sich in Minuten. Eine Palette ersetzt ungefähr einen Klafter Scheitholz.",
        description:
            "Briketts aus 100 % Hartholz\nAnders als die meisten Presslinge sind diese kein Nebenprodukt, sondern reines Laubholz. Weder Öle noch Chemie noch Bindemittel kommen hinzu.\nDie Kammertrocknung sorgt für eine niedrige Restfeuchte und damit für einen sehr trockenen, heiß brennenden Pressling. Es wird also weniger verbraucht, um die gewünschte Temperatur zu halten — und es bleibt weniger Asche zu entsorgen.\nDIN Plus bescheinigt die Einhaltung der Anforderungen an Rohstoff, Restfeuchte, Dichte und Aschegehalt.",
        seoTitle: "Holzbriketts Premium DIN Plus — Palette 25 × 15 kg",
        seoDescription:
            "DIN-Plus-zertifizierte Hartholzbriketts ohne Bindemittel, 25 Säcke à 15 kg auf Palette. Ersetzt rund einen Klafter Scheitholz.",
    },

    "chaudiere-bois-la-nordica-lnk15-evo-17-kw": {
        name: "Scheitholzkessel — LA NORDICA LNK15 Evo 17 kW",
        shortDescription:
            "Mit dem Scheitholzkessel LNK 15 Evo von LA NORDICA heizen Sie das ganze Haus. An die Zentralheizung angeschlossen, gibt er 17,3 kW an das Wasser ab und beheizt damit ein Volumen von bis zu 495 m³.",
        description:
            "Neben einem Wirkungsgrad von 89 % nimmt dieses Gerät Scheite bis 50 cm auf.\n– Verkleidung aus emailliertem Stahl\n– Automatische Zündung\n– Digitalanzeige\n– Primär- und Sekundärluft regelbar\n– Scheitlänge: 50 cm\n– Thermische Ablaufsicherung DSA: als Option\n\nLa Nordica ist eine italienische Marke, gegründet 1968. Das Unternehmen baut moderne Heizlösungen mit hohen Wirkungsgraden und niedrigen Emissionen. Öfen, Herde und Einsätze decken ein breites Spektrum an Ansprüchen ab.",
        seoTitle: "Scheitholzkessel LA NORDICA LNK15 Evo 17 kW",
        seoDescription:
            "Scheitholzkessel mit 17,3 kW Wasserleistung und 89 % Wirkungsgrad, für Scheite bis 50 cm. Beheizt bis zu 495 m³.",
    },

    "poele-granules-tanche-vulcano-9kw": {
        name: "Raumluftunabhängiger Pelletofen Vulcano 9 kW",
        shortDescription:
            "Der raumluftunabhängige Pelletofen Vulcano mit 9 kW heizt Räume bis 90 m² schnell und wirtschaftlich. Einfach zu installieren und zu bedienen, passt er seine Leistung selbsttätig der gewünschten Temperatur an und läuft bis zu 24 Stunden ohne Nachfüllen. Die raumluftunabhängige Bauweise bringt einen Wirkungsgrad von 90,62 %. Mit dem WLAN-Modul ETNA Winet lässt er sich aus der Ferne steuern.",
        description:
            "Raumluftunabhängiger Pelletofen\nEin raumluftunabhängiger Ofen holt die Verbrennungsluft direkt von außen. Im Raum entsteht dadurch kein Luftzug und kein Kältegefühl. Weil der Wirkungsgrad höher liegt als bei raumluftabhängigen Geräten, sinkt zugleich der Pelletverbrauch. Der Anschluss ist waagerecht oder senkrecht über ein konzentrisches Rohr möglich.\n\nSchnell programmiert\nDas Bedienfeld auf der Oberseite programmiert die Heizzeiten über sieben Tage; die Wärme lässt sich ebenso von Hand regeln. Über den Raumfühler stehen zwei Betriebsarten zur Wahl: Stand-by oder Modulation. Im Stand-by schaltet der Ofen ab, sobald die Solltemperatur erreicht ist, und startet von selbst wieder, wenn sie unterschritten wird.\n\nETNA gehört zu den bekannten Marken der Holzfeuerung; die Fertigung steht in der italienischen Tradition dieses Handwerks. Die Gestaltung passt sich sowohl in einen Altbau als auch in ein modernes Haus ein.\nDie gesamte Baureihe wird nach den geltenden europäischen Normen (CE) gefertigt. Einzelheiten stehen in den Produktunterlagen.",
        seoTitle: "Pelletofen Vulcano 9 kW, raumluftunabhängig",
        seoDescription:
            "Raumluftunabhängiger Pelletofen mit 9 kW für Räume bis 90 m², Wirkungsgrad 90,62 %, bis zu 24 Stunden Autonomie, WLAN-fähig.",
    },
}

/** Clé : le slug de la catégorie en base. */
export const CATEGORY_TRANSLATIONS = {
    "bois-de-chauffage": {
        name: "Brennholz",
        shortDescription: "Gespaltene Scheite aus Hartholz, getrocknet und brennfertig.",
        description:
            "Eiche, Buche, Hainbuche und Esche, gespalten in 25, 33 oder 50 cm, auf Palette oder im Netzsack. Jede Charge wird vor dem Versand gemessen: unter 20 % Restfeuchte.",
        seoTitle: "Brennholz kaufen — Eiche, Buche, Hainbuche",
        seoDescription:
            "Trockenes Brennholz unter 20 % Restfeuchte, gespalten in 25, 33 und 50 cm. Auf Palette oder im Netzsack geliefert.",
    },
    "granules-et-pellets": {
        name: "Pellets",
        shortDescription: "Holzpellets nach DIN Plus und EN plus A1, sackweise auf Palette.",
        description:
            "Pellets für Pelletöfen und Pelletheizungen, 6 und 8 mm, mit Restfeuchte unter 10 % und geringem Aschegehalt. Auf Palette geliefert, unter Folie.",
        seoTitle: "Holzpellets kaufen — DIN Plus und EN plus A1",
        seoDescription:
            "Holzpellets nach DIN Plus und EN plus A1, Restfeuchte unter 10 %, geringer Aschegehalt. Palettenweise geliefert.",
    },
    "buches-compressees": {
        name: "Holzbriketts",
        shortDescription: "Verpresste Holzbriketts, dichter und trockener als Scheitholz.",
        description:
            "Aus Sägenebenprodukten verpresst, ohne zugesetzte Bindemittel. Sie brennen länger, hinterlassen weniger Asche und lassen sich in einem Bruchteil des Platzes lagern, den Scheitholz braucht.",
        seoTitle: "Holzbriketts kaufen — ohne Bindemittel",
        seoDescription:
            "Verpresste Holzbriketts aus Sägenebenprodukten, ohne Bindeharze. Längere Brenndauer, weniger Asche, kompakte Lagerung.",
    },
    "chaudieres-cuisinieres-et-poeles": {
        name: "Kessel, Herde und Öfen",
        shortDescription: "Heizgeräte für Scheitholz und Pellets.",
        description:
            "Scheitholzkessel, Pelletöfen und Holzherde bekannter europäischer Hersteller, gefertigt nach den geltenden CE-Normen. Leistung, Wirkungsgrad und aufnehmbare Scheitlänge stehen auf jeder Produktseite.",
        seoTitle: "Kessel, Herde und Öfen — Holz und Pellets",
        seoDescription:
            "Scheitholzkessel, Pelletöfen und Holzherde europäischer Hersteller. Leistung und Wirkungsgrad auf jeder Produktseite.",
    },
}
