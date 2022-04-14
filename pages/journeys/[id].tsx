import { GpsFixed, PinDrop } from '@mui/icons-material'
import { Alert, Avatar, Box, Card, Divider, Grid, Skeleton, Typography } from '@mui/material'
import { GetServerSideProps, NextPage } from 'next'
import React, { useMemo } from 'react'
import { validate as validateUuid } from 'uuid'
import { Map } from '../../components/display/Map'
import { useDirectionQuery } from '../../libs/client/queries/directions/useDirectionQuery'
import { useReverseQuery } from '../../libs/client/queries/geocoding/useReverseQuery'
import {
    ApiJourneyGroup,
    ApiJourneyGroupMemberStatus,
    getApiJourneyGroup,
    useJourneyGroupQuery,
} from '../../libs/client/queries/journeys/useGroupQuery'
import { useProfileQuery } from '../../libs/client/queries/users/useProfileQuery'

interface ServerSideProps {
    accessToken: string
    error?: string
    group?: ApiJourneyGroup
    id?: string
}

const UserRow = ({ id, status }: { id: string; status?: ApiJourneyGroupMemberStatus }) => {
    const { data: user } = useProfileQuery(id)

    return (
        <Grid container direction="row" alignItems="center">
            <Grid item px={1}>
                {user ? <Avatar alt={user?.username} src={user?.avatar} /> : <Skeleton variant="circular" />}
            </Grid>
            <Grid item flexGrow={1}>
                {user ? <Typography variant="caption">{user?.username}</Typography> : <Skeleton width={240} />}
            </Grid>
            {status && (
                <Grid item>
                    {status === 'Arrived' && <Alert severity="success">Arrived</Alert>}
                    {status === 'PendingApproval' && <Alert severity="warning">Pending Approval</Alert>}
                    {status === 'Travelling' && <Alert severity="success">Travelling</Alert>}
                    {status === 'Waiting' && <Alert severity="info">Waiting</Alert>}
                </Grid>
            )}
        </Grid>
    )
}

const JourneyDetailPage: NextPage<ServerSideProps> = ({ accessToken, group: initialData, id }: ServerSideProps) => {
    const { data: group } = useJourneyGroupQuery(id, initialData)
    const originPos = useMemo(
        () => (group ? { lat: group.from.latitude, lng: group.from.longitude } : undefined),
        [group]
    )
    const destinationPos = useMemo(
        () => (group ? { lat: group.to.latitude, lng: group.to.longitude } : undefined),
        [group]
    )

    const { data: origin } = useReverseQuery(originPos)
    const { data: dest } = useReverseQuery(destinationPos)

    const { data: direction } = useDirectionQuery(originPos, destinationPos, 'walk') // TODO: use server returned direction type

    return (
        <Grid container direction="column" paddingY={2} spacing={2}>
            <Grid item>
                {group?.status === 'End' && <Alert severity="warning">This journey has ended.</Alert>}
                {group?.status === 'Travelling' && (
                    <Alert severity="info">This journey is currently in progress.</Alert>
                )}
                {group?.status === 'Waiting' && (
                    <Alert severity="success">This journey has not started yet, and you can join it.</Alert>
                )}
            </Grid>

            <Grid item>
                <Card>
                    <Map
                        accessToken={accessToken}
                        destination={destinationPos}
                        direction={direction}
                        maxHeight="50vh"
                        origin={originPos}
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
                                    <Typography variant="subtitle1">
                                        {origin?.[0].displayName ?? <Skeleton width={240} />}
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        {origin?.[0].address ?? <Skeleton width={240} />}
                                    </Typography>
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
                                    <Typography variant="subtitle1">
                                        {dest?.[0].displayName ?? <Skeleton width={240} />}
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        {dest?.[0].address ?? <Skeleton width={240} />}
                                    </Typography>
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
                            <UserRow id={group?.host} />
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
                            {group?.members.map(({ userId: id, status }) => (
                                <Grid item container alignItems="center" key={id}>
                                    <UserRow id={id} status={status} />
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
        const group = (await getApiJourneyGroup(id, process.env.API_URL)) ?? null
        return { props: { accessToken, group, id } }
    } catch (error) {
        return { props: { accessToken, error: (error as Error)?.message ?? 'unknown error', id } }
    }
}
