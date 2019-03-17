import jwt from 'jsonwebtoken'
import fs from 'fs'
import {throwError, throwIf, sendError} from './errorHandling'
const publicKey = fs.readFileSync(__dirname + '/../../keys/jwtRS512.key.pub', 'utf8')

export const checkToken = async (req, res, next) => {
    try {
        const token = parseHeaders(req)
        if(token !== null) throwError(401, 'Invalid request', 'No auth token supplied')
        console.log(token)
        await jwt
            .verify(token, publicKey)
            .then(
                throwIf(r => !r, 401, 'Forbidden', 'Auth token is invalid'),
                throwError(500, 'JWT ERROR')
            )
            
        req.auth = true
        next()
    } catch (err) {
        console.error(err)
        sendError(res)(err)
    }
}

const parseHeaders = (req) => {
    let token = req.headers['authorization'] || null
    if (token !== null) {
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length)
        }
    }
    return token
}

export default checkToken