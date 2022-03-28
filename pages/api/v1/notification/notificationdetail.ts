import { faker } from '@faker-js/faker'
import { NextApiHandler } from 'next'
import { INotification } from '../../../../libs/api/notification'

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

    const data = Array.from({ length: Math.random() * 10 }).map<INotification>(() => {
        return {
            id: faker.datatype.uuid().toString(),
            title: 'New Message',
            content: faker.lorem.sentence.toString(),
            time: faker.date.past(),
        }
    })

    res.status(200).json({
        code: 200,
        error: '',
        data: data,
    })
}

export default handler
