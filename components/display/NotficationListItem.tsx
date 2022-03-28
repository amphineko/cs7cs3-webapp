import { Button, Card, CardActions, CardContent, Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { INotification } from '../../libs/api/notification'

export const NotificationItem = ({ notification }: { notification: INotification }) => {
    const id = notification.id
    const router = useRouter()
    const handleOnClick = () => {
        void router.push(`/notificaiton/details/${id}`)
    }
    return (
        <>
            <Card>
                <CardContent>
                    <Typography>{notification.content}</Typography>
                    <Typography>{notification.time}</Typography>
                </CardContent>
                <CardActions>
                    <Button onClick={() => handleOnClick()}>details</Button>
                </CardActions>
            </Card>
        </>
    )
}

export const NotificaitonList = () => {
    const notifications = [
        {
            id: 'xxx',
            title: 'ccc',
            content: 'xccsae a fjawn afwjwoif anfwf',
            time: new Date(),
        },
    ]
    return (
        <Grid container spacing={2}>
            {notifications.map((notification) => (
                <Grid item key={notification.id} xs={12} sm={6}>
                    <NotificationItem notification={notification} />
                </Grid>
            ))}
        </Grid>
    )
}
