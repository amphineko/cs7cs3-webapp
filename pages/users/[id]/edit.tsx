import { LoadingButton } from '@mui/lab'
import { Alert, Grid, MenuItem, Select, TextField } from '@mui/material'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { useProfileMutation } from '../../../libs/client/queries/users/useProfileMutation'
import { IUserProfile, useProfileQuery } from '../../../libs/client/queries/users/useProfileQuery'

const UserProfileForm = ({ profile: { bio, gender, id, username } }: { profile: IUserProfile }) => {
    const {
        control,
        formState: { dirtyFields, isDirty },
        handleSubmit,
    } = useForm<{ username: string; bio: string; gender: IUserProfile['gender'] }>({
        defaultValues: {
            bio,
            gender,
            username,
        },
    })

    const { error, mutate } = useProfileMutation(id)

    const { push } = useRouter()

    const onSubmit = handleSubmit((form) => {
        const dirtyForm = Object.fromEntries(Object.entries(form).filter(([key]) => dirtyFields[key] === true))
        console.log(dirtyForm)
        mutate(dirtyForm, {
            onSuccess: () => {
                push(`/users/${id}`).catch((err) => console.error(err))
            },
        })
    })

    return (
        <>
            <form
                onSubmit={(ev) => {
                    void onSubmit(ev)
                }}
            >
                <Grid container spacing={2} marginY={4}>
                    {error && (
                        <Grid item sx={{ width: '100%' }}>
                            <Alert severity="error">{String(error)}</Alert>
                        </Grid>
                    )}

                    <Grid item sx={{ width: '100%' }}>
                        <Controller
                            control={control}
                            name="username"
                            render={({ field }) => <TextField fullWidth label="Username" {...field} />}
                        />
                    </Grid>

                    <Grid item sx={{ width: '100%' }}>
                        <Controller
                            control={control}
                            name="bio"
                            render={({ field }) => (
                                <TextField fullWidth label="Bio" maxRows={2} minRows={2} {...field} />
                            )}
                        />
                    </Grid>

                    <Grid item sx={{ width: '100%' }}>
                        <Controller
                            control={control}
                            name="gender"
                            render={({ field }) => (
                                <Select fullWidth label="Gender" {...field}>
                                    <MenuItem value="female">Female</MenuItem>
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="other">Other</MenuItem>
                                </Select>
                            )}
                        />
                    </Grid>

                    <Grid item sx={{ width: '100%' }}>
                        <LoadingButton type="submit" variant="contained" color="primary" disabled={!isDirty} fullWidth>
                            Save
                        </LoadingButton>
                    </Grid>
                </Grid>
            </form>
        </>
    )
}

const UserProfileEditPage: NextPage = () => {
    const router = useRouter()
    const { data: profile, error, isLoading } = useProfileQuery(String(router.query.id))

    return (
        <>
            {profile ? (
                <UserProfileForm profile={profile} />
            ) : (
                <Grid container direction="column" alignItems="center" paddingY={4}>
                    <Grid item>
                        {error && <Alert severity="error">{String(error)}</Alert>}
                        {isLoading && (
                            <LoadingButton loading variant="outlined">
                                Loading
                            </LoadingButton>
                        )}
                    </Grid>
                </Grid>
            )}
        </>
    )
}

export default UserProfileEditPage
