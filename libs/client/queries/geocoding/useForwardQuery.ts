import { useQuery } from 'react-query'
import { useEndpoint } from '../../../../contexts/api'
import { DestinationSearchEntry } from '../../../api/maps'
import { UserLocation } from '../../../server/mapbox'

export const useGeocodingForwardQuery = (search: string, location?: UserLocation, enabled = false) => {
    const { endpoint } = useEndpoint()

    return useQuery(
        ['geocoding-forward', search],
        async () => {
            if (search === '') {
                return []
            }

            const url = new URL('api/v1/geocoding/forward', endpoint)

            url.searchParams.set('search', search)
            if (location) {
                url.searchParams.set('latitude', String(location.lat))
                url.searchParams.set('longitude', String(location.lng))
            }

            const req = await fetch(url.toString())
            if (req.ok) {
                return (await req.json()) as DestinationSearchEntry[]
            } else {
                throw new Error(`fetch() returned an error: ${req.statusText} (${req.status})`)
            }
        },
        {
            enabled: enabled && search.split(' ').length < 10,
        }
    )
}
