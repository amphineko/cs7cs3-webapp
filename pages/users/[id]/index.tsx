import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import { Button, Grid } from '@mui/material'
import { blueGrey } from '@mui/material/colors'
import Box from '@mui/material/Box'
import Rating from '@mui/material/Rating'
import Typography from '@mui/material/Typography'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { useUesrInfoQuery } from '../../../libs/client/queries/useUserQuery'
import { useRouter } from 'next/router'
import MaleIcon from '@mui/icons-material/Male'
import FemaleIcon from '@mui/icons-material/Female'

export default function UserProfile() {
    const router = useRouter()
    const { id } = router.query
    const { data } = useUesrInfoQuery(String(id))
    const handleOnClick = async (id: string) => {
        const path = '/users/' + id + '/updateUserInfo'
        await router.push(path)
    }
    return (
        <Grid container paddingY={2}>
            <Grid item xs={13}>
                <Box display="flex" justifyContent="center" alignItems="center">
                    {data && <Avatar sx={{ bgcolor: blueGrey[500], width: 100, height: 100 }} src={data?.avatarUrl} />}
                </Box>
                <Box display="flex" justifyContent="center" alignItems="center" paddingTop={2}>
                    <Typography variant="body1" component="div" gutterBottom>
                        <Grid container alignItems="center">
                            {data?.username}
                            {data?.gender === 'Male' && <MaleIcon />}
                            {data?.gender === 'Female' && <FemaleIcon />}
                        </Grid>
                    </Typography>
                </Box>
                <Grid item xs={12} paddingY={2}>
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <EmojiEventsIcon />
                        <Rating defaultValue={data?.rating ?? 4.5} precision={0.5} readOnly />
                    </Box>
                </Grid>
            </Grid>
            <Grid item xs={13} paddingY={2}>
                <Box display="flex" justifyContent="center" alignItems="center" paddingTop={2}>
                    <Button variant="contained" color="success" onClick={() => handleOnClick(String(id))}>
                        Edit
                    </Button>
                </Box>
            </Grid>
        </Grid>
    )
}
