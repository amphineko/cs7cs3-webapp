import { useQuery } from 'react-query'
import { useUserLocation } from '../../../contexts/userLocation'
import { IJourneyGroup } from '../../api/groups'
import { UserLocation } from '../../server/mapbox'

export const useNearbyGroupsQuery = (dest?: UserLocation) => {
    const { position } = useUserLocation()

    return useQuery(
        ['nearby-groups', position?.coords.latitude, position?.coords.longitude, dest?.lat, dest?.lng],
        async () => {
            if (dest === undefined || position === undefined) {
                console.error('useNearbyGroupsQuery: dest or position is undefined', dest, position)
                return []
            }

            const url = new URL('/api/v1/groups/nearby', window.location.href)
            url.searchParams.set('dest_lat', String(dest.lat))
            url.searchParams.set('dest_lng', String(dest.lng))
            url.searchParams.set('origin_lat', String(position.coords.latitude))
            url.searchParams.set('origin_lng', String(position.coords.longitude))

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
            enabled: position !== undefined,
            useErrorBoundary: true,
        }
    )
}
