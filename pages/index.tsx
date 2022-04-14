import { GpsFixed, PinDrop } from '@mui/icons-material'
import { Alert, Box, Button, Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { GroupTable } from '../components/display/GroupTable'
import { AddressSearch } from '../components/inputs/AddressSearch'
import { useAccessToken } from '../contexts/accessToken'
import { useUserLocation } from '../contexts/userLocation'
import { DestinationSearchEntry } from '../libs/api/maps'
import { useCreateNewJourneyQuery } from '../libs/client/queries/journeys/useCreateNewJourneyQuery'
import { useNearbyJourneyGroupsQuery } from '../libs/client/queries/journeys/useNearbyGroupsQuery'

const IndexPage = () => {
    const userLocation = useUserLocation()

    const [destination, setDestination] = useState<DestinationSearchEntry>()
    const [origin, setOrigin] = useState<DestinationSearchEntry>()

    const { data: nearbyGroups } = useNearbyJourneyGroupsQuery(destination?.position, origin?.position)

    const router = useRouter()
    const { id: selfId } = useAccessToken()

    const handleCreateNew = () => {
        const journeyId = useCreateNewJourneyQuery(selfId, origin.position, destination.position);
        router.push(`/journey/` + journeyId).catch((err) => console.error(err))
    }

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

                <Grid item xs={13} paddingY={2}>
                    <Box display="flex" justifyContent="center" alignItems="center" paddingTop={2}>
                        <Button variant="contained" color="success" onClick={handleCreateNew}>
                            Create New
                        </Button>
                    </Box>
                </Grid>

                <Grid item>
                    <GroupTable groups={nearbyGroups ?? []} />
                </Grid>
            </Grid>
        </Grid>
    )
}

export default IndexPage
