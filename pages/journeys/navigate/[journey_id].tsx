import OptimizeMap, { routing_props } from '../../../components/display/OptimizeMap'
import { useUserLocation } from '../../../contexts/userLocation'

const Navigate = () => {
    const userLocation = useUserLocation()
    console.log(userLocation)

    return (
        <div>
            <h1>Navigate</h1>
            <OptimizeMap
                accessToken={process.env.MAPBOX_ACCESS_TOKEN}
                maxHeight="50vh"
                routing={'mapbox/driving' as unknown as routing_props}
            />
        </div>
    )
}

export default Navigate
