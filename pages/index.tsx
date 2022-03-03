import { GpsFixed, PinDrop } from '@mui/icons-material'
import { Alert, Grid, Typography } from '@mui/material'
import { useState } from 'react'
import { GroupTable } from '../components/display/GroupTable'
import { AddressSearch } from '../components/inputs/AddressSearch'
import { useUserLocation } from '../contexts/userLocation'
import { DestinationSearchEntry } from '../libs/api/maps'
import { useNearbyGroupsQuery } from '../libs/client/queries/useNearbyGroupsQuery'

const IndexPage = () => {
    const userLocation = useUserLocation()

    const [destination, setDestination] = useState<DestinationSearchEntry>()
    const [origin, setOrigin] = useState<DestinationSearchEntry>()

    const { data: nearbyGroups } = useNearbyGroupsQuery(destination?.position, origin?.position)

    return (
        <Grid container alignItems="center" minHeight="100vh">
            <Grid container direction="column" paddingY={2} spacing={2}>
                {userLocation.readystate === 'unavailable' && (
                    <Alert severity="error">
                        Location is unavailable{userLocation.error && <>: {userLocation.error}</>}
                    </Alert>
                )}
                {userLocation.readystate === 'waiting' && (
                    <Alert severity="info">
                        <span>Finding your location</span>
                    </Alert>
                )}

                <Grid item>
                    <Typography>
                        <Grid container direction="row" alignItems="center">
                            <GpsFixed />
                            From
                        </Grid>
                    </Typography>
                    <AddressSearch defaultToUserLocation onChange={(value) => setOrigin(value)} />
                </Grid>

                <Grid item>
                    <Typography>
                        <Grid container direction="row" alignItems="center">
                            <PinDrop />
                            To
                        </Grid>
                    </Typography>
                    <AddressSearch onChange={(value) => setDestination(value)} />
                </Grid>

                <Grid item>
                    <GroupTable groups={nearbyGroups ?? []} />
                </Grid>
            </Grid>
        </Grid>
    )
}

export default IndexPage
