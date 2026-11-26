export function createTokenManager ({
    initialTokens, refreshAccessToken, saveTokens, deleteTokens, onAuthLost
}) {
    let tokens = initialTokens
    let refreshPromise = null 
    
    async function withValidToken(apiCall) {
        try {
            return await apiCall(tokens.access_token)
        } catch (err) {
            if (err.status != 401) return null      // not an auth problem, don't refresh
        }

        // refresh
        try {
            if (!refreshPromise) {
                refreshPromise = (async () => {
                    tokens = await refreshAccessToken(tokens.refresh_token)
                    await saveTokens(tokens)
                })().finally(() => { refreshPromise = null})
            }
            await refreshPromise
            return await apiCall(tokens.access_token)
        } catch (retryErr) {
            if (retryErr.code === 'invalid_grant') {
                tokens = null
                await deleteTokens()
                onAuthLost()
            }
            return null
        }
  }

  return {
    withValidToken,
    getTokens: () => tokens,
    setTokens: (t) => { tokens = t }
  }
}