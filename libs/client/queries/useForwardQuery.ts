import { useQuery } from 'react-query'
import { DestinationSearchEntry } from '../../api/maps'
import { UserLocation } from '../../server/mapbox'

export const useForwardQuery = (query: string, location?: UserLocation, enabled = false) => {
    return useQuery(
        ['address-forward', query],
        async () => {
            if (query === '') {
                return []
            }

            const url = new URL('/api/v1/maps/destinations', window.location.href)
            url.searchParams.set('query', query)
            if (location) {
                url.searchParams.set('lat', String(location.lat))
                url.searchParams.set('lng', String(location.lng))
            }

            const req = await fetch(url.toString())
            if (req.ok) {
                const resp = (await req.json()) as unknown as {
                    code: number
                    data: DestinationSearchEntry[]
                    error: string
                }

                if (resp.code !== 200) {
                    throw new Error(`Request returned an error: ${resp.error} (${resp.code})`)
                }

                return resp.data
            } else {
                throw new Error(`fetch() returned an error: ${req.statusText} (${req.status})`)
            }
        },
        {
            enabled: enabled && query.split(' ').length < 10,
        }
    )
}
