import { useMutation } from 'react-query'

export const useUserMutation = (username: string, password: string) => {
    return useMutation(async () => {
        if (username === undefined) {
            return
        }

        const url = new URL('http://localhost:3000/users/login')
        const req = await fetch(url.toString(), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        })
        if (req.ok) {
            const resp = (await req.json()) as unknown as {
                msg: string
                auth: string | undefined
            }

            if (resp.msg !== 'success') {
                throw new Error(`Request returned an error`)
            }
            return resp.auth
        } else {
            throw new Error(`fecth() return an error: ${req.statusText} (${req.status})`)
        }
    })
}
