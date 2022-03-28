import mapboxgl from 'mapbox-gl'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useUserLocation } from '../../contexts/userLocation'
import { UserLocation } from '../../libs/server/mapbox'

interface MapProps {
    accessToken: string
    maxHeight?: string

    destination?: UserLocation
    origin?: UserLocation
}

export const Map = ({ accessToken, destination, maxHeight, origin }: MapProps) => {
    const [containerId] = useState(() => `map-container-${Math.random()}`)
    const container = useRef<HTMLDivElement>()

    const map = useRef<mapboxgl.Map>()

    const userLocation = useUserLocation()
    const userCoords = useMemo(() => {
        if (userLocation.readystate === 'ready') {
            return { lat: userLocation.position.coords.latitude, lng: userLocation.position.coords.longitude }
        }
    }, [userLocation])

    useEffect(() => {
        if (!map.current) {
            map.current = new mapboxgl.Map({
                accessToken,
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

        return () => {
            // destroy and remount
            map.current?.remove()
            map.current = undefined
        }
    }, [accessToken, containerId, destination, origin])

    useEffect(() => {
        if (!map.current) {
            return
        }

        if (userCoords) {
            map.current.setCenter(userCoords)
        }

        if (destination && origin && userCoords) {
            const sw: [number, number] = [
                [destination.lng, origin.lng, userCoords.lng].sort((a, b) => a - b)[0],
                [destination.lat, origin.lat, userCoords.lat].sort((a, b) => a - b)[0],
            ]
            const ne: [number, number] = [
                [destination.lng, origin.lng, userCoords.lng].sort((a, b) => b - a)[0],
                [destination.lat, origin.lat, userCoords.lat].sort((a, b) => b - a)[0],
            ]
            map.current.fitBounds([sw, ne], { padding: 100 })
        }
    }, [destination, map, origin, userCoords, userLocation])

    return (
        <>
            <div className="map-container" id={containerId} ref={container} />
            <style jsx>{`
                .map-container {
                    height: 100vh;
                    max-height: ${maxHeight ?? '100vh'};
                    width: 100%;
                }
            `}</style>
        </>
    )
}
