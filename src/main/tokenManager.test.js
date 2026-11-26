import {describe, it, expect, vi, beforeEach} from 'vitest'
import { createTokenManager } from './tokenManager'

const OLD = { access_token: 'old', refresh_token: 'r1' }
const NEW = { access_token: 'new', refresh_token: 'r2' }

describe('withValidToken', () => {
    let deps, manager

    // fake API that rejects the old access token with a 401, accepts the new one
    const api = () => vi.fn(async (token) => {
        if (token == 'old') throw Object.assign(new Error('expired'), {status: 401})
        return 'ok'
    })

    beforeEach(() => {
        deps = {
            initialTokens: OLD,
            refreshAccessToken: vi.fn().mockResolvedValue(NEW),
            saveTokens: vi.fn().mockResolvedValue(),
            deleteTokens: vi.fn().mockResolvedValue(),
            onAuthLost: vi.fn(),
        }
        manager = createTokenManager(deps)
    })

    it('does not refresh when the token is valid', async () => {
        const call = vi.fn().mockResolvedValue('ok')
        expect(await manager.withValidToken(call)).toBe('ok')
        expect(call).toHaveBeenCalledTimes(1)
        expect(deps.refreshAccessToken).not.toHaveBeenCalled()
    })

    it('refreshes once on 401, saves the new tokens, retires', async () => {
        const call = api()
        expect(await manager.withValidToken(call)).toBe('ok')
        expect(deps.refreshAccessToken).toHaveBeenCalledWith('r1')
        expect(deps.saveTokens).toHaveBeenCalledWith(NEW)
        expect(call).toHaveBeenCalled(2)
    })

    it('does not refresh on a 404', async () => {
        const call = vi.fn().mockRejectedValue(Object.assign(new Error('no device'), {status: 404}))
        expect(await manager.withValidToken(call)).toBeNull()
        expect(deps.refreshAccessToken).not.toHaveBeenCalled()
    })
})