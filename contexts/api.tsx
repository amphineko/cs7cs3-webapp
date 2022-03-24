import { createContext, PropsWithChildren, useContext, useState } from 'react'

interface IEndpointContext {
    endpoint: string
    setEndpoint: (endpoint: string) => void
}

const EndpointContext = createContext<IEndpointContext>({
    endpoint: '',
    setEndpoint: () => {
        throw new Error('Not implemented')
    },
})

export const EndpointProvider = ({ children, endpoint: initialEndpoint }: PropsWithChildren<{ endpoint: string }>) => {
    const [endpoint, setEndpoint] = useState<string>(initialEndpoint)

    return (
        <EndpointContext.Provider
            value={{
                endpoint,
                setEndpoint,
            }}
        >
            {children}
        </EndpointContext.Provider>
    )
}

export const useEndpoint = () => useContext(EndpointContext)
