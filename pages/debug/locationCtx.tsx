import { useUserLocation } from '../../contexts/userLocation'

const LocationContextDebugPage = () => {
    const { error, position, readystate, refresh } = useUserLocation()

    return (
        <div>
            <h1>LocationContextDebugPage</h1>
            <dl>
                <dt>Error</dt>
                <dd>{error ? `${error.message} (${error.code})` : 'No error'}</dd>

                <dt>Position.timestamp</dt>
                <dd>{position ? position.timestamp : 'No position'}</dd>

                <dt>Position.coords.latitude</dt>
                <dd>{position ? position.coords.latitude : 'No position'}</dd>

                <dt>Position.coords.longitude</dt>
                <dd>{position ? position.coords.longitude : 'No position'}</dd>

                <dt>Position.coords.accuracy</dt>
                <dd>{position ? position.coords.accuracy : 'No position'}</dd>

                <dt>Readystate</dt>
                <dd>{readystate}</dd>
            </dl>

            <button onClick={() => refresh(true)}>Refresh (high accuracy)</button>
            <button onClick={() => refresh()}>Refresh (low accuracy)</button>
        </div>
    )
}

export default LocationContextDebugPage
