import { LatLngLike } from '../server/mapbox'

export type DestinationSearchEntryType =
    | 'country'
    | 'region'
    | 'postcode'
    | 'district'
    | 'place'
    | 'locality'
    | 'neighborhood'
    | 'address'
    | 'poi'

export interface DestinationSearchEntry {
    address?: string
    displayName: string
    position: LatLngLike
    relevance: number
    type: DestinationSearchEntryType
}
