import { NextResponse } from 'next/server'

const COOKIE_NAME = 'admin_token'
const INACTIVITY_MS = 2 * 60 * 60 * 1000 // 2 heures

async function hmacSign(secret, data) {
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    )
    const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(data))
    return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')
}

async function hmacVerify(secret, data, signature) {
    const expected = await hmacSign(secret, data)
    if (expected.length !== signature.length) return false
    let diff = 0
    for (let i = 0; i < expected.length; i++) {
        diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i)
    }
    return diff === 0
}

async function createToken(secret) {
    const payload = btoa(JSON.stringify({ iat: Date.now() }))
    const sig = await hmacSign(secret, payload)
    return `${payload}.${sig}`
}

async function verifyToken(secret, token) {
    if (!token) return null
    const dotIndex = token.lastIndexOf('.')
    if (dotIndex === -1) return null
    const payload = token.slice(0, dotIndex)
    const sig = token.slice(dotIndex + 1)
    const valid = await hmacVerify(secret, payload, sig)
    if (!valid) return null
    try {
        return JSON.parse(atob(payload))
    } catch {
        return null
    }
}

export async function middleware(request) {
    const { pathname } = request.nextUrl

    if (!pathname.startsWith('/delta') || pathname === '/delta/login') {
        return NextResponse.next()
    }

    const secret = process.env.ADMIN_ACCESS_CODE
    if (!secret) {
        return NextResponse.redirect(new URL('/delta/login', request.url))
    }

    const token = request.cookies.get(COOKIE_NAME)?.value
    const data = await verifyToken(secret, token)

    if (!data || Date.now() - data.iat > INACTIVITY_MS) {
        const response = NextResponse.redirect(new URL('/delta/login', request.url))
        response.cookies.delete(COOKIE_NAME)
        return response
    }

    // Rafraîchit le timer d'inactivité
    const newToken = await createToken(secret)
    const response = NextResponse.next()
    response.cookies.set(COOKIE_NAME, newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: INACTIVITY_MS / 1000,
        path: '/',
    })
    return response
}

export const config = {
    matcher: ['/delta/:path*'],
}
