import { NextApiHandler } from 'next'
import { DestinationSearchEntry, DestinationSearchEntryType } from '../../../../libs/api/maps'
import { queryForward } from '../../../../libs/server/mapbox/serverSide'

const handler: NextApiHandler = async (req, res) => {
    if (req.method !== 'GET') {
        res.status(405).json({
            code: 405,
            error: 'Method not allowed',
        })
        return
    }

    const url = new URL(req.url, 'http://localhost/')
    if (!url.searchParams.has('query')) {
        res.status(400).json({
            code: 400,
            error: 'Missing query parameter',
        })
        return
    }
    const dest = url.searchParams.get('query')
    const lat = parseFloat(url.searchParams.get('lat'))
    const lng = parseFloat(url.searchParams.get('lng'))

    const resp = await queryForward({
        query: dest,
        proximity: Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : undefined,
    })

    res.json({
        code: 200,
        error: '',
        data: resp.features.map<DestinationSearchEntry>((feature) => ({
            address: feature.place_name,
            displayName: feature.text,
            position: { lat: feature.geometry.coordinates[1], lng: feature.geometry.coordinates[0] },
            relevance: feature.relevance,
            type: feature.place_type[0] as DestinationSearchEntryType,
        })),
    })
}

export default handler
