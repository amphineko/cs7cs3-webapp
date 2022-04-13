import CheckIcon from '@mui/icons-material/Check'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import LoadingButton from '@mui/lab/LoadingButton'
import { Alert } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { useLoginMutation } from '../../libs/client/queries/users/useLoginMutation'

const LoginPage: NextPage = () => {
    const { error, isLoading, isSuccess, mutate: submit } = useLoginMutation()
    const router = useRouter()

    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const isValid = useMemo(() => username.length > 0 && password.length > 0, [password, username])

    const handleSubmit = () => {
        if (isValid && !isLoading) {
            submit({ username, password })
        }
    }

    useEffect(() => {
        if (isSuccess) {
            router.push('/').catch(() => alert('Failed to redirect to /'))
        }
    }, [isSuccess, router])

    return (
        <>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign in
            </Typography>
            <Box sx={{ mt: 1 }}>
                {error && <Alert severity="error">{(error as Error)?.message}</Alert>}
                <TextField
                    autoComplete="username"
                    autoFocus
                    fullWidth
                    label="Username"
                    margin="normal"
                    onChange={({ currentTarget: { value } }) => setUsername(value)}
                    required
                    value={username}
                />
                <TextField
                    autoComplete="current-password"
                    fullWidth
                    label="Password"
                    margin="normal"
                    onChange={({ currentTarget: { value } }) => setPassword(value)}
                    required
                    type="password"
                    value={password}
                />
                <LoadingButton
                    disabled={!isValid}
                    fullWidth
                    loading={isLoading || isSuccess}
                    loadingIndicator={isSuccess ? <CheckIcon /> : undefined}
                    variant="contained"
                    onClick={handleSubmit}
                    sx={{ mt: 3, mb: 2 }}
                >
                    Sign In
                </LoadingButton>
                <Grid container>
                    <Grid item xs>
                        <Link href="#" variant="body2">
                            Forgot password?
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link href="#" variant="body2">
                            {"Don't have an account? Sign Up"}
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default LoginPage
