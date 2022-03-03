import { useMutation } from 'react-query'
import { IUserInfoMini } from '../../api/userinfo'

const updateUserInfo = async (userInfo: IUserInfoMini) => {
    const url = new URL('/api/v1/users/userprofile')
    const req = await fetch(url.toString(), {
        method: 'POST',
        body: JSON.stringify({
            ...userInfo,
        }),
    })

    if (req.ok) {
        const resp = (await req.json()) as unknown as {
            code: number
            error: ''
            data: IUserInfoMini
        }
        return resp.data
    }
}

const useInfoMutation = (id: string) => {
    return useMutation(['upateUserInfo', id], async (form: IUserInfoMini) => {
        return await updateUserInfo(form)
    })
}

export default useInfoMutation
