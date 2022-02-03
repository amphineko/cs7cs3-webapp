import { createContext, PropsWithChildren, useState } from 'react'

interface IAccessTokenContext {
    accessToken?: string
    setAccessToken: (accessToken: string) => void
}

const AccessTokenContext = createContext<IAccessTokenContext>({
    setAccessToken: () => {
        throw new Error('Not implemented')
    },
})

export const AccessTokenProvider = ({ children }: PropsWithChildren<unknown>) => {
    const [accessToken, setAccessToken] = useState<string>()

    return (
        <AccessTokenContext.Provider
            value={{
                accessToken,
                setAccessToken,
            }}
        >
            {children}
        </AccessTokenContext.Provider>
    )
}
