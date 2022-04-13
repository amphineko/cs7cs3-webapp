import { GpsFixed, PinDrop } from '@mui/icons-material'
import { Avatar, Box, Card, Divider, Grid, Skeleton, Typography } from '@mui/material'
import { GetServerSideProps, NextPage } from 'next'
import React from 'react'
import { validate as validateUuid } from 'uuid'
import { Map } from '../../components/display/Map'
import { IJourneyGroup, IJourneyParticipant } from '../../libs/api/groups'
import { useDirectionQuery } from '../../libs/client/queries/directions/useDirectionQuery'
import { getJourneyGroup, useJourneyGroupQuery } from '../../libs/client/queries/journeys/useGroupQuery'

interface ServerSideProps {
    accessToken: string
    error?: string
    group?: IJourneyGroup
    id?: string
}

const UserRow = ({ user }: { user: IJourneyParticipant }) => {
    return (
        <>
            <Grid item px={1}>
                {user ? <Avatar alt={user.screenName} src={user.avatarUrl} /> : <Skeleton variant="circular" />}
            </Grid>
            <Grid item>
                {user ? <Typography variant="caption">{user.screenName}</Typography> : <Skeleton width={240} />}
            </Grid>
        </>
    )
}

const JourneyDetailPage: NextPage<ServerSideProps> = ({ accessToken, group: initialData, id }: ServerSideProps) => {
    const { data: group } = useJourneyGroupQuery(id, initialData)
    const { data: direction } = useDirectionQuery(group?.origin.position, group?.destination.position, group?.type)

    return (
        <Grid container direction="column" paddingY={2} spacing={2}>
            <Grid item>
                <Card>
                    <Map
                        accessToken={accessToken}
                        destination={group?.destination.position}
                        direction={direction}
                        maxHeight="50vh"
                        origin={group?.origin.position}
                    />
                </Card>
            </Grid>

            <Grid item>
                <Card>
                    <Grid container direction="column" paddingY={2} spacing={2}>
                        <Grid item container direction="row">
                            <Grid item container alignItems="center" justifyContent="center" xs={1}>
                                <Box alignItems="center">
                                    <GpsFixed aria-label="From" />
                                </Box>
                            </Grid>
                            {group ? (
                                <Grid item alignItems="center" justifyContent="center" xs={11}>
                                    <Typography variant="subtitle1">{group.origin.displayName}</Typography>
                                    <Typography variant="subtitle2">{group.origin.address}</Typography>
                                </Grid>
                            ) : (
                                <Skeleton width={240} />
                            )}
                        </Grid>
                        <Grid item>
                            <Divider />
                        </Grid>
                        <Grid item container direction="row">
                            <Grid item container alignItems="center" justifyContent="center" xs={1}>
                                <Box alignItems="center">
                                    <PinDrop aria-label="To" />
                                </Box>
                            </Grid>
                            {group ? (
                                <Grid item alignItems="center" justifyContent="center" xs={11}>
                                    <Typography variant="subtitle1">{group.destination.displayName}</Typography>
                                    <Typography variant="subtitle2">{group.destination.address}</Typography>
                                </Grid>
                            ) : (
                                <Skeleton width={240} />
                            )}
                        </Grid>
                    </Grid>
                </Card>
            </Grid>

            <Grid item>
                <Card>
                    <Grid container spacing={1} p={2}>
                        <Grid item>
                            <Box paddingLeft={1} paddingY={1}>
                                <Typography color="text.secondary" variant="subtitle1">
                                    Hosted by
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item container direction="row" alignItems="center" p={1}>
                            <UserRow user={group?.host} />
                        </Grid>
                    </Grid>
                </Card>
            </Grid>

            <Grid item>
                <Card>
                    <Grid container spacing={1} p={2}>
                        <Grid item>
                            <Box paddingLeft={1} paddingY={1}>
                                <Typography color="text.secondary" variant="subtitle1">
                                    Participants
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item container direction="column" alignItems="center" spacing={2} p={1}>
                            {group?.guests.map((user) => (
                                <Grid item container alignItems="center" key={user.id}>
                                    <UserRow user={user} />
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
        </Grid>
    )
}

export default JourneyDetailPage

const accessToken = process.env.MAPBOX_CLIENT_TOKEN

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ query: { id } }) => {
    if (typeof id !== 'string' || !validateUuid(id)) {
        return {
            props: {
                accessToken,
                error: 'Missing or invalid journey id',
            },
        }
    }

    try {
        const group = await getJourneyGroup(id, process.env.IONPROPELLER_URL)
        return { props: { accessToken, group, id } }
    } catch (error) {
        return { props: { accessToken, error: (error as Error)?.message ?? 'unknown error', id } }
    }
}
