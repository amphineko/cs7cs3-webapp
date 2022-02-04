import NodeCache from 'node-cache'
import { IJourneyGroup } from '../../api/groups'

const defaultCache = new NodeCache({
    stdTTL: 60 * 60 * 24,
})

export const get = (key: string): IJourneyGroup | undefined => {
    return defaultCache.get(key)
}

export const put = (key: string, value: IJourneyGroup, ttl?: number) => {
    defaultCache.set(key, value, ttl)
}
