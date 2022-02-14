import { Box, Divider, Checkbox, TextField, FormControl, Button, Stack } from '@mui/material'
import Grid from '@mui/material/Grid'
import Link from 'next/link'

export default function Login() {
    return (
        <Grid columns={1} container paddingTop={2}>
            <Box
                sx={{ boxShadow: 3, borderRadius: 2, width: '100%', height: '90%' }}
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <Grid container xs>
                    <Box
                        sx={{
                            width: '100%',
                            height: 500,
                            backgroundColor: 'primary.dark',
                            borderRadius: 2,
                        }}
                    ></Box>
                </Grid>
                <Divider orientation="vertical" flexItem></Divider>
                <Grid container xs padding={2}>
                    <FormControl fullWidth sx={{ m: 1, p: 1 }}>
                        <TextField
                            required
                            helperText="Please enter your username/email"
                            label="username/email"
                            margin="normal"
                        />
                        <TextField
                            required
                            helperText="Please enter your password"
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            margin="normal"
                        />
                    </FormControl>
                    <Box sx={{ width: '100%' }}>
                        <Stack direction="row" spacing={2} justifyContent="space-between">
                            <Box fontSize={10} padding={-1}>
                                <Checkbox size="small" />
                                Remember me
                            </Box>
                            <Box fontSize={10} margin={2}>
                                <Checkbox size="small" />
                                <Link href="/account">Forget Password</Link>
                            </Box>
                        </Stack>
                    </Box>
                    <Grid container paddingY={2}>
                        <Button variant="contained" color="primary" size="large" fullWidth>
                            Login
                        </Button>
                        <Button variant="text" size="medium" fullWidth href="account/register">
                            Sign Up
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Grid>
    )
}
