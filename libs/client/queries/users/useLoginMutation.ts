import { useMutation } from 'react-query'
import { useAccessToken } from '../../../../contexts/accessToken'
import { useEndpoint } from '../../../../contexts/api'

type LoginResult =
    | {
          success: false
          reason: string
      }
    | {
          success: true
          token: string
          payload: {
              userId: string
          }
      }

export const useLoginMutation = () => {
    const { apiEndpoint: endpoint } = useEndpoint()
    const { update } = useAccessToken()

    return useMutation(
        async ({ username, password }: { username: string; password: string }) => {
            const url = new URL('/login', endpoint)

            const req = await fetch(url.toString(), {
                body: JSON.stringify({ username, password, timestamp: Date.now() }),
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            })

            if (!req.ok) {
                throw new Error(`fetch() returned an error: ${req.statusText} (${req.status})`)
            }

            const result = (await req.json()) as LoginResult
            if (result.success === true) {
                return { id: result.payload.userId, token: result.token }
            } else {
                throw new Error(`Server rejected: ${result.reason}`)
            }
        },
        {
            mutationKey: 'login',
            onSuccess: ({ id, token }) => {
                update(token, id)
            },
        }
    )
}
