import { useQuery } from 'react-query'
import { INotification } from '../../api/notification'

export const fetchNotifications = async (id: string, base: string) => {
    const url = new URL('/api/v1/notification/notificationdetails', base)
    url.searchParams.set('id', id)
    const req = await fetch(url.toString())
    console.log(req)
    if (req.ok) {
        const resp = (await req.json()) as unknown as {
            code: number
            data: INotification[]
            error: string
        }

        if (resp.code !== 200 && resp.data !== undefined) {
            throw new Error(`Request returned an error: ${resp.error} (${resp.code})`)
        }

        console.log(resp.data)
        return resp.data
    } else {
        throw new Error(`fetch() returned an error: ${req.statusText} (${req.status})`)
    }
}

export const useNotificationQuery = (id?: string) => {
    return useQuery(['notification_user_id', id], async () => {
        if (id === undefined) {
            return
        }
        return await fetchNotifications(id, window.location.href)
    })
}
