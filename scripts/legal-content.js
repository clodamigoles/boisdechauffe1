/**
 * Les quatre textes légaux, en allemand et en français.
 *
 * ⚠ **À faire relire par un juriste avant mise en ligne commerciale.** Ces
 * textes décrivent fidèlement ce que la boutique fait — c'est déjà beaucoup
 * plus que ce qu'il y avait — mais un site français qui vend en Allemagne
 * relève de deux droits à la fois, et le détail de l'Impressum comme celui du
 * droit de rückgabe se vérifie, il ne se déduit pas.
 *
 * Ce qui s'y trouvait avant : quatre textes générés en français dans le code,
 * décrivant une société sans nom, sans numéro d'immatriculation, sans adresse,
 * qui vendait « du bois de chauffage de qualité premium » avec un « service
 * client personnalisé ». Aucun n'aurait tenu devant une mise en demeure.
 *
 * Les valeurs entre accolades — {company}, {street}, {siren} — sont remplacées
 * au moment de l'écriture par les paramètres réels de la société : le texte ne
 * duplique donc pas des données qui vivent déjà ailleurs.
 */

export const LEGAL_CONTENT = {
    // ── Impressum / Mentions légales ─────────────────────────────────────────
    mentionsLegales: {
        de: `# Impressum

## Anbieter

**{company}**
{street}
{postalCode} {city}, {country}

Handelsregisternummer (SIREN): {siren}
Umsatzsteuer-Identifikationsnummer: {siret}

E-Mail: {email}
Telefon: {phone}

## Gegenstand dieser Website

Diese Website ist ein Online-Shop für Brennholz, offen für Privatpersonen wie für Gewerbetreibende, mit Lieferung nach Deutschland und in weitere Länder der Europäischen Union. Die Verkaufsbedingungen stehen in den [Allgemeinen Geschäftsbedingungen](/cgv), die Bestandteil jedes hier geschlossenen Vertrags sind.

## Verantwortlich für den Inhalt

Die oben genannte Gesellschaft, vertreten durch ihre gesetzliche Vertretung.

## Geistiges Eigentum

Texte, Fotografien, Illustrationen, das Logo und die Gestaltung dieser Website gehören uns oder werden mit Zustimmung ihrer Inhaber verwendet. Sie dürfen ohne vorherige schriftliche Erlaubnis weder ganz noch teilweise vervielfältigt, verbreitet oder weiterverwendet werden.

Andernorts genannte Marken und Namen — Zahlungsdienstleister, Speditionen, Hersteller von Heizgeräten — bleiben Eigentum ihrer jeweiligen Inhaber und werden nur zur Information erwähnt.

## Inhalt der Website

Wir pflegen diese Website mit Sorgfalt. Ein Fehler bleibt möglich: eine Beschreibung, ein Foto oder eine Eigenschaft kann vom gelieferten Produkt abweichen. Holz ist ein Naturstoff, dessen angegebene Maße, Volumen und Gewichte Richtwerte sind und keine Stück für Stück garantierten Messungen.

Einen Fehler melden Sie bitte schriftlich an die oben genannte Adresse: wir berichtigen, was zu berichtigen ist.

## Links zu anderen Websites

Einige Seiten verweisen auf Websites, die wir nicht betreiben — Zahlungsdienstleister, Behörden, Herstellerdokumentation. Diese Links stehen zu Ihrer Bequemlichkeit dort; für ihren Inhalt sind deren Herausgeber verantwortlich, nicht wir.

## Personenbezogene Daten

Die Verarbeitung Ihrer Daten ist in der [Datenschutzerklärung](/politique-confidentialite) beschrieben. Was die Website in Ihrem Browser speichert, steht in der [Cookie-Richtlinie](/cookies).

## Streitbeilegung

Wir sind weder bereit noch verpflichtet, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen. Bei einer Meinungsverschiedenheit suchen wir zuerst die direkte Lösung: schreiben Sie uns, die meisten Fälle klären sich in wenigen Nachrichten.`,

        fr: `# Mentions légales

## Éditeur

**{company}**
{street}
{postalCode} {city}, {country}

SIREN : {siren}
SIRET : {siret}

E-mail : {email}
Téléphone : {phone}

## Objet du site

Ce site est une boutique en ligne de bois de chauffage, ouverte aux particuliers comme aux professionnels, avec livraison en Allemagne et dans d'autres pays de l'Union européenne. Les conditions de vente figurent dans les [conditions générales de vente](/cgv), qui font partie de chaque contrat conclu ici.

## Responsable de la publication

La société mentionnée ci-dessus, représentée par son représentant légal.

## Propriété intellectuelle

Les textes, photographies, illustrations, le logo et la mise en page de ce site nous appartiennent ou sont utilisés avec l'accord de leurs titulaires. Ils ne peuvent être reproduits, diffusés ni réutilisés, en tout ou partie, sans autorisation écrite préalable.

Les marques et noms cités ailleurs sur ce site — prestataires de paiement, transporteurs, fabricants d'appareils de chauffage — restent la propriété de leurs titulaires respectifs et ne sont mentionnés qu'à titre d'information.

## Contenu du site

Nous entretenons ce site avec soin. Une erreur reste possible : une description, une photo ou une caractéristique peut différer du produit livré. Le bois est une matière naturelle, dont les dimensions, volumes et poids annoncés sont des ordres de grandeur, non des mesures garanties pièce par pièce.

Pour signaler une erreur, écrivez à l'adresse ci-dessus : nous corrigeons ce qui doit l'être.

## Liens vers d'autres sites

Certaines pages renvoient vers des sites que nous n'exploitons pas — prestataires de paiement, administrations, documentation de fabricants. Ces liens sont là pour votre commodité ; leur contenu relève de leurs éditeurs, pas de nous.

## Données personnelles

Le traitement de vos données est décrit dans la [politique de confidentialité](/politique-confidentialite). Ce que le site stocke dans votre navigateur figure dans la [politique de cookies](/cookies).

## Litiges

En cas de désaccord, nous cherchons d'abord la solution directe : écrivez-nous, la plupart des cas se règlent en quelques messages.`,
    },

    // ── AGB / CGV ────────────────────────────────────────────────────────────
    cgv: {
        de: `# Allgemeine Geschäftsbedingungen

Diese Bedingungen gelten für jeden auf dieser Website geschlossenen Kauf. Ihre Annahme ist Voraussetzung für eine Bestellung: das dafür vorgesehene Kästchen muss angekreuzt werden, und Ihre Annahme wird mit Datum gespeichert. Anwendbar ist die zum Zeitpunkt Ihrer Bestellung geltende Fassung.

Verkäufer ist das im [Impressum](/mentions-legales) genannte Unternehmen.

## Artikel 1 — Anwendungsbereich

Diese Bedingungen gelten für Verbraucher wie für gewerbliche Käufer. Die verbraucherschützenden Bestimmungen — Widerrufsrecht, gesetzliche Gewährleistung — kommen nur natürlichen Personen zugute, die zu Zwecken handeln, die ihrer gewerblichen oder selbständigen beruflichen Tätigkeit nicht zugerechnet werden können.

Entgegenstehende Einkaufsbedingungen eines gewerblichen Käufers gelten uns gegenüber nicht, außer wir haben ihnen schriftlich zugestimmt.

## Artikel 2 — Produkte

Brennholz ist ein Naturprodukt. Die auf den Produktseiten angegebenen Längen, Volumen und Gewichte sind **Richtwerte**, an repräsentativen Partien gemessen, und keine für jedes einzelne Scheit garantierten Maße. Die Fotografien veranschaulichen das Produkt, ohne eine vertragliche Beschreibung darzustellen: Farbton, Stärke, Rindenanteil und Aussehen schwanken von Partie zu Partie.

Jede Produktseite nennt ihre Verfügbarkeit. Ein als nicht verfügbar gekennzeichnetes Produkt kann nicht bestellt werden. Die angezeigte Verfügbarkeit ist keine Reservierung: sie wird bei der Bestellung festgestellt, und ein Bestand kann zwischen zwei Bestellungen erschöpft sein.

## Artikel 3 — Preise

Die Preise verstehen sich in Euro, inklusive der gesetzlichen Umsatzsteuer, zuzüglich Versandkosten.

Die Versandkosten richten sich nach dem Zielland und, innerhalb Deutschlands, nach dem Bundesland. Sie erscheinen im Warenkorb, sobald Land und Bundesland gewählt sind, und werden vor jeder Zahlung in der Übersicht wiederholt. Ab einem in der Übersicht genannten Bestellwert entfallen sie.

Verbindlich ist der Preis, der in der Übersicht steht, wenn Sie abschließen. Ein offensichtlicher Preisfehler — ein Tarif ohne Bezug zum Wert des Produkts — bindet uns nicht; wir informieren Sie unverzüglich, und es steht Ihnen frei, die Bestellung zu stornieren.

## Artikel 4 — Bestellung

Die Bestellung erfolgt ohne Anlegen eines Kontos. Sie verläuft in drei Schritten: Warenkorb, Ihre Angaben und die Lieferadresse, dann die Zahlung. Bis zum Abschluss können Sie zu jedem Schritt zurückkehren; der Abschluss gilt als Annahme des Preises, der Versandkosten und dieser Bedingungen.

Nach dem Abschluss erhalten Sie eine Bestätigung per E-Mail, mit Ihrer Bestellnummer. Bewahren Sie diese Nummer auf: mit ihr und Ihrer E-Mail-Adresse verfolgen Sie Ihre Bestellung.

## Artikel 5 — Zahlung

Zur Verfügung stehen die Zahlungsarten, die in der Übersicht Ihrer Bestellung erscheinen: Banküberweisung und Kartenzahlung.

Bei Überweisung erhalten Sie unsere Bankverbindung und einen Verwendungszweck. Übernehmen Sie den Verwendungszweck unverändert: er verbindet Ihre Zahlung mit Ihrer Bestellung. **Die Vorbereitung beginnt mit dem Zahlungseingang.** Geht die Zahlung nicht innerhalb der genannten Frist ein, kann die Bestellung storniert werden.

Kartenzahlungen laufen über den Zahlungsdienstleister. Wir sehen Ihre Kartennummer nie und speichern keine Spur davon.

## Artikel 6 — Lieferung

Wir liefern nach Deutschland und in die auf der Seite [Lieferung](/livraison) genannten Länder. Außerhalb dieser Länder liefern wir nicht.

Die Ware kommt auf Palette. Der Lastwagen setzt die Palette mit Hebebühne oder Mitnahmestapler am Bordstein oder so nah wie möglich am Haus ab — dort, wo er hinkommt und sicher stehen kann. Ein Transport in den Keller, in eine Etage oder in den Garten gehört nicht zur Lieferung.

Sie sorgen für eine befestigte, für einen Lastzug befahrbare Zufahrt und für eine ebene Abstellfläche. Ist die Anlieferung aus einem Grund unmöglich, den Sie zu vertreten haben — unbefahrbare Zufahrt, unerreichbare Telefonnummer, Abwesenheit ohne Absage —, gehen die Kosten einer erneuten Anfahrt zu Ihren Lasten.

Die Lieferfrist beträgt in der Regel vier bis fünf Werktage ab Zahlungseingang und ist ein Richtwert, keine Zusicherung eines festen Termins. Die Spedition ruft vor der Anfahrt an.

## Artikel 7 — Prüfung bei Anlieferung

Prüfen Sie die Ware bei der Übergabe. Sichtbare Schäden oder eine offensichtlich fehlende Menge vermerken Sie bitte auf dem Frachtbrief, so genau wie möglich, und melden sie uns schriftlich innerhalb weniger Tage, mit Fotos. Ein Vorbehalt wie „unter Vorbehalt des Auspackens“ hilft uns gegenüber der Spedition nicht weiter.

## Artikel 8 — Widerrufsrecht

Als Verbraucher können Sie binnen **vierzehn Tagen** ab Erhalt der Ware ohne Angabe von Gründen widerrufen. Teilen Sie uns Ihren Entschluss schriftlich an die im Impressum genannte Adresse mit.

Die Rücksendung erfolgt auf Ihre Kosten und in einem Zustand, der den Weiterverkauf erlaubt: **auf der Palette, unter Folie, unausgepackt**. Angebrochenes, umgeschüttetes oder der Witterung ausgesetztes Brennholz kann nicht zurückgenommen werden. Ein Wertverlust durch einen Umgang, der zur Prüfung der Ware nicht nötig war, geht zu Ihren Lasten.

Wir erstatten den Kaufpreis und die Kosten der günstigsten von uns angebotenen Standardlieferung binnen vierzehn Tagen nach Rückerhalt der Ware.

## Artikel 9 — Gewährleistung

Es gilt die gesetzliche Mängelhaftung. Sie erfasst nicht die natürliche Beschaffenheit des Holzes — Farbe, Rindenanteil, Maßschwankungen —, sondern das, was von der Beschreibung erheblich abweicht: eine deutlich zu hohe Restfeuchte, eine fehlende Menge, eine andere als die bestellte Holzart.

Melden Sie einen Mangel schriftlich, mit der Bestellnummer und Fotos.

## Artikel 10 — Haftung

Wir haften für Schäden, die auf einer schuldhaften Verletzung unserer Pflichten beruhen. Nicht in unserer Verantwortung liegen die Wahl eines für Ihr Heizgerät ungeeigneten Brennstoffs, eine unsachgemäße Lagerung nach der Anlieferung und die Folgen einer nicht ordnungsgemäßen Feuerstätte.

## Artikel 11 — Anwendbares Recht

Für diese Verträge gilt französisches Recht, unbeschadet der zwingenden verbraucherschützenden Bestimmungen des Staates, in dem der Verbraucher seinen gewöhnlichen Aufenthalt hat.`,

        fr: `# Conditions générales de vente

Ces conditions s'appliquent à tout achat conclu sur ce site. Leur acceptation conditionne la commande : la case prévue à cet effet doit être cochée, et votre acceptation est enregistrée avec sa date. La version applicable est celle en vigueur au moment de votre commande.

Le vendeur est la société désignée dans les [mentions légales](/mentions-legales).

## Article 1 — Champ d'application

Ces conditions s'appliquent aux consommateurs comme aux acheteurs professionnels. Les dispositions protectrices du consommateur — droit de rétractation, garantie légale — ne bénéficient qu'aux personnes physiques agissant à des fins étrangères à leur activité professionnelle.

Les conditions d'achat contraires d'un acheteur professionnel ne nous sont pas opposables, sauf accord écrit de notre part.

## Article 2 — Produits

Le bois de chauffage est un produit naturel. Les longueurs, volumes et poids indiqués sur les fiches produits sont des **ordres de grandeur**, mesurés sur des lots représentatifs, et non des dimensions garanties pour chaque bûche. Les photographies illustrent le produit sans constituer une description contractuelle : teinte, grosseur, part d'écorce et aspect varient d'un lot à l'autre.

Chaque fiche indique sa disponibilité. Un produit signalé indisponible ne peut être commandé. La disponibilité affichée n'est pas une réservation : elle est constatée à la commande, et un stock peut s'épuiser entre deux commandes.

## Article 3 — Prix

Les prix s'entendent en euros, toutes taxes comprises, hors frais de livraison.

Les frais de livraison dépendent du pays de destination et, en Allemagne, du Land. Ils apparaissent dans le panier dès que le pays et le Land sont choisis, et sont rappelés dans le récapitulatif avant tout paiement. Au-delà d'un montant de commande indiqué dans le récapitulatif, ils ne sont pas dus.

Le prix qui engage est celui figurant au récapitulatif au moment où vous validez. Une erreur de prix manifeste — un tarif sans rapport avec la valeur du produit — ne nous engage pas ; nous vous en informons sans délai, et il vous est loisible d'annuler la commande.

## Article 4 — Commande

La commande se passe sans création de compte. Elle se déroule en trois étapes : le panier, vos coordonnées et l'adresse de livraison, puis le paiement. Jusqu'à la validation, vous pouvez revenir à chaque étape ; la validation vaut acceptation du prix, des frais de livraison et des présentes conditions.

Après la validation, vous recevez une confirmation par e-mail avec votre numéro de commande. Conservez ce numéro : c'est avec lui et votre adresse e-mail que vous suivez votre commande.

## Article 5 — Paiement

Sont disponibles les moyens de paiement qui apparaissent dans le récapitulatif de votre commande : le virement bancaire et la carte.

En cas de virement, vous recevez nos coordonnées bancaires et une référence. Reportez la référence telle quelle : c'est elle qui relie votre paiement à votre commande. **La préparation commence à réception du paiement.** Faute de paiement dans le délai indiqué, la commande peut être annulée.

Les paiements par carte transitent par le prestataire de paiement. Nous ne voyons jamais votre numéro de carte et n'en conservons aucune trace.

## Article 6 — Livraison

Nous livrons en Allemagne et dans les pays énumérés sur la page [Livraison](/livraison). En dehors de ces pays, nous ne livrons pas.

La marchandise arrive sur palette. Le camion la dépose au hayon ou au chariot embarqué, en bordure de voie ou au plus près de l'habitation — là où il accède et peut stationner en sécurité. Un portage à la cave, à l'étage ou au fond du jardin ne fait pas partie de la livraison.

Vous vous assurez d'un accès stabilisé, praticable par un poids lourd, et d'une surface plane pour la dépose. Si la livraison est impossible pour une cause qui vous est imputable — accès impraticable, numéro injoignable, absence sans avoir prévenu —, les frais d'une nouvelle présentation sont à votre charge.

Le délai est en général de quatre à cinq jours ouvrés à compter de la réception du paiement ; c'est un ordre de grandeur, non l'engagement d'une date ferme. Le transporteur appelle avant de venir.

## Article 7 — Vérification à la livraison

Vérifiez la marchandise à la remise. Les dommages apparents ou un manquant manifeste doivent être portés sur le document de transport, le plus précisément possible, et nous être signalés par écrit sous quelques jours, avec photos. Une réserve du type « sous réserve de déballage » ne nous sert à rien face au transporteur.

## Article 8 — Droit de rétractation

En tant que consommateur, vous disposez de **quatorze jours** à compter de la réception pour vous rétracter, sans avoir à motiver votre décision. Informez-nous par écrit à l'adresse figurant aux mentions légales.

Le retour est à vos frais et dans un état permettant la revente : **sur sa palette, sous film, non ouverte**. Un bois entamé, transvasé ou exposé aux intempéries ne peut être repris. Une dépréciation résultant de manipulations non nécessaires à l'examen du produit reste à votre charge.

Nous remboursons le prix et les frais de la livraison standard la moins chère que nous proposons, dans les quatorze jours suivant la reprise de la marchandise.

## Article 9 — Garantie

La garantie légale de conformité s'applique. Elle ne couvre pas les caractéristiques naturelles du bois — couleur, part d'écorce, variations de dimensions — mais ce qui s'écarte sensiblement de la description : une humidité nettement supérieure à celle annoncée, un volume manquant, une essence autre que celle commandée.

Signalez un défaut par écrit, avec le numéro de commande et des photos.

## Article 10 — Responsabilité

Nous répondons des dommages résultant d'un manquement fautif à nos obligations. Ne relèvent pas de notre responsabilité le choix d'un combustible inadapté à votre appareil, un stockage défectueux après la livraison, et les conséquences d'une installation de chauffage non conforme.

## Article 11 — Droit applicable

Ces contrats relèvent du droit français, sans préjudice des dispositions impératives protectrices du consommateur de l'État dans lequel il a sa résidence habituelle.`,
    },

    // ── Datenschutz / Confidentialité ────────────────────────────────────────
    politiqueConfidentialite: {
        de: `# Datenschutzerklärung

Wir erheben nur, was zum Vorbereiten, Liefern und Abrechnen einer Bestellung nötig ist. In diesem Shop gibt es kein Kundenkonto, also auch kein Profil, das mit jedem Besuch wächst. Diese Seite sagt, was gespeichert wird, warum, und wie lange.

Verantwortlich ist das im [Impressum](/mentions-legales) genannte Unternehmen.

## Was wir erheben

### Um Ihre Bestellung vorzubereiten und zu liefern

Ihren Vor- und Nachnamen, Ihre E-Mail-Adresse, Ihre Telefonnummer und die Lieferadresse. Dazu die Lieferhinweise, die Sie selbst schreiben — Zufahrt, Tor, Ablage in Ihrer Abwesenheit —, und bei einer gewerblichen Bestellung Firmenname und Umsatzsteuer-Identifikationsnummer.

Die Telefonnummer ist keine Zierde: die Spedition ruft vor der Anfahrt an. *Rechtsgrundlage: Erfüllung des Kaufvertrags, Art. 6 Abs. 1 lit. b DSGVO.*

### Um die Zahlung einzuziehen und nachzuweisen

Die gewählte Zahlungsart, den Zahlungsstatus, bei einer Überweisung den Verwendungszweck, und die Nachweise, die Sie gegebenenfalls selbst hochladen — Überweisungsauftrag, Kontoauszug, Bildschirmfoto.

**Ihre Kartennummer sehen wir nie**: die Kartenzahlung läuft beim Anbieter. *Rechtsgrundlage: Vertragserfüllung, danach unsere handels- und steuerrechtlichen Pflichten.*

### Um das Gesetz einzuhalten

Die Rechnungsdaten und die Einzelheiten der Bestellungen, die das anwendbare Handels- und Steuerrecht aufzubewahren verlangt. *Rechtsgrundlage: rechtliche Verpflichtung, Art. 6 Abs. 1 lit. c DSGVO.*

### Ihre Einwilligungen

Die Annahme der Allgemeinen Geschäftsbedingungen und, wenn Sie das Kästchen ankreuzen, Ihr Einverständnis mit unseren Angeboten — beides getrennt und mit Zeitstempel. Aus einem Kauf wird nie eine Werbeeinwilligung abgeleitet. *Rechtsgrundlage: Ihre Einwilligung, jederzeit widerrufbar.*

### Veröffentlichte Bewertungen

Eine auf der Website gezeigte Bewertung nennt den Namen, den der Verfasser angegeben hat, und seine Bewertung. Die E-Mail-Adresse wird nie veröffentlicht. Bewertungen werden vor der Veröffentlichung geprüft.

## Was wir nicht erheben

- Kein Kundenkonto, also kein Passwort zu schützen — und keines zu stehlen.
- Kein Profiling, keine automatisierte Entscheidung im Einzelfall.
- Keine Daten werden verkauft, vermietet oder getauscht.

## Empfänger Ihrer Daten

Ihre Daten erreichen nur die Stellen, die sie zur Ausführung brauchen: die Spedition (Name, Adresse, Telefonnummer), den Zahlungsdienstleister, unseren E-Mail-Versanddienst und unsere Buchhaltung. Keiner von ihnen darf sie zu eigenen Zwecken verwenden.

## Aufbewahrung

Bestell- und Rechnungsdaten werden für die gesetzliche Aufbewahrungsfrist gespeichert. Kontaktanfragen ohne Bestellung werden nach der Bearbeitung gelöscht. Eine Einwilligung in den Newsletter gilt, bis Sie sie widerrufen.

## Ihre Rechte

Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Schreiben Sie an die im Impressum genannte Adresse; wir antworten innerhalb der gesetzlichen Frist.

Sie haben außerdem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren — in Deutschland bei der Aufsichtsbehörde Ihres Bundeslandes.

## Analyse und Werbung

Diese Website bindet ein Skript von Google zur Messung von Werbe-Conversions ein. Es wird geladen, sobald Sie die Seite öffnen. Wenn Sie das nicht möchten, blockieren Sie es über die Einstellungen Ihres Browsers oder eine Erweiterung; der Shop funktioniert ohne dieses Skript vollständig.`,

        fr: `# Politique de confidentialité

Nous ne collectons que ce qui est nécessaire pour préparer, livrer et facturer une commande. Cette boutique ne tient pas de compte client, donc aucun profil ne s'enrichit à chaque visite. Cette page dit ce qui est enregistré, pourquoi, et pour combien de temps.

Le responsable de traitement est la société désignée dans les [mentions légales](/mentions-legales).

## Ce que nous collectons

### Pour préparer et livrer votre commande

Vos nom et prénom, votre adresse e-mail, votre numéro de téléphone et l'adresse de livraison. S'y ajoutent les précisions que vous écrivez vous-même — accès, portail, dépose en votre absence — et, pour une commande professionnelle, la raison sociale et le numéro de TVA.

Le numéro de téléphone n'est pas décoratif : le transporteur appelle avant de venir. *Base légale : exécution du contrat de vente, art. 6.1.b du RGPD.*

### Pour encaisser le paiement et en garder la preuve

Le moyen de paiement choisi, l'état du paiement, la référence en cas de virement, et les justificatifs que vous déposez le cas échéant — ordre de virement, relevé, capture d'écran.

**Nous ne voyons jamais votre numéro de carte** : le paiement par carte se déroule chez le prestataire. *Base légale : exécution du contrat, puis nos obligations comptables et fiscales.*

### Pour respecter la loi

Les données de facturation et le détail des commandes que le droit commercial et fiscal applicable impose de conserver. *Base légale : obligation légale, art. 6.1.c du RGPD.*

### Vos consentements

L'acceptation des conditions générales et, si vous cochez la case, votre accord pour recevoir nos offres — séparément, et horodatés. Un achat ne vaut jamais consentement publicitaire. *Base légale : votre consentement, révocable à tout moment.*

### Avis publiés

Un avis affiché sur le site mentionne le nom indiqué par son auteur et sa note. L'adresse e-mail n'est jamais publiée. Les avis sont vérifiés avant publication.

## Ce que nous ne collectons pas

- Aucun compte client, donc aucun mot de passe à protéger — ni à voler.
- Aucun profilage, aucune décision individuelle automatisée.
- Aucune donnée n'est vendue, louée ni échangée.

## Destinataires

Vos données ne parviennent qu'aux intervenants qui en ont besoin pour exécuter : le transporteur (nom, adresse, téléphone), le prestataire de paiement, notre service d'envoi d'e-mails et notre comptabilité. Aucun d'eux n'est autorisé à les utiliser à ses propres fins.

## Conservation

Les données de commande et de facturation sont conservées pendant la durée légale. Les demandes de contact sans commande sont supprimées après traitement. Un consentement à la newsletter vaut jusqu'à ce que vous le retiriez.

## Vos droits

Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation du traitement, de portabilité et d'opposition. Écrivez à l'adresse figurant aux mentions légales ; nous répondons dans le délai légal.

Vous pouvez également introduire une réclamation auprès d'une autorité de contrôle — la CNIL en France, l'autorité de votre Land en Allemagne.

## Mesure d'audience et publicité

Ce site charge un script de Google destiné à mesurer les conversions publicitaires. Il se charge dès l'ouverture de la page. Si vous ne le souhaitez pas, bloquez-le depuis les réglages de votre navigateur ou une extension ; la boutique fonctionne intégralement sans ce script.`,
    },

    // ── Cookie-Richtlinie / Cookies ──────────────────────────────────────────
    cookies: {
        de: `# Cookie-Richtlinie

Diese Seite beschreibt, was der Shop in Ihrem Browser speichert: Cookies, aber auch den lokalen Speicher, für den dieselben Regeln gelten. Sie ergänzt die [Datenschutzerklärung](/politique-confidentialite), die sämtliche personenbezogenen Daten behandelt.

## Cookie und lokaler Speicher: worum geht es

Ein **Cookie** ist eine kleine Datei, die eine Website in Ihrem Browser ablegt und später wieder ausliest; sie wird bei jedem Seitenaufruf an den Server mitgeschickt. Der **lokale Speicher** erfüllt einen ähnlichen Zweck, mit einem Unterschied: sein Inhalt verlässt Ihr Gerät nie.

Die geltende Regel unterscheidet die beiden Techniken nicht — geregelt ist das Schreiben und Lesen von Informationen auf Ihrem Gerät. Deshalb behandelt diese Seite beides gemeinsam.

## Was der Shop speichert

### Unbedingt erforderlich

Ohne diese Elemente überlebt der Warenkorb den Seitenwechsel nicht. Nichts davon erstellt Profile oder dient der Werbung.

- **NEXT_LOCALE** (Cookie) — merkt sich die Anzeigesprache, damit die Website auf der nächsten Seite nicht in eine andere Sprache zurückfällt. Von dieser Website gesetzt, von niemandem sonst. Dauer: die Browsersitzung.
- **Warenkorb** (lokaler Speicher) — Artikelnummern, Mengen und das Lieferland. Preise stehen nicht darin: sie werden bei jeder Anzeige erneut auf dem Server gelesen. Dauer: bis zur Bestellbestätigung oder bis Sie ihn selbst löschen.
- **Verwaltungssitzung** (Cookie) — nur für den Zugang zur Verwaltung, nicht für Besucher des Shops.

### Von Dritten

- **Google Ads** — ein Skript zur Messung von Werbe-Conversions, das beim Öffnen einer Seite geladen wird. Es setzt eigene Kennungen. Blockieren Sie es über die Einstellungen Ihres Browsers oder eine Erweiterung, wenn Sie es nicht möchten: der Shop funktioniert ohne dieses Skript vollständig.

## Was nicht gespeichert wird

Kein Cookie zur Reichweitenmessung durch uns, kein Werbe-Tracking unsererseits, keine Besucherkennung in unseren Datenbanken.

## Wie Sie das löschen

Jeder Browser erlaubt es, Cookies und lokalen Speicher für eine Website zu löschen — meist unter „Einstellungen“, dann „Datenschutz“ oder „Website-Daten“. Löschen Sie diese Daten, verlieren Sie den Inhalt Ihres Warenkorbs und die gemerkte Sprache. Keine aufgegebene Bestellung geht dabei verloren: sie liegt auf dem Server und bleibt mit Bestellnummer und E-Mail-Adresse abrufbar.`,

        fr: `# Politique de cookies

Cette page décrit ce que la boutique stocke dans votre navigateur : les cookies, mais aussi le stockage local, soumis aux mêmes règles. Elle complète la [politique de confidentialité](/politique-confidentialite), qui traite l'ensemble des données personnelles.

## Cookie et stockage local : de quoi s'agit-il

Un **cookie** est un petit fichier qu'un site dépose dans votre navigateur et relit ensuite ; il repart vers le serveur à chaque page. Le **stockage local** remplit un rôle voisin, à une différence près : son contenu ne quitte jamais votre appareil.

La règle applicable ne distingue pas les deux techniques — ce qui est encadré, c'est l'écriture et la lecture d'informations sur votre appareil. Cette page traite donc les deux ensemble.

## Ce que la boutique enregistre

### Strictement nécessaire

Sans ces éléments, le panier ne survit pas au changement de page. Aucun ne mesure d'audience, ne profile ni ne sert à la publicité.

- **NEXT_LOCALE** (cookie) — retient la langue d'affichage, pour que le site ne bascule pas dans l'autre langue à la page suivante. Posé par ce site, par personne d'autre. Durée : la session du navigateur.
- **Panier** (stockage local) — références, quantités et pays de livraison. Aucun prix n'y figure : ils sont relus sur le serveur à chaque affichage. Durée : jusqu'à la validation de la commande, ou jusqu'à ce que vous l'effaciez.
- **Session d'administration** (cookie) — réservée à l'accès à l'administration, pas aux visiteurs de la boutique.

### Déposés par des tiers

- **Google Ads** — un script de mesure des conversions publicitaires, chargé à l'ouverture d'une page. Il pose ses propres identifiants. Bloquez-le depuis les réglages de votre navigateur ou une extension si vous ne le souhaitez pas : la boutique fonctionne intégralement sans lui.

## Ce qui n'est pas enregistré

Aucun cookie de mesure d'audience de notre fait, aucun traçage publicitaire de notre part, aucun identifiant de visiteur dans nos bases.

## Comment effacer tout cela

Chaque navigateur permet de supprimer cookies et stockage local pour un site — généralement sous « Paramètres », puis « Confidentialité » ou « Données de sites ». En les effaçant, vous perdez le contenu de votre panier et la langue mémorisée. Aucune commande passée n'est perdue : elle est sur le serveur, et reste accessible avec son numéro et votre adresse e-mail.`,
    },
}
