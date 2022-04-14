import { useMutation } from 'react-query'
import { useAccessToken } from '../../../../contexts/accessToken'
import { useEndpoint } from '../../../../contexts/api'


type IJourneyArriveMutationResult =
  | {
    success: false
    reason: string
  }
  | {
    success: true
  }

export const useArriveMutation = (userId: string) => {
  const { apiEndpoint: endpoint } = useEndpoint()
  const { accessToken } = useAccessToken()

  return useMutation(
    async () => {
      const url = new URL('/journey/confirm-arrive', endpoint)

      const req = await fetch(url.toString(), {
        body: JSON.stringify({ token: accessToken, payload: { userId } }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (!req.ok) {
        throw new Error(`fetch() returned an error: ${req.statusText} (${req.status})`)
      }

      const result = (await req.json()) as IJourneyArriveMutationResult
      if (result.success === true) {
        return {}
      } else {
        throw new Error(`Server rejected: ${result.reason}`)
      }
    },
    {
      mutationKey: ['journey/confirm-arrive', userId],
    }
  )
}
