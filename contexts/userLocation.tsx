import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'

type UserLocationReadystate =
    | 'unavailable' // user agent does not support geolocation
    | 'waiting' // waiting for user approval, or location is on the way
    | 'ready'

interface IUserLocationContext {
    error?: GeolocationPositionError
    position?: GeolocationPosition
    readystate: UserLocationReadystate
    refresh: (enableHighAccuracy?: boolean) => void
}

const UserLocationContext = createContext<IUserLocationContext>({
    readystate: 'unavailable',
    refresh: () => {
        throw new Error('Not implemented')
    },
})

export const UserLocationProvider = ({ children }: PropsWithChildren<unknown>) => {
    const [error, setError] = useState<GeolocationPositionError>()
    const [position, setPosition] = useState<GeolocationPosition>()
    const [readystate, setReadystate] = useState<UserLocationReadystate>('waiting')

    const refresh = (enableHighAccuracy = false) => {
        if (readystate === 'unavailable') {
            return
        }

        if (!('geolocation' in navigator)) {
            console.error('User-agent Geolocation Error: ', 'Not supported or disabled by this browser.')
            setReadystate('unavailable')
            return
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('User-Agent Geolocation: Location acquired.')
                setError(undefined)
                setPosition(position)
                setReadystate('ready')
            },
            (error) => {
                console.error('User-Agent Geolocation Error: ', error.message)
                setError(error)
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setReadystate('unavailable')
                        break
                    default:
                        setReadystate('waiting')
                        break
                }
            },
            { enableHighAccuracy }
        )
    }

    useEffect(() => {
        refresh(false)
    })

    return (
        <UserLocationContext.Provider value={{ error, position, readystate, refresh }}>
            {children}
        </UserLocationContext.Provider>
    )
}

export const useUserLocation = () => useContext(UserLocationContext)
