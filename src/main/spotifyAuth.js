import { app, safeStorage, shell } from 'electron'
import crypto from 'crypto'
import http from 'http'
import fs from 'fs'
import path from 'path'

const CLIENT_ID = 'e22c40cb74dd4ea9a236eb762dd2dfbb'
const REDIRECT_URI = 'http://127.0.0.1:8888/callback'
const SCOPES = [
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing'
].join(' ')

const TOKEN_PATH = path.join(app.getPath('userData'), 'spotify-tokens.enc')

export async function saveTokens(tokens) {
    if (!safeStorage.isAsyncEncryptionAvailable()) {
        console.warn('Encryption not available - tokens will not be saved securely')
        return 
    }
    const encrypted = await safeStorage.encryptStringAsync(JSON.stringify(tokens))
    fs.writeFileSync(TOKEN_PATH, encrypted) 
}

export async function loadTokens() {
    try {
        const encrypted = fs.readFileSync(TOKEN_PATH)
        const { result } = await safeStorage.decryptStringAsync(encrypted)
        return JSON.parse(result)
    } catch (err) {
        console.error('loadTokens failed:', err)
        return null
    }
}

export async function deleteTokens() {
    try {
        if (fs.existsSync(TOKEN_PATH)) {
            fs.unlinkSync(TOKEN_PATH)
        }
    } catch (err) {
        console.error("deleteTokens failed:", err)
    }
}


/* the PKCE authorization flow starts with the creation of a code verifier. */
function generateCodeVerifier() {
    return crypto.randomBytes(64).toString('base64url')
}


/* once the code verifier has been generated, we must transform (hash) it using 
   SHA256 algorithm. This is the value that will be sent within the user 
   authorization request. */
function generateCodeChallenge(verifier) {
    return crypto.createHash('sha256').update(verifier).digest('base64url')
}


export function loginToSpotify() {
    return new Promise((resolve, reject) => {
        // REQUEST USER AUTH
        const codeVerifier = generateCodeVerifier()
        const codeChallenge = generateCodeChallenge(codeVerifier)

        const authUrl = 
            'https://accounts.spotify.com/authorize?' +
            new URLSearchParams({
                response_type: 'code',
                client_id: CLIENT_ID,
                scope: SCOPES,
                code_challenge_method: 'S256',
                code_challenge: codeChallenge,
                redirect_uri: REDIRECT_URI,
            }).toString()
        
        // RESPONSE
        const server = http.createServer(async (req, res) => {
            const url = new URL(req.url, REDIRECT_URI)

            // Ignore anything that isn't the real callback (e.g. browser's favicon request)
            if (url.pathname !== '/callback') {
                res.end()
                return
            }
            const code = url.searchParams.get('code')

            if (code) {
                res.end('Login successful! You can close this tab and return to the app.')
                server.close()
                try {
                    const tokens = await exchangeCodeForTokens(code, codeVerifier)
                    resolve(tokens)
                } catch (err) {
                    reject(err)
                }
            } else {
                res.end('Login failed.')
                server.close()
                reject(new Error('No code received from Spotify'))
            }
        })

        server.listen(8888, () => {
            shell.openExternal(authUrl)
        })
    })
}

// REQUEST ACCESS TOKEN
async function exchangeCodeForTokens(code, codeVerifier) {
    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: CLIENT_ID,
            grant_type: 'authorization_code',
            code,
            redirect_uri: REDIRECT_URI,
            code_verifier: codeVerifier,        // to prove same app that started the login
        }).toString(),
    }
    
    const response = await fetch('https://accounts.spotify.com/api/token', payload)
    return response.json()
}

// REQUEST NEW ACCESS TOKEN WITH REFRESH TOKEN
export async function refreshAccessToken(refreshToken) {
    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: CLIENT_ID
        }).toString(),
    }
    const response = await fetch('https://accounts.spotify.com/api/token', payload)
    const data = await response.json()

    return {
        ...data,
        refresh_token: data.refresh_token ?? refreshToken           // keep old one if spotify didn't give new
    }
}

export async function getCurrentlyPlaying(accessToken) {
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })

    // no content
    if (response.status === 204) {
        return null
    }

    if (!response.ok) {
        const error = new Error(`Spotify API error: ${response.status}`)
        error.status = response.status
        if (response.status === 429) {
            error.retryAfter = Number(response.headers.get('Retry-After')) || 1
        }
        throw error
    }

    return response.json()
}

export async function pauseTrack(accessToken) {
    const response = await fetch('https://api.spotify.com/v1/me/player/pause', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })

    if (!response.ok) {
        const error = new Error(`Spotify API error: ${response.status}`)
        error.status = response.status
        if (response.status === 429) {
            error.retryAfter = Number(response.headers.get('Retry-After')) || 1
        }
        throw error
    }
}

export async function playTrack(accessToken) {
    const response = await fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })

    if (!response.ok) {
        const error = new Error(`Spotify API error: ${response.status}`)
        error.status = response.status
        if (response.status === 429) {
            error.retryAfter = Number(response.headers.get('Retry-After')) || 1
        }
        throw error
    }
}

export async function skipTrack(accessToken) {
    const response = await fetch('https://api.spotify.com/v1/me/player/next', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })

    if (!response.ok) {
        const error = new Error(`Spotify API error: ${response.status}`)
        error.status = response.status
        if (response.status === 429) {
            error.retryAfter = Number(response.headers.get('Retry-After')) || 1
        }
        throw error
    }
}

export async function previousTrack(accessToken) {
    const response = await fetch('https://api.spotify.com/v1/me/player/previous', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })

    if (!response.ok) {
        const error = new Error(`Spotify API error: ${response.status}`)
        error.status = response.status
        if (response.status === 429) {
            error.retryAfter = Number(response.headers.get('Retry-After')) || 1
        }
        throw error
    }
}

export async function getQueue(accessToken) {
    const response = await fetch('https://api.spotify.com/v1/me/player/queue', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })

    if (!response.ok) {
        const error = new Error(`Spotify API error: ${response.status}`)
        error.status = response.status
        if (response.status === 429) {
            error.retryAfter = Number(response.headers.get('Retry-After')) || 1
        }
        throw error
    }

    return response.json()
}

export async function playFromContext(accessToken, contextUri, trackUri) {
    const body = contextUri
        ? { context_uri: contextUri, offset: { uri: trackUri } }
        : { uris: [trackUri] }
    
    const response = await fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })

    if (!response.ok) {
        const error = new Error(`Spotify API error: ${response.status}`)
        error.status = response.status
        if (response.status === 429) {
            error.retryAfter = Number(response.headers.get('Retry-After')) || 1
        }
        throw error
    }

    return true
}