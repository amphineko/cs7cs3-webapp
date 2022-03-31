import { FeatureCollection } from 'geojson'
import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { useEndpoint } from '../../../../contexts/api'
import { JourneyType } from '../../../api/groups'
import { LatLngLike } from '../../../server/mapbox'

const typeMapping: { [key in JourneyType]: string } = {
    bus: 'driving',
    taxi: 'driving',
    walk: 'walking',
}

type DirectionQueryResponse = FeatureCollection

export const useDirectionQuery = (origin?: LatLngLike, destination?: LatLngLike, type?: JourneyType) => {
    const { endpoint } = useEndpoint()

    const enabled = useMemo(() => !!(origin && destination && type), [origin, destination, type])

    return useQuery(
        ['directions', origin, destination],
        async () => {
            if (!enabled) {
                return
            }

            const query = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`
            const url = new URL(`api/v1/directions/${typeMapping[type]}/${query}`, endpoint)

            const resp = await fetch(url.toString())

            if (resp.ok) {
                const data = (await resp.json()) as DirectionQueryResponse

                return data.features[0]
            } else {
                throw new Error(`fetch() returned an error: ${resp.statusText} (${resp.status})`)
            }
        },
        {
            enabled,
        }
    )
}
