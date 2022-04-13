import { GpsFixed } from '@mui/icons-material'
import { Alert, Button, Grid, Typography, TextField, MenuItem, Card } from '@mui/material'
import { useEffect, useState } from 'react'
import { AddressSearch } from '../../components/inputs/AddressSearch'
import { useUserLocation } from '../../contexts/userLocation'
import { DestinationSearchEntry } from '../../libs/api/maps'
import { Map } from '../../components/display/Map'
import { JourneyType } from '../../libs/api/groups'

const accessToken = process.env.MAPBOX_CLIENT_TOKEN

const AddJourney = () => {
    const methodList = [
        {
            label: 'taxi',
            value: 'taxi',
        },
        {
            label: 'walk',
            value: 'walk',
        },
        {
            label: 'bus',
            value: 'bus',
        },
    ]

    // get current location
    const currentLocation = useUserLocation()
    const [lng, setLng] = useState(-6.26)
    const [lat, setLat] = useState(53.35)
    const [origin, setOrigin] = useState<DestinationSearchEntry>()
    const [destination, setDestination] = useState<DestinationSearchEntry>()
    const [method, setMethod] = useState<JourneyType>('taxi')

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMethod(event.target.value as JourneyType)
    }

    const handleOnClick = () => {
        console.log('clicked')
    }

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
                <Grid item paddingTop={2}>
                    <Grid item>
                        <Card>
                            <Map
                                accessToken="pk.eyJ1IjoiYW1waGluZWtvIiwiYSI6ImNrejV0dTRvZTBvdXUyb3FmdHdmbXgyaGkifQ.qSX45S404Pbr9PX9WbjuKA"
                                destination={
                                    destination !== undefined ? destination.position : { lat: 53.3498, lng: -6.2603 }
                                }
                                maxHeight="50vh"
                                origin={origin !== undefined ? origin.position : { lat: 53.3498, lng: -6.2603 }}
                            />
                        </Card>
                    </Grid>
                    <Typography paddingTop={9}>
                        <Grid container direction="row" alignItems="center">
                            <GpsFixed />
                            From
                        </Grid>
                    </Typography>
                    <AddressSearch onChange={(value) => setOrigin(value)} />
                </Grid>

                <Grid item>
                    <Typography>
                        <Grid container direction="row" alignItems="center">
                            To
                        </Grid>
                    </Typography>
                    <AddressSearch onChange={(value) => setDestination(value)} />
                </Grid>

                <Grid item alignItems="center">
                    <Grid item margin={2}>
                        <TextField
                            required
                            label="method"
                            fullWidth
                            defaultValue={method}
                            value={method}
                            onChange={handleChange}
                            select
                            variant="filled"
                        >
                            {methodList.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>

                <Grid item margin={2}>
                    <Button fullWidth variant="contained" onClick={() => handleOnClick()}>
                        Create
                    </Button>
                </Grid>
            </Grid>
        </>
    )
}

export default AddJourney
