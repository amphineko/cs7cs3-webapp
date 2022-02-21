import { TextField, Grid, FormControl, MenuItem, Button, Box } from '@mui/material'
import { useRouter } from 'next/router'
export default function Register() {
    const genders = [
        {
            value: 'Female',
        },
        {
            value: 'Male',
        },
        {
            value: 'Intersex',
        },
        {
            value: 'Trans',
        },
    ]
    const route = useRouter()
    function holdClickFunction() {
        return route.push('/account')
    }

    return (
        <Grid columns={1} container paddingTop={2}>
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
                <TextField
                    required
                    helperText="Please enter your password again"
                    label="Comfirm Password"
                    type="password"
                    autoComplete="current-password"
                    margin="normal"
                />
                <TextField required select helperText="Please select gender" margin="normal">
                    {genders.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.value}
                        </MenuItem>
                    ))}
                </TextField>
            </FormControl>
            <Grid padding={2}>
                <Box>
                    <Button color="primary" variant="contained" onClick={() => holdClickFunction()}>
                        Register
                    </Button>
                </Box>
            </Grid>
        </Grid>
    )
}
