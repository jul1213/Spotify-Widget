import {describe, it, expect, vi, afterEach} from 'vitest'

vi.mock('electron', () => ({
    app: { getPath: () => '/tmp' },
    safeStorage: {},
    shell: {},
}))

import { getCurrentlyPlaying, pauseTrack, playTrack, skipTrack, previousTrack, getQueue, playFromContext } from './spotifyAuth'

describe('getCurrentlyPlaying', () => {
    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('returns null on 204 (nothing playing)', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            status: 204
        }))
        expect(await getCurrentlyPlaying('token')).toBeNull()
    })

    it('returns track data on 200', async () => {
        const data = { item: { name: 'Song' } }
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true, status: 200, json: async () => data,
        }))
        expect(await getCurrentlyPlaying('token')).toEqual(data)
    })

    it('sends the bearer token', async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true, status: 200, json: async () => ({}),
        })
        vi.stubGlobal('fetch', fetchMock)
        await getCurrentlyPlaying('abc')
        expect(fetchMock).toHaveBeenCalledWith(
            'https://api.spotify.com/v1/me/player/currently-playing',
            expect.objectContaining({headers: {Authorization: 'Bearer abc'}})
        )
    })

    it('throws with status on 404', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: false, status: 404
        }))
        await expect(getCurrentlyPlaying('token')).rejects.toMatchObject({status: 404})
    })

    it('reads Retry-After on 429', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: false, status: 429, headers: {get: () => 7}
        }))
        await expect(getCurrentlyPlaying('token')).rejects.toMatchObject({status: 429, retryAfter: 7})
    })
})

describe('pauseTrack', () => {
    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('does nothing on success 204', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            status: 204
        }))
        expect(await pauseTrack('token')).toBeUndefined()
    })

    it('sends the bearer token', async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true, status: 204, json: async () => ({}),
        })
        vi.stubGlobal('fetch', fetchMock)
        await pauseTrack('abc')
        expect(fetchMock).toHaveBeenCalledWith(
            'https://api.spotify.com/v1/me/player/pause',
            expect.objectContaining({headers: {Authorization: 'Bearer abc'}})
        )
    })

    it('throws with status on 401', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: false, status: 401
        }))
        await expect(pauseTrack('token')).rejects.toMatchObject({status: 401})
    })

    it('reads Retry-After on 429', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: false, status: 429, headers: {get: () => 7}
        }))
        await expect(pauseTrack('token')).rejects.toMatchObject({status: 429, retryAfter: 7})
    })
})

describe('playTrack', () => {
    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('does nothing on success 204', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            status: 204
        }))
        expect(await playTrack('token')).toBeUndefined()
    })

    it('sends the bearer token', async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true, status: 204, json: async () => ({}),
        })
        vi.stubGlobal('fetch', fetchMock)
        await playTrack('abc')
        expect(fetchMock).toHaveBeenCalledWith(
            'https://api.spotify.com/v1/me/player/play',
            expect.objectContaining({headers: {Authorization: 'Bearer abc'}})
        )
    })

    it('throws with status on 401', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: false, status: 401
        }))
        await expect(playTrack('token')).rejects.toMatchObject({status: 401})
    })

    it('reads Retry-After on 429', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: false, status: 429, headers: {get: () => 7}
        }))
        await expect(playTrack('token')).rejects.toMatchObject({status: 429, retryAfter: 7})
    })
})

describe('skipTrack', () => {
    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('does nothing on success 204', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            status: 204
        }))
        expect(await skipTrack('token')).toBeUndefined()
    })

    it('sends the bearer token', async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true, status: 204, json: async () => ({}),
        })
        vi.stubGlobal('fetch', fetchMock)
        await skipTrack('abc')
        expect(fetchMock).toHaveBeenCalledWith(
            'https://api.spotify.com/v1/me/player/next',
            expect.objectContaining({headers: {Authorization: 'Bearer abc'}})
        )
    })

    it('throws with status on 401', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: false, status: 401
        }))
        await expect(skipTrack('token')).rejects.toMatchObject({status: 401})
    })

    it('reads Retry-After on 429', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: false, status: 429, headers: {get: () => 7}
        }))
        await expect(skipTrack('token')).rejects.toMatchObject({status: 429, retryAfter: 7})
    })
})

describe('previousTrack', () => {
    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('does nothing on success 204', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            status: 204
        }))
        expect(await previousTrack('token')).toBeUndefined()
    })

    it('sends the bearer token', async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true, status: 204, json: async () => ({}),
        })
        vi.stubGlobal('fetch', fetchMock)
        await previousTrack('abc')
        expect(fetchMock).toHaveBeenCalledWith(
            'https://api.spotify.com/v1/me/player/previous',
            expect.objectContaining({headers: {Authorization: 'Bearer abc'}})
        )
    })

    it('throws with status on 401', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: false, status: 401
        }))
        await expect(previousTrack('token')).rejects.toMatchObject({status: 401})
    })

    it('reads Retry-After on 429', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: false, status: 429, headers: {get: () => 7}
        }))
        await expect(previousTrack('token')).rejects.toMatchObject({status: 429, retryAfter: 7})
    })
})

describe('getQueue', () => {
    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('returns queue on 200', async () => {
        const data = { currentlyPlaying : {}}
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => data
        }))
        expect(await getQueue('token')).toEqual(data)
    })

    it('sends the bearer token', async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true, status: 204, json: async () => ({}),
        })
        vi.stubGlobal('fetch', fetchMock)
        await getQueue('abc')
        expect(fetchMock).toHaveBeenCalledWith(
            'https://api.spotify.com/v1/me/player/queue',
            expect.objectContaining({headers: {Authorization: 'Bearer abc'}})
        )
    })

    it('throws with status on 401', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: false, status: 401
        }))
        await expect(getQueue('token')).rejects.toMatchObject({status: 401})
    })

    it('reads Retry-After on 429', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: false, status: 429, headers: {get: () => 7}
        }))
        await expect(getQueue('token')).rejects.toMatchObject({status: 429, retryAfter: 7})
    })
})

describe('playFromContext', () => {
    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('returns true on success 204', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            status: 204
        }))
        expect(await playFromContext('token')).toBe(true)
    })

    it('sends with body, bearer token and content type', async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true, status: 204, json: async () => ({}),
        })
        vi.stubGlobal('fetch', fetchMock)
        await playFromContext('abc', 'spotify:album:123', 'spotify:track:456')
        expect(fetchMock).toHaveBeenCalledWith(
            'https://api.spotify.com/v1/me/player/play',
            expect.objectContaining({
                headers: {
                    Authorization: 'Bearer abc',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    context_uri: 'spotify:album:123',
                    offset: { uri: 'spotify:track:456' }
                })
            })
        )
    })

    it('sends track URI when no context is provided', async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            status: 204
        })

        vi.stubGlobal('fetch', fetchMock)

        await playFromContext('abc', null, 'spotify:track:456')

        expect(fetchMock).toHaveBeenCalledWith(
            'https://api.spotify.com/v1/me/player/play',
            expect.objectContaining({
                body: JSON.stringify({
                    uris: ['spotify:track:456']
                })
            })
        )
    })

    it('throws with status on 401', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: false, status: 401
        }))
        await expect(playFromContext('token')).rejects.toMatchObject({status: 401})
    })

    it('reads Retry-After on 429', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: false, status: 429, headers: {get: () => 7}
        }))
        await expect(playFromContext('token')).rejects.toMatchObject({status: 429, retryAfter: 7})
    })
})