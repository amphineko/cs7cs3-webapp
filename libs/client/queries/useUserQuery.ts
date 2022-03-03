import { useQuery } from 'react-query'
import { IUserInfoMini } from '../../api/userinfo'

export const fetchDetail = async (id: string, base: string) => {
    const url = new URL('/api/v1/users/userprofile', base)
    url.searchParams.set('id', id)
    const req = await fetch(url.toString())
    if (req.ok) {
        const resp = (await req.json()) as unknown as {
            code: number
            data: IUserInfoMini
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

export const useUesrInfoQuery = (id?: string) => {
    return useQuery(['user_id', id], async () => {
        if (id === undefined) {
            return
        }
        return await fetchDetail(id, window.location.href)
    })
}
