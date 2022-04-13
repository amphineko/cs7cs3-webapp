import { Alert, Grid } from '@mui/material'
import { useEffect, useState } from 'react'
import Map, { NavigationControl, FullscreenControl, Marker } from 'react-map-gl'
import { useUserLocation } from '../../contexts/userLocation'

const Navigation = () => {
    const currentLocation = useUserLocation()
    const [lat, setLat] = useState(53.35)
    const [lng, setLng] = useState(-6.26)

    useEffect(() => {
        currentLocation.readystate === 'ready' && setLng(currentLocation.position.coords.longitude)
        currentLocation.readystate === 'ready' && setLat(currentLocation.position.coords.latitude)
    })

    return (
        <>
            <Grid>
                <Grid container>
                    <Grid container direction="column" paddingY={2} spacing={2}>
                        {currentLocation.readystate === 'unavailable' && (
                            <Alert severity="error">
                                Location is unavailable{currentLocation.error && <>: {currentLocation.error}</>}
                            </Alert>
                        )}
                        {currentLocation.readystate === 'waiting' && (
                            <Alert severity="info">
                                <span>Finding your location</span>
                            </Alert>
                        )}
                    </Grid>
                </Grid>
                <Grid item paddingTop={2}></Grid>
                <Map
                    style={{ height: '70vh' }}
                    initialViewState={{ longitude: lng, latitude: lat, zoom: 13 }}
                    mapStyle="mapbox://styles/mapbox/outdoors-v11"
                    mapboxAccessToken={process.env.MAPBOX_CLIENT_TOKEN}
                >
                    <Marker latitude={lat} longitude={lng} />
                    <FullscreenControl position="top-right" />
                    <NavigationControl position="bottom-right" />
                </Map>
            </Grid>
        </>
    )
}

export default Navigation
