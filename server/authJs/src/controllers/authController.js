import argon from 'argon2'
import jwt from 'jsonwebtoken'
import User from '../models/usersModel'
import fs from 'fs'
import { sendError, sendSuccess, throwError, throwIf } from '../utils/errorHandling'
const privateKEY = fs.readFileSync(__dirname + '/../../keys/jwtRS512.key', 'utf8')
const publicKey = fs.readFileSync(__dirname + '/../../keys/jwtRS512.key.pub', 'utf8')

export const checkToken = async (req, res, next) => {

    const token = parseHeaders(req)
    if (token !== null) throwError(401, 'Invalid request', 'No auth token supplied')
    console.log(token)
    await jwt.verify(token, publicKey), function (err, decoded) {
        if (err) {
            console.log("error")

            res.json({ status: "error", message: err.message, data: null });
        } else {
            // add user id to request
            console.log("here")
            req.auth = true
            next()
        }
        console.log('axc')
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

let signOptions = {
    issuer: 'authService',
    subject: '',
    audience: 'moviesWebsite',
    expiresIn: '24h',
    algorithm: 'RS512',
}

export const makePayload = (userId) => {
    return { id: userId }
}

export const signUp = async (req, res) => {
    try {
        if (!req.body.username && !req.body.email && !req.body.password) throwError(400, 'Incorrect Request', 'Username or Email or password is missing')()
        const { username, email, password } = req.body

        await User
            .findOne({ email: email })
            .then(
                throwIf(r => r, 409, 'Incorrect data', 'Email already in use!'),
                throwError(500, 'Mongodb error')
            )
        const hashedPass = await argon
            .hash(password)
            .then(
                throwIf(r => !r, 500, 'Argon error'),
                throwError(500, 'Mongodb error')
            )

        const user = await User
            .create({ username: username, email: email, password: hashedPass })
            .then(
                throwIf(r => !r, 500, 'Mongo error', 'User not created'),
                throwError(500, 'Mongo error'))

        signOptions = { ...signOptions, subject: email }

        const token = jwt.sign(makePayload(user._id), privateKEY, signOptions)
        if (!token) throwError(500, 'Jwt sign error', 'Something went wrong with signing the jwt')
        sendSuccess(res, 'User Created!')({ token })
    } catch (err) {
        sendError(res)(err)
    }
}

export const logIn = async (req, res) => {
    try {
        if (!req.body.email && !req.body.password) throwError(400, 'Incorrect request', 'Email or password is missing')

        const { email = '', password = '' } = req.body

        const user = await User
            .findOne({ email: email })
            .then(
                throwIf(r => !r, 403, 'Not found', 'Email not found'),
                throwError(500, 'Mongo error')
            )

        await argon
            .verify(user.password, password)
            .then(
                throwIf(r => !r, 403, 'Incorrect', 'Password is incorrect'),
                throwError(500, 'Argon error')
            )
        const token = await jwt.sign(makePayload(user._id), privateKEY, signOptions)
        if (!token) throwError(500, 'Jwt sign error', 'Something went wrong with signing the jwt')

        sendSuccess(res, 'Authentication successful')({ token })

    } catch (err) {
        sendError(res)(err)
    }
}