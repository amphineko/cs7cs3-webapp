import { Grid, TextField, Box, Button, MenuItem } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useUesrInfoQuery } from '../../../libs/client/queries/useUserQuery'
import { GenderType } from '../../../libs/api/userinfo'
import useUserInfoMutation from '../../../libs/client/mutations/useUserInfoMutation'

const Female: GenderType = 'Female'
const Male: GenderType = 'Male'

const Gender = [
    { value: Female, label: 'Female' },
    {
        value: Male,
        label: 'Male',
    },
]

const UpdateUserInfo = () => {
    const router = useRouter()
    const id = router.query.id as string
    const { data, remove } = useUesrInfoQuery(id)
    const { mutate } = useUserInfoMutation(id)

    const [username, setUsername] = useState<string>('')
    const [gender, setGender] = useState<GenderType>('Female')

    useEffect(() => {
        if (data !== undefined) {
            setUsername(data.username)
            setGender(data.gender)
        }
    }, [data])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let result: GenderType = 'Male'
        if (event.target.value === 'Female') {
            result = 'Female'
        }
        setGender(result)
    }

    const handleOnClick = () => {
        console.log('hello')
        console.log(username)
        console.log(gender)
        mutate({ ...data, username, gender }, { onSettled: () => remove() })
    }
    return (
        <Grid container alignItems="center">
            <Grid container xs={13} direction="column" alignItems="center">
                <Grid container alignItems="center" direction="row" paddingTop={2}>
                    <TextField
                        required
                        label="username"
                        defaultValue={username}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Grid>
                <Grid container alignItems="center" paddingTop={2}>
                    <TextField
                        required
                        label="gneder"
                        defaultValue={gender}
                        value={gender}
                        onChange={handleChange}
                        select
                        variant="filled"
                    >
                        {Gender.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Box display="flex" justifyContent="center" alignItems="center" paddingTop={2}>
                    <Button variant="contained" onClick={() => handleOnClick()}>
                        Submit
                    </Button>
                </Box>
            </Grid>
        </Grid>
    )
}

export default UpdateUserInfo
