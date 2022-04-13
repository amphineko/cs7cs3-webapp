import { routing_props } from '../../../../components/display/OptimizeMap'
import { UserLocation } from '../../../server/mapbox'
import { useQuery } from 'react-query'

const useOptimizeMapQuery = (route_props: routing_props, destination: UserLocation, origin: UserLocation) => {
    return useQuery(['optimal map'], () => {
        // if (destination === undefined || origin === undefined || route_props === undefined) {
        //     return []
        // }
        const base = new URL('https://api.mapbox.com')
        let pathname = '/optimized-trips/v1/'

        if (route_props === 'mapbox/cycling') {
            pathname += '/mapbox/cycling/'
        } else if (route_props === 'mapbox/walking') {
            pathname += '/mapbox/walking/'
        } else if (route_props === 'mapbox/driving') {
            pathname += '/mapbox/driving/'
        } else if (route_props === 'mapbox/driving-traffic') {
            pathname += '/mapbox/driving-traffic/'
        } else {
            throw new Error(`useOptimizeMapQuery: Unknown route_props: ${route_props as unknown as string}`)
        }
        pathname += `${53.34},${6.26};${53.33306},${-6.24889}`
        base.pathname = pathname
        base.searchParams.set(
            'access_token',
            'pk.eyJ1IjoiYW1waGluZWtvIiwiYSI6ImNrejV0dTRvZTBvdXUyb3FmdHdmbXgyaGkifQ.qSX45S404Pbr9PX9WbjuKA'
        )
        console.log(base.toString())
    })
}

export default useOptimizeMapQuery
