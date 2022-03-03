import { faker } from '@faker-js/faker'
import { NextApiHandler } from 'next'

const handler: NextApiHandler = (req, res) => {
    if (req.method !== 'GET') {
        res.status(405).json({
            code: 405,
            error: 'Method not allowed',
        })
        return
    }

    const url = new URL(req.url, 'http://localhost/')
    if (!url.searchParams.has('id')) {
        res.status(400).json({
            code: 400,
            error: 'Missing query parameter',
        })
        return
    }

    const data = {
        id: faker.datatype.uuid(),
        avatarUrl: faker.internet.avatar(),
        username: faker.name.firstName(),
        gender: faker.name.gender(true),
        rating: 5 * Math.random(),
    }

    res.json({
        code: 200,
        error: '',
        data: data,
    })
}

export default handler
