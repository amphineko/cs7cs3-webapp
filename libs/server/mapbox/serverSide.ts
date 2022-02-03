import { MapiError } from '@mapbox/mapbox-sdk/lib/classes/mapi-error'
import { MapiResponse } from '@mapbox/mapbox-sdk/lib/classes/mapi-response'
import Geocoding, { GeocodeResponse } from '@mapbox/mapbox-sdk/services/geocoding'
import { UserLocation } from '.'

const defaultQueryLimit = 10

export const geocode = Geocoding({
    accessToken: process.env.MAPBOX_SERVER_TOKEN,
})

function isMapiError(e: unknown): e is MapiError {
    return Boolean((e as MapiError).statusCode && (e as MapiError).message)
}

export const queryForward = async ({
    query,
    proximity,
}: {
    query: string
    proximity: UserLocation
}): Promise<GeocodeResponse> => {
    let resp: MapiResponse
    try {
        resp = await geocode
            .forwardGeocode({
                autocomplete: true,
                limit: defaultQueryLimit,
                proximity: proximity ? [proximity.lng, proximity.lat] : undefined,
                query,
            })
            .send()
    } catch (err) {
        if (isMapiError(err)) {
            throw new Error(`Mapbox returned an error: ${err.message} (${err.statusCode})`)
        } else {
            throw err
        }
    }

    return resp.body as GeocodeResponse
}

export const queryReverse = async ({ location }: { location: UserLocation }): Promise<GeocodeResponse> => {
    let resp: MapiResponse
    try {
        resp = await geocode
            .reverseGeocode({
                query: [location.lng, location.lat],
            })
            .send()
    } catch (err) {
        if (isMapiError(err)) {
            throw new Error(`Mapbox returned an error: ${err.message} (${err.statusCode})`)
        } else {
            throw err
        }
    }

    return resp.body as GeocodeResponse
}
