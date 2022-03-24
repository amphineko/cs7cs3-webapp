import { faker } from '@faker-js/faker'
import { NextApiHandler } from 'next'
import { IJourneyGroup, IJourneyParticipant } from '../../../../libs/api/groups'
import { DestinationSearchEntryType } from '../../../../libs/api/maps'
import { put as putCache } from '../../../../libs/server/details/cache'
import { queryReverse } from '../../../../libs/server/mapbox/serverSide'

const handler: NextApiHandler = async (req, res) => {
    if (req.method !== 'GET') {
        res.status(405).json({
            code: 405,
            error: 'Method not allowed',
        })
        return
    }

    const url = new URL(req.url, 'http://localhost/')

    const destLat = parseFloat(url.searchParams.get('dest_lat'))
    const destLng = parseFloat(url.searchParams.get('dest_lng'))
    const originLat = parseFloat(url.searchParams.get('origin_lat'))
    const originLng = parseFloat(url.searchParams.get('origin_lng'))

    if (!Number.isFinite(destLat) || !Number.isFinite(destLng)) {
        res.status(400).json({
            code: 400,
            error: 'Missing destination locations (lat, lng)',
        })
        return
    }

    if (!Number.isFinite(originLat) || !Number.isFinite(originLng)) {
        res.status(400).json({
            code: 400,
            error: 'Missing origin locations (lat, lng)',
        })
        return
    }

    const destinations = await queryReverse({ location: { lat: destLat, lng: destLng } })
    const origins = await queryReverse({ location: { lat: originLat, lng: originLng } })

    const data = Array.from({
        length: Math.min(destinations.features.length, origins.features.length),
    }).map<IJourneyGroup>(() => {
        const origin = origins.features[Math.floor(Math.random() * origins.features.length)]
        const destination = destinations.features[Math.floor(Math.random() * destinations.features.length)]

        return {
            id: faker.datatype.uuid(),
            type: faker.random.arrayElement(['walk', 'bus', 'taxi']),

            host: {
                avatarUrl: faker.internet.avatar(),
                id: faker.datatype.uuid(),
                screenName: `${faker.name.firstName()} ${faker.name.lastName()}`,
            },

            guests: Array.from({ length: Math.floor(Math.random() * 5) }).map<IJourneyParticipant>(() => ({
                avatarUrl: faker.internet.avatar(),
                id: faker.datatype.uuid(),
                screenName: `${faker.name.firstName()} ${faker.name.lastName()}`,
            })),

            origin: {
                address: origin.place_name,
                displayName: origin.text,
                position: { lat: origin.geometry.coordinates[1], lng: origin.geometry.coordinates[0] },
                relevance: origin.relevance,
                type: origin.place_type[0] as DestinationSearchEntryType,
            },

            destination: {
                address: destination.place_name,
                displayName: destination.text,
                position: { lat: origin.geometry.coordinates[1], lng: origin.geometry.coordinates[0] },
                relevance: destination.relevance,
                type: destination.place_type[0] as DestinationSearchEntryType,
            },
        }
    })

    await Promise.all(data.map((group) => putCache(group.id, group)))

    res.status(200).json({
        code: 200,
        error: '',
        data,
    })
}

export default handler
