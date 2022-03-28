import { NextApiHandler } from 'next'

const userinfo = [
    {
        username: 'boshi2pan@gmail.com',
        password: '1234567',
    },
]

const handler: NextApiHandler = (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).json({
            code: 405,
            error: 'Method not allowed',
        })
        return
    }

    const name = req.body.username
    //const password = req.body.password

    if (name != userinfo[1].username) {
        res.status(404).json({
            code: 404,
            error: "Account doesn't exist",
        })
        return
    }

    if (password != userinfo[0].password) {
        res.status(401).json({
            code: 401,
            error: "Password doesn't match",
        })
        return
    }

    res.status(201).json({
        code: 201,
        error: '',
    })
}

export default handler
