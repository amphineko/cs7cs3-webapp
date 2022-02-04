import NodeCache from 'node-cache'
import { IJourneyGroup } from '../../api/groups'
import Redis from 'ioredis'

const redis = process.env.CACHE_REDIS_URL && new Redis(process.env.CACHE_REDIS_URL)

const nodeCache = new NodeCache({
    stdTTL: 60 * 60 * 24,
})

console.info(redis ? 'Using Redis for cache' : 'Using NodeCache for cache')

export const get = async (key: string): Promise<IJourneyGroup | undefined> => {
    if (redis !== undefined) {
        return JSON.parse((await redis.get(key)) ?? undefined) as IJourneyGroup | undefined
    } else {
        return nodeCache.get(key)
    }
}

export const put = async (key: string, value: IJourneyGroup, ttl?: number): Promise<void> => {
    if (redis !== undefined) {
        ttl ? await redis.setex(key, ttl, JSON.stringify(value)) : await redis.set(key, JSON.stringify(value))
    } else {
        nodeCache.set(key, value, ttl)
    }
}
