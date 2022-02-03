import { Options as CacheOptions } from 'node-cache'

export interface UserLocation {
    lat: number
    lng: number
}

export const defaultServerCacheOptions: CacheOptions = {
    stdTTL: 60 * 60 * 24,
}
