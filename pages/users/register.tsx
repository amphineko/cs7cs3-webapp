import { PersonAddAlt } from '@mui/icons-material'
import CheckIcon from '@mui/icons-material/Check'
import LoadingButton from '@mui/lab/LoadingButton'
import { Alert, Box, TextField } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { useAccessToken } from '../../contexts/accessToken'
import { useRegisterMutation } from '../../libs/client/queries/users/useRegisterMutation'

const RegisterPage: NextPage = () => {
    const { error, isLoading, isSuccess, mutate: submit } = useRegisterMutation()
    const { clear: clearAccessToken } = useAccessToken()
    const router = useRouter()

    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')

    const isPasswordValid = useMemo(() => password.length >= 8, [password])
    const isConfirmPasswordValid = useMemo(() => password === confirmPassword, [password, confirmPassword])
    const isValid = useMemo(
        () => username.length > 0 && isPasswordValid && isConfirmPasswordValid,
        [isConfirmPasswordValid, isPasswordValid, username.length]
    )

    const handleSubmit = () => {
        if (isValid && !isLoading) {
            submit({ username, password })
        }
    }

    useEffect(() => {
        if (isSuccess) {
            router.push('/users/login').catch(() => alert('Failed to redirect to /'))
        } else {
            clearAccessToken()
        }
    })

    return (
        <>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <PersonAddAlt />
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
                    autoComplete="password"
                    error={!isPasswordValid}
                    fullWidth
                    label="Password"
                    margin="normal"
                    onChange={({ currentTarget: { value } }) => setPassword(value)}
                    required
                    type="password"
                    value={password}
                />
                <TextField
                    error={!isConfirmPasswordValid}
                    fullWidth
                    label="Confirm Password"
                    margin="normal"
                    onChange={({ currentTarget: { value } }) => setConfirmPassword(value)}
                    required
                    type="password"
                    value={confirmPassword}
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
                    Sign Up
                </LoadingButton>
            </Box>
        </>
    )
}

export default RegisterPage
