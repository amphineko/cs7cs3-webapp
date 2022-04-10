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
    const [accessToken, setAccessToken] = useState<string>()
    const [id, setId] = useState<string>()

    return (
        <AccessTokenContext.Provider
            value={{
                accessToken,
                id,
                clear: () => {
                    setAccessToken(undefined)
                    setId(undefined)
                },
                update: (accessToken: string, id: string) => {
                    setAccessToken(accessToken)
                    setId(id)
                },
            }}
        >
            {children}
        </AccessTokenContext.Provider>
    )
}

export const useAccessToken = () => useContext(AccessTokenContext)
