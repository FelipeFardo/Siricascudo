import { api } from '../api-client'

interface GetProfileResponse {
  sessionId: string
}

export async function createVisitorSession() {
  const result = await api.post('sessions/visitor').json<GetProfileResponse>()

  return result
}
