import { useQuery } from 'react-query'
import { validate as validateUuid } from 'uuid'
import { useAccessToken } from '../../../../contexts/accessToken'
import { useEndpoint } from '../../../../contexts/api'
import { IJourneyGroup } from '../../../api/groups'
import { LatLngLike } from '../../../server/mapbox'

export const createNewJourney = async (id: string, endpoint: string) => {
  const url = new URL(`api/v1/journeys/groups/${id}`, endpoint)
  const req = await fetch(url.toString())

  if (req.ok) {
    return (await req.json()) as IJourneyGroup
  } else {
    console.log(await req.text())
    throw new Error(`fetch() returned an error: ${req.statusText} (${req.status})`)
  }
}

export const useCreateNewJourneyQuery = (id?: string, from?: LatLngLike, to?: LatLngLike) => {
  const { apiEndpoint: endpoint } = useEndpoint()
  const { accessToken } = useAccessToken()

  return useQuery(['journey/create', from, to, accessToken], async () => {
    if (!accessToken || !id || !from || !to) {
      return undefined
    }

    const url = new URL('/user-info/get-profile', endpoint)

    const req = await fetch(url.toString(), {
      body: JSON.stringify({
        payload: {
          userId: id,
          from: {
            latitude: from.lat,
            longitude: from.lng
          },
          to: {
            latitude: to.lat,
            longitude: to.lng
          }
        },
        timestamp: Date.now(),
        token: accessToken,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    if (!req.ok) {
      throw new Error(`fetch() returned an error: ${req.statusText} (${req.status})`)
    }

    const result = (await req.json()) as
      | {
        success: false
        reason: string
      }
      | {
        success: true
        payload: {
          journeyId: string
        }
      }

    if (result.success === true) {
      return result.payload.journeyId
    } else {
      throw new Error(`Server failed: ${result.reason}`)
    }
  })
}
