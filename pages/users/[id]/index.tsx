import { FemaleOutlined, MaleOutlined } from '@mui/icons-material'
import CommentIcon from '@mui/icons-material/Comment'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import InfoIcon from '@mui/icons-material/Info'
import NumbersIcon from '@mui/icons-material/Numbers'
import { LoadingButton } from '@mui/lab'
import { Alert, Button, Grid, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import { blueGrey } from '@mui/material/colors'
import Rating from '@mui/material/Rating'
import Typography from '@mui/material/Typography'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import * as React from 'react'
import Link from 'next/link'
import { useJourneyGroupQuery } from '../../../libs/client/queries/journeys/useGroupQuery'
import { IUserProfile, useProfileQuery } from '../../../libs/client/queries/users/useProfileQuery'
import { useAccessToken } from '../../../contexts/accessToken'

const UserHistory = ({ id }: { id: string }) => {
    const { data: group } = useJourneyGroupQuery(id)
    const { data: userInfo } = useProfileQuery(group?.host)

    return (
        <Link href={`/journeys/${id}`} passHref>
            <Button>
                <ListItemAvatar>
                    <NumbersIcon fontSize="large" color="secondary" />
                </ListItemAvatar>
                <ListItemText primary={`Hosted By: ${userInfo?.username}`} />
            </Button>
        </Link>
    )
}

const UserProfileBody = ({
    profile: { avatar, bio, gender, id, reviews, rating, username, histories },
}: {
    profile: IUserProfile
}) => {
    const router = useRouter()
    const { id: me } = useAccessToken()
    const handleEdit = () => {
        router.push(`/users/${id}/edit`).catch((err) => console.error(err))
    }

    return (
        <Grid container alignItems="center" flexDirection="column" paddingY={4}>
            <Grid item xs={13}>
                <Box display="flex" justifyContent="center" alignItems="center">
                    <Avatar sx={{ bgcolor: blueGrey[500], width: 100, height: 100 }} src={avatar} />
                </Box>
                <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" paddingTop={2}>
                    {gender === 'female' && <FemaleOutlined htmlColor="#1F4788" />}
                    {gender === 'male' && <MaleOutlined htmlColor="#F2666C" />}
                    <Typography variant="body1" component="div" gutterBottom>
                        {username}
                    </Typography>
                </Box>
                <Grid item xs={12} paddingY={2}>
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <EmojiEventsIcon />
                        <Rating defaultValue={rating} precision={0.5} readOnly />
                    </Box>
                </Grid>
            </Grid>

            <Grid
                item
                marginY={2}
                sx={{
                    maxWidth: '32em',
                    width: '100%',
                }}
            >
                <Grid item xs={13}>
                    <Box
                        sx={{
                            boxShadow: 3,
                            borderRadius: 2,
                            bgcolor: 'background.paper',
                        }}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <List
                            sx={{
                                bgcolor: 'background.paper',
                                width: '100%',
                            }}
                        >
                            <ListItem alignItems="center">
                                <ListItemAvatar>
                                    <InfoIcon fontSize="large" color="primary" />
                                </ListItemAvatar>
                                <ListItemText primary="Bio" secondary={bio} />
                            </ListItem>
                            <ListItem alignItems="center">
                                <ListItemAvatar>
                                    <NumbersIcon fontSize="large" color="secondary" />
                                </ListItemAvatar>
                                <ListItemText primary="Total journeys" secondary={histories.length} />
                            </ListItem>
                            <ListItem alignItems="center">
                                <ListItemAvatar>
                                    <CommentIcon fontSize="large" color="secondary" />
                                </ListItemAvatar>
                                <ListItemText primary="Total reviews" secondary={reviews.length} />
                            </ListItem>
                        </List>
                    </Box>
                    <Grid item>
                        <List
                            sx={{
                                bgcolor: 'background.paper',
                                width: '100%',
                            }}
                        >
                            {histories.map((item) => (
                                <ListItem key={item}>
                                    <UserHistory id={item} />
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                </Grid>
            </Grid>

            {id === me && (
                <Grid item xs={13} paddingY={2}>
                    <Box display="flex" justifyContent="center" alignItems="center" paddingTop={2}>
                        <Button variant="contained" color="success" onClick={handleEdit}>
                            Edit
                        </Button>
                    </Box>
                </Grid>
            )}
        </Grid>
    )
}

const UserProfilePage: NextPage = () => {
    const router = useRouter()
    const { data: profile, error, isLoading } = useProfileQuery(String(router.query.id))

    return (
        <>
            {profile ? (
                <UserProfileBody profile={profile} />
            ) : (
                <Grid container direction="column" alignItems="center" paddingY={4}>
                    <Grid item>
                        {error && <Alert severity="error">{String(error)}</Alert>}
                        {isLoading && (
                            <LoadingButton loading variant="outlined">
                                Loading
                            </LoadingButton>
                        )}
                    </Grid>
                </Grid>
            )}
        </>
    )
}

export default UserProfilePage
