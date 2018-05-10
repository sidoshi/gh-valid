import axios from 'axios'

type ValidationResponse = {
  tokenValid: boolean,
  scopesValid: boolean,
  scopes: string[],
}

const defaultResponse: ValidationResponse = {
  tokenValid: false,
  scopesValid: false,
  scopes: [],
}

const validate = async (
  token: string,
  requiredScopes?: string[] = []
): Promise<ValidationResponse> => {
  try {
    if (!token) return defaultResponse

    const res = await axios.get('https://api.github.com', {
      headers: {
        Authorization: `token ${token}`,
      },
    })

    const scopes =
      (res.headers &&
        res.headers['x-oauth-scopes'] &&
        res.headers['x-oauth-scopes'].split(', ')) ||
      []

    const scopesValid = requiredScopes.every(requiredScope =>
      scopes.includes(requiredScope)
    )

    return {
      tokenValid: true,
      scopesValid,
      scopes,
    }
  } catch (err) {
    if (err && err.response && err.response.status === 401) {
      return defaultResponse
    }

    throw err
  }
}

export default validate
