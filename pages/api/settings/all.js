import { connectToDatabase, AppSetting } from '@/lib/models'

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    try {
        await connectToDatabase()

        // Récupérer tous les paramètres actifs
        const settings = await AppSetting.find({ isActive: true }).select('key value type category')

        // Transformer en objet clé-valeur
        const settingsObject = settings.reduce((acc, setting) => {
            acc[setting.key] = setting.value
            return acc
        }, {})

        // Valeurs par défaut si aucun paramètre n'est trouvé
        const defaultSettings = {
            // Informations bancaires
            bank_name: 'Crédit Agricole',
            bank_iban: 'FR76 1234 5678 9012 3456 7890 123',
            bank_bic: 'AGRIFRPP123',
            bank_account_name: 'BoisChauffage Pro SARL',

            // Livraison
            freeShippingThreshold: 500,
            shippingCost: 50,
            shipping_zones: ['France'],

            // Général
            taxRate: 0.20,
            min_order_amount: 50,
            payment_due_days: 7,

            // Informations entreprise
            company_info: {
                name: 'BoisChauffage Pro',
                email: 'contact@boischauffagepro.fr',
                phone: '01 23 45 67 89',
                address: '123 Route Forestière, 45000 Orléans',
                siret: '12345678901234'
            }
        }

        // Fusionner avec les valeurs par défaut
        const finalSettings = { ...defaultSettings, ...settingsObject }

        res.status(200).json(finalSettings)
    } catch (error) {
        console.error('Error fetching settings:', error)
        res.status(500).json({
            message: 'Error fetching settings',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        })
    }
}