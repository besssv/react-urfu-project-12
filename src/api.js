export class HttpError extends Error {
  constructor(status) {
    super(`HTTP ${status}`)
    this.status = status
  }
}

const apiPaths = {
  login: () => '/api/v1/login',
}

const request = async (method, path, { token, body } = {}) => {
  const response = await fetch(path, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  if (!response.ok) {
    throw new HttpError(response.status)
  }
  return response.json()
}

export const login = credentials => request('POST', apiPaths.login(), { body: credentials })
