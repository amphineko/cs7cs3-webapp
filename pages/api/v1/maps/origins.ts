import { NextApiHandler } from 'next'
import { DestinationSearchEntry, DestinationSearchEntryType } from '../../../../libs/api/maps'
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
    const lat = parseFloat(url.searchParams.get('lat'))
    const lng = parseFloat(url.searchParams.get('lng'))
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        res.status(400).json({
            code: 400,
            error: 'Missing query parameter',
        })
        return
    }

    const resp = await queryReverse({
        location: { lat, lng },
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
