import { DirectionsBus, DirectionsWalk, GpsFixed, LocalTaxi, PinDrop, QuestionMark } from '@mui/icons-material'
import { Alert, Avatar, AvatarGroup, Button, Card, CardActions, Grid, Skeleton, Typography } from '@mui/material'
import { Box } from '@mui/system'
import NextLink from 'next/link'
import { JourneyType } from '../../libs/api/groups'
import { useReverseQuery } from '../../libs/client/queries/geocoding/useReverseQuery'
import { ApiJourneyGroup } from '../../libs/client/queries/journeys/useGroupQuery'
import { useProfileQuery } from '../../libs/client/queries/users/useProfileQuery'

const JourneyIconMap: Record<JourneyType, JSX.Element> = {
    bus: <DirectionsBus />,
    taxi: <LocalTaxi />,
    walk: <DirectionsWalk />,
}

export const GroupCard = ({ group }: { group: ApiJourneyGroup }) => {
    const originPos = group ? { lat: group.from.latitude, lng: group.from.longitude } : undefined
    const { data: origin } = useReverseQuery(originPos)

    const destPos = group ? { lat: group.to.latitude, lng: group.to.longitude } : undefined
    const { data: dest } = useReverseQuery(destPos)

    const { data: host } = useProfileQuery(group.host)

    return (
        <Card>
            <Grid container direction="column">
                <Grid item>
                    {group?.status === 'End' && <Alert severity="warning">Ended</Alert>}
                    {group?.status === 'Travelling' && <Alert severity="info">In Progress</Alert>}
                    {group?.status === 'Waiting' && <Alert severity="success">Available</Alert>}
                </Grid>
                <Grid container direction="row" p={2}>
                    <Grid item xs={1}>
                        <Box>{JourneyIconMap['walk'] ?? <QuestionMark />}</Box>
                    </Grid>
                    <Grid item container xs={11}>
                        <Grid item container direction="column" spacing={2}>
                            <Grid item container>
                                <Grid item p={1}>
                                    <GpsFixed aria-label="From" />
                                </Grid>
                                <Grid item>
                                    <Typography variant="subtitle1">{origin?.[0].displayName}</Typography>
                                    <Typography variant="subtitle2">{origin?.[0].address}</Typography>
                                </Grid>
                            </Grid>

                            <Grid item container>
                                <Grid item p={1}>
                                    <PinDrop aria-label="To" />
                                </Grid>
                                <Grid item>
                                    <Typography variant="subtitle1">{dest?.[0].displayName}</Typography>
                                    <Typography variant="subtitle2">{dest?.[0].address}</Typography>
                                </Grid>
                            </Grid>

                            <Grid item container direction="row" alignItems="center">
                                {group && host ? (
                                    <>
                                        <Grid item px={1}>
                                            <AvatarGroup total={group.members.length}>
                                                <Avatar alt={host.username} src={host.avatar} />
                                            </AvatarGroup>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="caption">{host?.username}</Typography>
                                        </Grid>
                                    </>
                                ) : (
                                    <Skeleton width={40} height={40} />
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <CardActions>
                <NextLink href={`/journeys/${group.id}`} passHref>
                    <Button size="small">Details</Button>
                </NextLink>
            </CardActions>
        </Card>
    )
}

export const GroupTable = ({ groups }: { groups: ApiJourneyGroup[] }) => {
    return (
        <Grid container spacing={2}>
            {groups.map((group) => (
                <Grid item key={group.id} xs={12} sm={6}>
                    <GroupCard group={group} />
                </Grid>
            ))}
        </Grid>
    )
}
