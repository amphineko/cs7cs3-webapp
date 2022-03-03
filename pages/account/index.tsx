import { Box, TextField, FormControl, Button, Stack, Radio } from '@mui/material'
import Grid from '@mui/material/Grid'
import Link from 'next/link'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useUserMutation } from '../../libs/client/mutations/useUserMutation'

export default function Login() {
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const { data, mutate } = useUserMutation(username, password)

    const handleSubmit = async () => {
        if (data !== undefined) {
            await router.push('/')
        }
        if (data === undefined) {
            mutate()
            if (data !== undefined) {
                void router.push('/')
            }
        }
    }

    return (
        <Grid columns={1} container paddingTop={2}>
            <Grid item xs padding={2}>
                <FormControl fullWidth sx={{ m: 1, p: 1 }}>
                    <TextField
                        required
                        helperText="Please enter your username/email"
                        label="username/email"
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        required
                        helperText="Please enter your password"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </FormControl>
                <Box sx={{ width: '100%' }}>
                    <Stack direction="row" spacing={2} justifyContent="space-between">
                        <Box fontSize={10} padding={-1}>
                            <Radio size="small" />
                            Remember me
                        </Box>
                    </Stack>
                </Box>
                <Grid container paddingY={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        onClick={() => {
                            handleSubmit()
                        }}
                    >
                        Login
                    </Button>
                    <Button variant="text" size="medium" fullWidth href="account/register">
                        Sign Up
                    </Button>
                </Grid>

                <Box sx={{ width: '100%' }}>
                    <Stack direction="row" spacing={2} justifyContent="space-between">
                        <Box fontSize={10}>
                            <Link href="/account">Forget Password</Link>
                        </Box>
                        <Box fontSize={10}>
                            <Link href="/account">Privacy</Link>
                        </Box>
                    </Stack>
                </Box>
            </Grid>
        </Grid>
    )
}
