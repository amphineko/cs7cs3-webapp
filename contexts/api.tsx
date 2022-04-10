import { createContext, PropsWithChildren, useContext, useState } from 'react'

interface IEndpointContext {
    apiEndpoint: string
    liftEndpoint: string
    setApiEndpoint: (endpoint: string) => void
    setLiftEndpoint: (endpoint: string) => void
}

const EndpointContext = createContext<IEndpointContext>({
    apiEndpoint: '',
    liftEndpoint: '',
    setApiEndpoint: () => {
        throw new Error('Not implemented')
    },
    setLiftEndpoint: () => {
        throw new Error('Not implemented')
    },
})

export const EndpointProvider = ({
    apiEndpoint: initialApiEndpoint,
    children,
    liftEndpoint: initialLiftEndpoint,
}: PropsWithChildren<{ apiEndpoint: string; liftEndpoint: string }>) => {
    const [apiEndpoint, setApiEndpoint] = useState<string>(initialApiEndpoint)
    const [liftEndpoint, setLiftEndpoint] = useState<string>(initialLiftEndpoint)

    return (
        <EndpointContext.Provider
            value={{
                apiEndpoint,
                liftEndpoint,
                setApiEndpoint,
                setLiftEndpoint,
            }}
        >
            {children}
        </EndpointContext.Provider>
    )
}

export const useEndpoint = () => useContext(EndpointContext)
