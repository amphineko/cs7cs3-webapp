import { useMutation } from 'react-query'
import { useAccessToken } from '../../../../contexts/accessToken'
import { useEndpoint } from '../../../../contexts/api'
import { IUserProfile } from './useProfileQuery'

export type IUserProfileMutation = Pick<IUserProfile, 'bio' | 'gender' | 'id' | 'username'>

type IUserProfileMutationResult =
    | {
          success: false
          reason: string
      }
    | {
          success: true
      }

export const useProfileMutation = (id: string) => {
    const { apiEndpoint: endpoint } = useEndpoint()
    const { accessToken } = useAccessToken()

    return useMutation(
        async ({ username, bio, gender }: Partial<IUserProfileMutation>) => {
            const url = new URL('/user-info/update', endpoint)

            const req = await fetch(url.toString(), {
                body: JSON.stringify({ token: accessToken, payload: { id, username, bio, gender } } as {
                    token: string
                    payload: IUserProfileMutation
                }), // TODO: remove this typo from the server
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            })

            if (!req.ok) {
                throw new Error(`fetch() returned an error: ${req.statusText} (${req.status})`)
            }

            const result = (await req.json()) as IUserProfileMutationResult
            if (result.success === true) {
                return {}
            } else {
                throw new Error(`Server rejected: ${result.reason}`)
            }
        },
        {
            mutationKey: ['profile', id],
        }
    )
}
