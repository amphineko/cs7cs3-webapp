import { NextApiHandler } from 'next'
import { validate as validateUuid } from 'uuid'
import { get } from '../../../../libs/server/details/cache'

const handler: NextApiHandler = (req, res) => {
    if (req.method !== 'GET') {
        res.status(405).json({
            code: 405,
            error: 'Method not allowed',
        })
        return
    }

    const url = new URL(req.url, 'http://localhost/')
    const id = url.searchParams.get('id')
    if (!validateUuid(id)) {
        res.status(400).json({
            code: 400,
            error: 'Missing or invalid id parameter',
        })
    }

    const result = get(id)

    const status = result ? 200 : 404
    res.status(status).json({
        code: status,
        data: result,
        error: result ? undefined : 'Not found',
    })
}

export default handler
