import { useQuery } from 'react-query'
import { useAccessToken } from '../../../../contexts/accessToken'
import { useEndpoint } from '../../../../contexts/api'

export interface IUserProfile {
    id: string
    username: string

    avatar: string
    bio: string
    gender: 'male' | 'female' | 'other'

    rating: number
    counter: number

    reviews: string[]
    histories: string[]
}

export const useProfileQuery = (id?: string) => {
    const { apiEndpoint: endpoint } = useEndpoint()
    const { accessToken } = useAccessToken()

    return useQuery(['user-info/profile/self', id, accessToken], async () => {
        if (!accessToken || !id) {
            return undefined
        }

        const url = new URL('/user-info/get-profile', endpoint)

        const req = await fetch(url.toString(), {
            body: JSON.stringify({
                payload: {
                    userId: id,
                },
                timestamp: Date.now(),
                token: accessToken,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        })

        if (!req.ok) {
            throw new Error(`fetch() returned an error: ${req.statusText} (${req.status})`)
        }

        const result = (await req.json()) as
            | {
                  success: false
                  reason: string
              }
            | {
                  success: true
                  payload: {
                      userInfo: IUserProfile
                  }
              }

        if (result.success === true) {
            return result.payload.userInfo
        } else {
            throw new Error(`Server failed: ${result.reason}`)
        }
    })
}
