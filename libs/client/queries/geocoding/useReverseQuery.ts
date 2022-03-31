import { useQuery } from 'react-query'
import { useEndpoint } from '../../../../contexts/api'
import { DestinationSearchEntry } from '../../../api/maps'
import { LatLngLike } from '../../../server/mapbox'

export const useReverseQuery = (location?: LatLngLike) => {
    const { endpoint } = useEndpoint()

    return useQuery(
        ['geocoding-reverse', location?.lat, location?.lng],
        async () => {
            if (location === undefined) {
                return []
            }

            const url = new URL('api/v1/geocoding/reverse', endpoint)

            url.searchParams.set('latitude', String(location.lat))
            url.searchParams.set('longitude', String(location.lng))

            const req = await fetch(url.toString())
            if (req.ok) {
                return (await req.json()) as DestinationSearchEntry[]
            } else {
                throw new Error(`fetch() returned an error: ${req.statusText} (${req.status})`)
            }
        },
        {
            enabled: location !== undefined,
        }
    )
}
