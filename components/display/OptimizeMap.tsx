import mapboxgl from 'mapbox-gl'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useUserLocation } from '../../contexts/userLocation'
import useOptimizeMapQuery from '../../libs/client/queries/journeys/useOptimizeMapQuery'
import { UserLocation } from '../../libs/server/mapbox'

export type routing_props = 'mapbox/driving' | 'mapbox/cycling' | 'mapbox/walking' | 'mapbox/driving-traffic'

interface OptimalMapProps {
    accessToken: string
    maxHeight?: string

    routing: routing_props

    destination?: UserLocation
    origin?: UserLocation
}

const OptimizeMap = ({ accessToken, maxHeight, routing, destination, origin }: OptimalMapProps) => {
    const [containerId] = useState(() => `map-container-${Math.random()}`)
    const container = useRef<HTMLDivElement>()

    const map = useRef<mapboxgl.Map>()

    const { data } = useOptimizeMapQuery(routing, destination, origin)

    const userLocation = useUserLocation()
    const userCoords = useMemo(() => {
        if (userLocation.readystate === 'ready') {
            return { lat: userLocation.position.coords.latitude, lng: userLocation.position.coords.longitude }
        }
    }, [userLocation])

    useEffect(() => {
        if (!map.current) {
            map.current = new mapboxgl.Map({
                accessToken:
                    'pk.eyJ1IjoiYW1waGluZWtvIiwiYSI6ImNrejV0dTRvZTBvdXUyb3FmdHdmbXgyaGkifQ.qSX45S404Pbr9PX9WbjuKA',
                center: origin ?? { lat: 0, lng: 0 },
                container: container.current.id,
                style: 'mapbox://styles/mapbox/streets-v11',
                zoom: 0,
            })

            // user location control

            const geolocateControl = new mapboxgl.GeolocateControl({
                showUserHeading: true,
                trackUserLocation: true,
            })

            map.current.addControl(geolocateControl)

            // destination marker

            if (destination) {
                const destinationMarker = new mapboxgl.Marker({ color: 'red' })
                destinationMarker.setLngLat(destination).addTo(map.current)
            }

            // origin marker

            if (origin) {
                const originMarker = new mapboxgl.Marker({ color: 'blue' })
                originMarker.setLngLat(origin).addTo(map.current)
            }
        }
    }, [accessToken, destination, origin])

    return (
        <>
            <div className="map-container" id={containerId} ref={container} />
            <style jsx>{`
                .map-container {
                    height: ${maxHeight ?? '100vh'};
                    width: 100%;
                }
            `}</style>
        </>
    )
}

export default OptimizeMap
