import {describe, it, expect, vi, afterEach} from 'vitest'

vi.mock('electron', () => ({
    app: { getPath: () => '/tmp' },
    safeStorage: {},
    shell: {},
}))

import { getCurrentlyPlaying } from './spotifyAuth'

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