export function createTokenManager ({
    initialTokens, refreshAccessToken, saveTokens, deleteTokens, onAuthLost
}) {
    let tokens = initialTokens
    let refreshPromise = null 
    
    async function withValidToken(apiCall) {
        try {
            return await apiCall(tokens.access_token)
        } catch (err) {
        try {
            if (!refreshPromise) {
                refreshPromise = (async () => {
                    const newTokens = await refreshAccessToken(tokens.refresh_token)
                    tokens = newTokens
                    await saveTokens(tokens)
                    return newTokens
                })().finally(() => { refreshPromise = null })
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
  }

  return {
    withValidToken,
    getTokens: () => tokens,
    setTokens: (t) => { tokens = t }
  }
}