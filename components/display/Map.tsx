import bbox from '@turf/bbox'
import { points as createPoints } from '@turf/helpers'
import { BBox2d } from '@turf/helpers/dist/js/lib/geojson'
import { Feature } from 'geojson'
import mapboxgl from 'mapbox-gl'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useUserLocation } from '../../contexts/userLocation'
import { LatLngLike } from '../../libs/server/mapbox'

interface MapProps {
    accessToken: string
    maxHeight?: string

    destination?: LatLngLike
    direction?: Feature
    origin?: LatLngLike
}

export const Map = ({ accessToken, destination, direction, maxHeight, origin }: MapProps) => {
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

            // direction

            if (direction) {
                map.current.on('load', ({ target: map }) => {
                    map.addSource('direction', { type: 'geojson', data: direction })
                    map.addLayer({
                        id: 'direction',
                        type: 'line',
                        source: 'direction',
                        layout: {
                            'line-cap': 'round',
                            'line-join': 'round',
                        },
                        paint: {
                            'line-color': '#f2ca36',
                            'line-width': 8,
                        },
                    })
                })
            }
        }

        return () => {
            // destroy and remount
            map.current?.remove()
            map.current = undefined
        }
    }, [accessToken, containerId, destination, direction, origin])

    useEffect(() => {
        if (!map.current) {
            return
        }

        if (userCoords) {
            map.current.setCenter(userCoords)
        }

        if (destination && origin && userCoords) {
            const points = createPoints([
                [userCoords.lng, userCoords.lat],
                [destination.lng, destination.lat],
                [origin.lng, origin.lat],
            ])
            map.current.fitBounds(bbox(points) as BBox2d, { padding: 100 })
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
