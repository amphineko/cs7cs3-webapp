import { useQuery } from 'react-query'
import { IJourneyGroup } from '../../api/groups'
import { UserLocation } from '../../server/mapbox'

export const useNearbyGroupsQuery = (destination?: UserLocation, origin?: UserLocation) => {
    return useQuery(
        ['nearby-groups', origin?.lat, origin?.lng, destination?.lat, destination?.lng],
        async () => {
            if (destination === undefined || origin === undefined) {
                return []
            }

            const url = new URL('/api/v1/groups/nearby', window.location.href)
            url.searchParams.set('dest_lat', String(destination.lat))
            url.searchParams.set('dest_lng', String(destination.lng))
            url.searchParams.set('origin_lat', String(origin.lat))
            url.searchParams.set('origin_lng', String(origin.lng))
            console.log('querying for', origin)

            const req = await fetch(url.toString())
            if (req.ok) {
                const resp = (await req.json()) as unknown as {
                    code: number
                    data: unknown
                    error: string
                }

                if (resp.code !== 200) {
                    throw new Error(`Request returned an error: ${resp.error} (${resp.code})`)
                }

                return resp.data as IJourneyGroup[]
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
