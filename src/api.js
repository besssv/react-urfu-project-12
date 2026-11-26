export class HttpError extends Error {
  constructor(status) {
    super(`HTTP ${status}`)
    this.status = status
  }
}

const apiPaths = {
  login: () => '/api/v1/login',
  signup: () => '/api/v1/signup',
  channels: () => '/api/v1/channels',
  channel: id => `/api/v1/channels/${id}`,
  messages: () => '/api/v1/messages',
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

export const signup = credentials => request('POST', apiPaths.signup(), { body: credentials })

export const fetchChannels = token => request('GET', apiPaths.channels(), { token })

export const fetchMessages = token => request('GET', apiPaths.messages(), { token })

export const createChannel = (token, name) => request('POST', apiPaths.channels(), { token, body: { name } })

export const renameChannel = (token, id, name) => request('PATCH', apiPaths.channel(id), { token, body: { name } })

export const removeChannel = (token, id) => request('DELETE', apiPaths.channel(id), { token })

export const postMessage =(token, message) => request('POST', apiPaths.messages(), { token, body: message })
