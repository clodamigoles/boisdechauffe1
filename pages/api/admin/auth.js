import crypto from 'crypto'

const COOKIE_NAME = 'admin_token'
const INACTIVITY_MS = 2 * 60 * 60 * 1000 // 2 heures

function hmacSign(secret, data) {
    return crypto.createHmac('sha256', secret).update(data).digest('hex')
}

function createToken(secret) {
    const payload = Buffer.from(JSON.stringify({ iat: Date.now() })).toString('base64')
    const sig = hmacSign(secret, payload)
    return `${payload}.${sig}`
}

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { code } = req.body

        if (!code || code !== process.env.ADMIN_ACCESS_CODE) {
            return res.status(401).json({ success: false, message: 'Code d\'accès invalide' })
        }

        const token = createToken(process.env.ADMIN_ACCESS_CODE)

        res.setHeader('Set-Cookie', [
            `${COOKIE_NAME}=${token}; HttpOnly; ${process.env.NODE_ENV === 'production' ? 'Secure; ' : ''}SameSite=Lax; Max-Age=${INACTIVITY_MS / 1000}; Path=/`,
        ])

        return res.status(200).json({ success: true })
    }

    if (req.method === 'DELETE') {
        res.setHeader('Set-Cookie', [
            `${COOKIE_NAME}=; HttpOnly; ${process.env.NODE_ENV === 'production' ? 'Secure; ' : ''}SameSite=Lax; Max-Age=0; Path=/`,
        ])
        return res.status(200).json({ success: true })
    }

    res.setHeader('Allow', ['POST', 'DELETE'])
    return res.status(405).json({ success: false, message: 'Méthode non autorisée' })
}
