import { useQuery } from 'react-query'
import { useAccessToken } from '../../../../contexts/accessToken'
import { useEndpoint } from '../../../../contexts/api'
import { LatLngLike } from '../../../server/mapbox'
import { ApiJourneyGroup } from './useGroupQuery'

type NearbyGroupQueryResult =
    | {
          success: false
          reason: string
      }
    | {
          success: true
          payload: {
              journeys: ApiJourneyGroup[]
          }
      }

export const useNearbyJourneyGroupsQuery = (destination?: LatLngLike, origin?: LatLngLike) => {
    const { apiEndpoint } = useEndpoint()
    const { accessToken } = useAccessToken()

    return useQuery(
        ['api/v1/journeys/groups', origin?.lat, origin?.lng, destination?.lat, destination?.lng],
        async () => {
            if (destination === undefined || origin === undefined) {
                return []
            }

            const url = new URL('journey/get-by-location', apiEndpoint)
            const req = await fetch(url.toString(), {
                body: JSON.stringify({
                    token: accessToken,
                    timestamp: Date.now(),
                    payload: {
                        from: {
                            latitude: origin.lat,
                            longitude: origin.lng,
                        },
                        to: {
                            latitude: destination.lat,
                            longitude: destination.lng,
                        },
                    },
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            })

            if (req.ok) {
                const result = (await req.json()) as NearbyGroupQueryResult

                if (result.success === true) {
                    return result.payload.journeys
                }

                if (result.reason === 'no journey available') {
                    return []
                }

                throw new Error(`Server rejected: ${result.reason}`)
            } else {
                throw new Error(`fetch() returned an error: ${req.statusText} (${req.status})`)
            }
        },
        {
            enabled: destination !== undefined && origin !== undefined,
            useErrorBoundary: true,
        }
    )
}
