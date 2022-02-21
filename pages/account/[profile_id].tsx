import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import { Divider, Grid, List, ListItem, ListItemAvatar, ListItemText, Switch } from '@mui/material'
import { blueGrey, pink } from '@mui/material/colors'
import Box from '@mui/material/Box'
import WorkIcon from '@mui/icons-material/Work'
import Rating from '@mui/material/Rating'
import CakeIcon from '@mui/icons-material/Cake'
import FemaleIcon from '@mui/icons-material/Female'
import Fab from '@mui/material/Fab'
import DirectionsSubwayIcon from '@mui/icons-material/DirectionsSubway'
import Typography from '@mui/material/Typography'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import PaymentIcon from '@mui/icons-material/Payment'
import Link from 'next/link'

export default function UserProfile() {
    return (
        <Grid container paddingY={2}>
            <Grid item xs={13}>
                <Box display="flex" justifyContent="center" alignItems="center">
                    <Avatar sx={{ bgcolor: blueGrey[500], width: 100, height: 100 }} src="/broken-image.jpg" />
                </Box>
                <Box display="flex" justifyContent="center" alignItems="center" paddingTop={2}>
                    <Typography variant="body1" component="div" gutterBottom>
                        John Cena
                    </Typography>
                    <FemaleIcon sx={{ color: pink[400] }} />
                </Box>
                <Grid item xs={12} paddingY={2}>
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <EmojiEventsIcon />
                        <Rating defaultValue={4.5} precision={0.5} readOnly />
                    </Box>
                </Grid>
                <Box
                    sx={{ '& > :not(style)': { boxShadow: 1, m: 1, p: 0.5 } }}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Fab variant="extended" size="small" color="primary" aria-label="add">
                        Good Listener
                    </Fab>
                    <Fab variant="extended" size="small" color="secondary" aria-label="add">
                        Passive
                    </Fab>
                    <Fab variant="extended" color="default" size="small" aria-label="add">
                        Happy Girl
                    </Fab>
                </Box>
            </Grid>
            <Grid container paddingTop={2}>
                <Grid item xs={13}>
                    <Box
                        sx={{ boxShadow: 3, borderRadius: 2 }}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <List
                            sx={{
                                width: '90%',
                                maxWidth: 360,
                                bgcolor: 'background.paper',
                            }}
                        >
                            <ListItem alignItems="center">
                                <ListItemAvatar>
                                    <Avatar>
                                        <CakeIcon fontSize="large" color="secondary" />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Birthday" secondary="Jan 9, 1996" />
                                <Switch />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <WorkIcon fontSize="large" color="warning" />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Work" secondary="Google Inc." />
                                <Switch />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <DirectionsSubwayIcon color="info" fontSize="large" />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Perference" secondary="Subway" />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <PaymentIcon color="info" fontSize="large" />
                                    </Avatar>
                                </ListItemAvatar>
                                <Link href="/setting/payment" passHref={true}>
                                    <ListItemText primary="Payment Method" secondary="Visa Card **** 6435" />
                                </Link>
                            </ListItem>
                        </List>
                    </Box>
                </Grid>
            </Grid>
        </Grid>
    )
}
