import { Grid } from '@mui/material'
import { NotificaitonList } from '../../components/display/NotficationListItem'
import { useNotificationQuery } from '../../libs/client/queries/useNotificationQuery'

const NotificationPage = () => {
    const { data } = useNotificationQuery('1')

    return (
        <>
            <h1>Notification</h1>
            <Grid item>
                <NotificaitonList />
            </Grid>
        </>
    )
}

export default NotificationPage
