import createEmotionCache, { EmotionCache } from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import HomeIcon from '@mui/icons-material/Home'
import MenuIcon from '@mui/icons-material/Menu'
import SettingsIcon from '@mui/icons-material/Settings'
import {
    AppBar,
    Container,
    createTheme,
    CssBaseline,
    Divider,
    Drawer,
    IconButton,
    ListItem,
    ListItemIcon,
    ListItemText,
    ThemeProvider,
    Toolbar,
    Typography,
} from '@mui/material'
import { AppProps } from 'next/app'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AccessTokenProvider } from '../contexts/accessToken'
import { UserLocationProvider } from '../contexts/userLocation'

const theme = createTheme({})

const clientSideEmotionCache = createEmotionCache({ key: 'css', prepend: true })
const queryClient = new QueryClient()

interface EnhancedAppProps extends AppProps {
    emotionCache?: EmotionCache
}

const App = ({ Component, emotionCache = clientSideEmotionCache, pageProps }: EnhancedAppProps) => {
    const [isDrawerOpen, setDrawerOpen] = useState(false)

    return (
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

                                    <Typography variant="h6" color="inherit">
                                        Journey Sharing
                                    </Typography>

                                    <Drawer
                                        ModalProps={{ onBackdropClick: () => setDrawerOpen(false) }}
                                        open={isDrawerOpen}
                                    >
                                        <ListItem button key="index">
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
    )
}

export default App
