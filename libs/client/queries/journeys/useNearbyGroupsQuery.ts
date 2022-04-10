import { useQuery } from 'react-query'
import { useEndpoint } from '../../../../contexts/api'
import { IJourneyGroup } from '../../../api/groups'
import { LatLngLike } from '../../../server/mapbox'

export const useNearbyJourneyGroupsQuery = (destination?: LatLngLike, origin?: LatLngLike) => {
    const { liftEndpoint: endpoint } = useEndpoint()

    return useQuery(
        ['api/v1/journeys/groups', origin?.lat, origin?.lng, destination?.lat, destination?.lng],
        async () => {
            if (destination === undefined || origin === undefined) {
                return []
            }

            const url = new URL('api/v1/journeys/groups', endpoint)
            url.searchParams.set('destLat', String(destination.lat))
            url.searchParams.set('destLng', String(destination.lng))
            url.searchParams.set('originLat', String(origin.lat))
            url.searchParams.set('originLng', String(origin.lng))

            const req = await fetch(url.toString())
            if (req.ok) {
                return (await req.json()) as IJourneyGroup[]
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
