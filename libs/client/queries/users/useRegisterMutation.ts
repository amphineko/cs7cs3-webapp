import { useMutation } from 'react-query'
import { useEndpoint } from '../../../../contexts/api'

type RegisterResult =
    | {
          success: false
          reason: string
      }
    | {
          success: true
          token: string
      }

export const useRegisterMutation = () => {
    const { apiEndpoint: endpoint } = useEndpoint()

    return useMutation(
        async ({ username, password }: { username: string; password: string }) => {
            const url = new URL('/register', endpoint)

            const req = await fetch(url.toString(), {
                body: JSON.stringify({ username, password, publicKey: '', privateKey: '', timestamp: Date.now() }),
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            })

            if (!req.ok) {
                throw new Error(`fetch() returned an error: ${req.statusText} (${req.status})`)
            }

            const result = (await req.json()) as RegisterResult
            if (result.success === true) {
                return {}
            } else {
                throw new Error(`Server rejected: ${result.reason}`)
            }
        },
        {
            mutationKey: 'register',
        }
    )
}
