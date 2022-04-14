import createEmotionCache, { EmotionCache } from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { Logout } from '@mui/icons-material'
import FaceIcon from '@mui/icons-material/Face'
import HomeIcon from '@mui/icons-material/Home'
import MenuIcon from '@mui/icons-material/Menu'
import SettingsIcon from '@mui/icons-material/Settings'
import {
    AppBar,
    Avatar,
    Button,
    Container,
    createTheme,
    CssBaseline,
    Divider,
    Drawer,
    IconButton,
    ListItem,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    ThemeProvider,
    Toolbar,
    Tooltip,
    Typography,
} from '@mui/material'
import 'mapbox-gl/dist/mapbox-gl.css'
import { NextPage } from 'next'
import { AppProps } from 'next/app'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { MouseEventHandler, useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AccessTokenProvider, useAccessToken } from '../contexts/accessToken'
import { EndpointProvider } from '../contexts/api'
import { UserLocationProvider } from '../contexts/userLocation'
import { useProfileQuery } from '../libs/client/queries/users/useProfileQuery'

const theme = createTheme({})

const clientSideEmotionCache = createEmotionCache({ key: 'css', prepend: true })
const queryClient = new QueryClient()

interface EnhancedAppProps extends AppProps {
    emotionCache?: EmotionCache
}

interface AppInitialProps {
    apiEndpoint: string
    liftEndpoint: string
}

const UserBar = () => {
    const { clear, id: selfId } = useAccessToken()
    const { data: selfProfile } = useProfileQuery(selfId)

    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)

    const handleClose = () => {
        setMenuAnchor(null)
    }

    const handleOpenClick: MouseEventHandler<HTMLElement> = (event) => {
        setMenuAnchor(event.currentTarget)
    }

    return selfProfile ? (
        <>
            <Typography>{selfProfile.username}</Typography>{' '}
            <Tooltip title="Account menu">
                <IconButton
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={handleOpenClick}
                    size="small"
                    sx={{ ml: 2 }}
                >
                    <Avatar src={selfProfile.avatar} sx={{ bgcolor: 'secondary.main' }} />
                </IconButton>
            </Tooltip>
            <Menu anchorEl={menuAnchor} onClick={handleClose} onClose={handleClose} open={menuAnchor !== null}>
                <MenuItem>
                    <Link href={`/users/${selfId}`} passHref>
                        <Button startIcon={<FaceIcon />}>My Profile</Button>
                    </Link>
                </MenuItem>
                <MenuItem>
                    <Button onClick={() => clear()} startIcon={<Logout />}>
                        Logout
                    </Button>
                </MenuItem>
            </Menu>
        </>
    ) : (
        <>
            <Link href="/users/register" passHref>
                <Button color="inherit" href="#" sx={{ my: 1, mx: 1.5 }}>
                    Sign Up
                </Button>
            </Link>

            <Link href="/users/login" passHref>
                <Button variant="outlined" color="inherit" href="#" sx={{ my: 1, mx: 1.5 }}>
                    Login
                </Button>
            </Link>
        </>
    )
}

const App: NextPage<EnhancedAppProps & AppInitialProps, AppInitialProps> = ({
    Component,
    emotionCache = clientSideEmotionCache,
    apiEndpoint,
    liftEndpoint,
    pageProps,
}: EnhancedAppProps & AppInitialProps) => {
    const [isDrawerOpen, setDrawerOpen] = useState(false)
    const router = useRouter()

    return (
        <EndpointProvider apiEndpoint={apiEndpoint} liftEndpoint={liftEndpoint}>
            <QueryClientProvider client={queryClient}>
                <UserLocationProvider>
                    <AccessTokenProvider>
                        <CacheProvider value={emotionCache}>
                            <ThemeProvider theme={theme}>
                                <CssBaseline />

                                <AppBar position="static">
                                    <Toolbar variant="dense">
                                        <IconButton
                                            aria-label="menu"
                                            color="inherit"
                                            edge="start"
                                            onClick={() => setDrawerOpen(!isDrawerOpen)}
                                        >
                                            <MenuIcon rotate={isDrawerOpen ? 90 : 0} />
                                        </IconButton>

                                        <Typography variant="h6" color="inherit" sx={{ flexGrow: 1 }}>
                                            Journey Sharing
                                        </Typography>

                                        <UserBar />

                                        <Drawer
                                            ModalProps={{ onBackdropClick: () => setDrawerOpen(false) }}
                                            open={isDrawerOpen}
                                        >
                                            <ListItem
                                                button
                                                key="index"
                                                onClick={() => {
                                                    void router.push('/')
                                                }}
                                            >
                                                <ListItemIcon>
                                                    <HomeIcon />
                                                </ListItemIcon>
                                                <ListItemText primary="Start" />
                                            </ListItem>
                                            <Divider />
                                            <ListItem button key="settings">
                                                <ListItemIcon>
                                                    <SettingsIcon />
                                                </ListItemIcon>
                                                <ListItemText primary="Settings" />
                                            </ListItem>
                                        </Drawer>
                                    </Toolbar>
                                </AppBar>

                                <Container>
                                    <Component {...pageProps} />
                                </Container>
                            </ThemeProvider>
                        </CacheProvider>
                    </AccessTokenProvider>
                </UserLocationProvider>
            </QueryClientProvider>
        </EndpointProvider>
    )
}

App.getInitialProps = () => {
    return { apiEndpoint: process.env.API_URL, liftEndpoint: process.env.IONPROPELLER_URL }
}

export default App
