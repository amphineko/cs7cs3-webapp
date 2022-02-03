import { DirectionsBus, DirectionsWalk, GpsFixed, LocalTaxi, PinDrop, QuestionMark } from '@mui/icons-material'
import { Avatar, Grid, Paper, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { IJourneyGroup, JourneyType } from '../../libs/api/groups'

const JourneyIconMap: Record<JourneyType, JSX.Element> = {
    bus: <DirectionsBus />,
    taxi: <LocalTaxi />,
    walk: <DirectionsWalk />,
}

export const GroupCard = ({ group }: { group: IJourneyGroup }) => {
    return (
        <Paper>
            <Grid container direction="row" p={2}>
                <Grid item xs={1}>
                    <Box>{JourneyIconMap[group.type] ?? <QuestionMark />}</Box>
                </Grid>
                <Grid item container xs={11}>
                    <Grid item container direction="column" spacing={2}>
                        <Grid item container>
                            <Grid item p={1}>
                                <GpsFixed aria-label="From" />
                            </Grid>
                            <Grid item>
                                <Typography variant="subtitle1">{group.origin.displayName}</Typography>
                                <Typography variant="subtitle2">{group.origin.fullName}</Typography>
                            </Grid>
                        </Grid>

                        <Grid item container>
                            <Grid item p={1}>
                                <PinDrop aria-label="To" />
                            </Grid>
                            <Grid item>
                                <Typography variant="subtitle1">{group.destination.displayName}</Typography>
                                <Typography variant="subtitle2">{group.destination.fullName}</Typography>
                            </Grid>
                        </Grid>

                        <Grid item container direction="row" alignItems="center">
                            <Grid item px={1}>
                                <Avatar alt={group.owner.screenName} src={group.owner.avatarUrl} />
                            </Grid>
                            <Grid item>
                                <Typography variant="caption">{group.owner.screenName}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    )
}

export const GroupTable = ({ groups }: { groups: IJourneyGroup[] }) => {
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
