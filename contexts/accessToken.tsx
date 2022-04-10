import { createContext, PropsWithChildren, useContext, useState } from 'react'

type IAccessTokenContext = (
    | {
          accessToken: string
          id: string
      }
    | {
          accessToken: undefined
          id: undefined
      }
) & {
    clear: () => void
    update: (accessToken: string, id: string) => void
}

const AccessTokenContext = createContext<IAccessTokenContext>({
    accessToken: undefined,
    id: undefined,
    clear: () => {
        throw new Error('Method not implemented.')
    },
    update: () => {
        throw new Error('Method not implemented.')
    },
})

export const AccessTokenProvider = ({ children }: PropsWithChildren<unknown>) => {
    const [accessToken, setAccessToken] = useState<string>(
        typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : undefined
    )
    const [userId, setUserId] = useState<string>(
        typeof localStorage !== 'undefined' ? localStorage.getItem('userId') : undefined
    )

    return (
        <AccessTokenContext.Provider
            value={{
                accessToken: accessToken,
                id: userId,
                clear: () => {
                    setAccessToken(undefined)
                    setUserId(undefined)
                },
                update: (accessToken: string, id: string) => {
                    setAccessToken(accessToken)
                    setUserId(id)

                    localStorage.setItem('accessToken', accessToken)
                    localStorage.setItem('userId', id)
                },
            }}
        >
            {children}
        </AccessTokenContext.Provider>
    )
}

export const useAccessToken = () => useContext(AccessTokenContext)
