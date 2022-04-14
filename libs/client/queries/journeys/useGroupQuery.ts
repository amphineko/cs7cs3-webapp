import { useQuery } from 'react-query'
import { validate as validateUuid } from 'uuid'
import { useAccessToken } from '../../../../contexts/accessToken'
import { useEndpoint } from '../../../../contexts/api'

export type ApiJourneyGroup = {
    id: string

    status: 'Waiting' | 'Travelling' | 'End'

    from: {
        latitude: number
        longitude: number
    }
    to: {
        latitude: number
        longitude: number
    }

    maxMember: 0
    host: string
    members: [
        {
            userId: string
            status: 'PendingApproval' | 'Waiting' | 'Travelling' | 'Arrived'
        }
    ]
}

type ApiJourneyGroupResult =
    | {
          success: false
          reason: string
      }
    | {
          success: true
          payload: {
              journey: ApiJourneyGroup
          }
      }

export const getApiJourneyGroup = async (id: string, endpoint: string, token?: string) => {
    const url = new URL('journey/get-by-id', endpoint)
    const req = await fetch(url.toString(), {
        body: JSON.stringify({
            token,
            timestamp: Date.now(),
            payload: {
                journeyId: id,
            },
        }),
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
    })

    if (req.ok) {
        const result = (await req.json()) as ApiJourneyGroupResult
        if (result.success === true) {
            return result.payload.journey
        } else {
            throw new Error(`Server rejected: ${result.reason}`)
        }
    }
}

export const useJourneyGroupQuery = (id?: string, initialData?: ApiJourneyGroup) => {
    const { apiEndpoint } = useEndpoint()
    const { accessToken } = useAccessToken()

    return useQuery(
        ['api/v1/journeys/groups', id],
        async () => {
            if (id === undefined) {
                return
            }

            return await getApiJourneyGroup(id, apiEndpoint, accessToken)
        },
        {
            enabled: validateUuid(id),
            initialData,
            useErrorBoundary: true,
        }
    )
}
