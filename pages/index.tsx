import { Alert, Grid } from '@mui/material'
import { useState } from 'react'
import { GroupTable } from '../components/display/GroupTable'
import { AddressSearch } from '../components/inputs/AddressSearch'
import { useUserLocation } from '../contexts/userLocation'
import { DestinationSearchEntry } from '../libs/api/maps'
import { useNearbyGroupsQuery } from '../libs/client/queries/useNearbyGroupsQuery'

const IndexPage = () => {
    const { error, position } = useUserLocation()

    const [destination, setDestination] = useState<DestinationSearchEntry>()

    const { data: nearbyGroups } = useNearbyGroupsQuery(destination?.position)

    return (
        <Grid container direction="column" paddingY={2} spacing={2}>
            {position === undefined && (
                <Grid item>
                    {error ? (
                        <Alert severity="error">Current location unavailable: {error.message}</Alert>
                    ) : (
                        <Alert severity="warning">Waiting for current location</Alert>
                    )}
                </Grid>
            )}

            <Grid item>
                <AddressSearch onChange={(value) => setDestination(value)} />
            </Grid>

            <Grid item>
                <GroupTable groups={nearbyGroups ?? []} />
            </Grid>
        </Grid>
    )
}

export default IndexPage
