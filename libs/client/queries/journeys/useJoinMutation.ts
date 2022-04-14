import { useMutation } from 'react-query'
import { useAccessToken } from '../../../../contexts/accessToken'
import { useEndpoint } from '../../../../contexts/api'

type IJourneyJoinMutationResult =
    | {
          success: false
          reason: string
      }
    | {
          success: true
      }

export const useJoinMutation = (journeyId: string) => {
    const { apiEndpoint: endpoint } = useEndpoint()
    const { accessToken } = useAccessToken()

    return useMutation(
        async () => {
            const url = new URL('/journey/join', endpoint)

            const req = await fetch(url.toString(), {
                body: JSON.stringify({ token: accessToken, payload: { journeyId: journeyId } }),
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            })

            if (!req.ok) {
                throw new Error(`fetch() returned an error: ${req.statusText} (${req.status})`)
            }

            const result = (await req.json()) as IJourneyJoinMutationResult
            if (result.success === true) {
                return {}
            } else {
                throw new Error(`Server rejected: ${result.reason}`)
            }
        },
        {
            mutationKey: ['journey/join', journeyId],
        }
    )
}
