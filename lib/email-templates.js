// Templates d'emails pour les commandes

export const orderConfirmationTemplate = (orderData) => {
    const { orderNumber, customer, items, totals, bankDetails } = orderData

    return {
        subject: `Confirmation de commande #${orderNumber}`,
        html: `
              <!DOCTYPE html>
              <html>
              <head>
                  <meta charset="utf-8">
                  <title>Confirmation de commande</title>
                  <style>
                      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                      .header { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; }
                      .order-info { background: #fff; border: 1px solid #ddd; padding: 20px; margin: 20px 0; border-radius: 8px; }
                      .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                      .items-table th, .items-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
                      .items-table th { background: #f8f9fa; }
                      .total-row { font-weight: bold; background: #f8f9fa; }
                      .payment-info { background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; margin: 20px 0; border-radius: 8px; }
                      .bank-details { background: #f8f9fa; padding: 15px; border-radius: 4px; margin: 10px 0; }
                      .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
                  </style>
              </head>
              <body>
                  <div class="container">
                      <div class="header">
                          <h1>Confirmation de commande</h1>
                          <p>Merci pour votre commande #${orderNumber}</p>
                      </div>
                      
                      <div class="order-info">
                          <h2>Informations de commande</h2>
                          <p><strong>Numéro de commande :</strong> ${orderNumber}</p>
                          <p><strong>Date :</strong> ${new Date().toLocaleDateString("fr-FR")}</p>
                          <p><strong>Client :</strong> ${customer.firstName} ${customer.lastName}</p>
                          <p><strong>Email :</strong> ${customer.email}</p>
                      </div>
                      
                      <div class="order-info">
                          <h2>Articles commandés</h2>
                          <table class="items-table">
                              <thead>
                                  <tr>
                                      <th>Article</th>
                                      <th>Quantité</th>
                                      <th>Prix unitaire</th>
                                      <th>Total</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  ${items
                .map(
                    (item) => `
                                      <tr>
                                          <td>${item.productSnapshot.name}</td>
                                          <td>${item.quantity}</td>
                                          <td>${item.unitPrice.toFixed(2)} €</td>
                                          <td>${item.totalPrice.toFixed(2)} €</td>
                                      </tr>
                                  `,
                )
                .join("")}
                                  <tr>
                                      <td colspan="3"><strong>Sous-total</strong></td>
                                      <td><strong>${totals.subtotal.toFixed(2)} €</strong></td>
                                  </tr>
                                  <tr>
                                      <td colspan="3"><strong>Livraison</strong></td>
                                      <td><strong>${totals.shipping === 0 ? "Gratuite" : totals.shipping.toFixed(2) + " €"}</strong></td>
                                  </tr>
                                  <tr class="total-row">
                                      <td colspan="3"><strong>Total</strong></td>
                                      <td><strong>${totals.total.toFixed(2)} €</strong></td>
                                  </tr>
                              </tbody>
                          </table>
                      </div>
                      
                      <div class="payment-info">
                          <h2>Informations de paiement</h2>
                          <p>Pour finaliser votre commande, veuillez effectuer un virement bancaire avec les coordonnées suivantes :</p>
                          
                          <div class="bank-details">
                              <p><strong>IBAN :</strong> ${bankDetails.iban}</p>
                              <p><strong>BIC :</strong> ${bankDetails.bic}</p>
                              <p><strong>Bénéficiaire :</strong> ${bankDetails.accountName}</p>
                              <p><strong>Montant :</strong> ${totals.total.toFixed(2)} €</p>
                              <p><strong>Référence obligatoire :</strong> ${bankDetails.reference}</p>
                          </div>
                          
                          <p><strong>Important :</strong> N'oubliez pas d'indiquer la référence <strong>${bankDetails.reference}</strong> dans le libellé de votre virement.</p>
                      </div>
                      
                      <div class="footer">
                          <p>Votre commande sera traitée dès réception du paiement (1-2 jours ouvrés).</p>
                          <p>Pour toute question, contactez-nous à support@boisdecharbon.fr</p>
                          <p>Merci de votre confiance !</p>
                      </div>
                  </div>
              </body>
              </html>
          `,
        text: `
              Confirmation de commande #${orderNumber}
              
              Merci pour votre commande !
              
              Numéro de commande : ${orderNumber}
              Date : ${new Date().toLocaleDateString("fr-FR")}
              Client : ${customer.firstName} ${customer.lastName}
              
              Articles commandés :
              ${items.map((item) => `- ${item.productSnapshot.name} x${item.quantity} : ${item.totalPrice.toFixed(2)} €`).join("\n")}
              
              Sous-total : ${totals.subtotal.toFixed(2)} €
              Livraison : ${totals.shipping === 0 ? "Gratuite" : totals.shipping.toFixed(2) + " €"}
              Total : ${totals.total.toFixed(2)} €
              
              Informations de paiement :
              IBAN : ${bankDetails.iban}
              BIC : ${bankDetails.bic}
              Bénéficiaire : ${bankDetails.accountName}
              Référence obligatoire : ${bankDetails.reference}
              
              N'oubliez pas d'indiquer la référence ${bankDetails.reference} dans le libellé de votre virement.
              
              Votre commande sera traitée dès réception du paiement (1-2 jours ouvrés).
              
              Pour toute question, contactez-nous à support@boisdecharbon.fr
          `,
    }
}

export const paymentReceivedTemplate = (orderData) => {
    const { orderNumber, customer } = orderData

    return {
        subject: `Paiement reçu - Commande #${orderNumber}`,
        html: `
              <!DOCTYPE html>
              <html>
              <head>
                  <meta charset="utf-8">
                  <title>Paiement reçu</title>
                  <style>
                      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                      .header { background: #d4edda; padding: 20px; text-align: center; border-radius: 8px; }
                      .content { padding: 20px 0; }
                      .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
                  </style>
              </head>
              <body>
                  <div class="container">
                      <div class="header">
                          <h1>✅ Paiement reçu</h1>
                          <p>Votre commande #${orderNumber} est confirmée</p>
                      </div>
                      
                      <div class="content">
                          <p>Bonjour ${customer.firstName},</p>
                          
                          <p>Nous avons bien reçu votre paiement pour la commande #${orderNumber}.</p>
                          
                          <p>Votre commande est maintenant confirmée et va être préparée dans les plus brefs délais.</p>
                          
                          <p>Vous recevrez un email de confirmation d'expédition avec le numéro de suivi dès que votre commande sera expédiée.</p>
                          
                          <p>Merci de votre confiance !</p>
                      </div>
                      
                      <div class="footer">
                          <p>Pour toute question, contactez-nous à support@boisdecharbon.fr</p>
                      </div>
                  </div>
              </body>
              </html>
          `,
        text: `
              Paiement reçu - Commande #${orderNumber}
              
              Bonjour ${customer.firstName},
              
              Nous avons bien reçu votre paiement pour la commande #${orderNumber}.
              
              Votre commande est maintenant confirmée et va être préparée dans les plus brefs délais.
              
              Vous recevrez un email de confirmation d'expédition avec le numéro de suivi dès que votre commande sera expédiée.
              
              Merci de votre confiance !
              
              Pour toute question, contactez-nous à support@boisdecharbon.fr
          `,
    }
}