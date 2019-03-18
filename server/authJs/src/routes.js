import { signUp, logIn, checkToken } from './controllers/authController'
import asyncMiddleware from './utils/asyncMiddleware'


const routes = (app) => {
    app.route('/signup').post(asyncMiddleware(signUp))
    app.route('/login').post(asyncMiddleware(logIn))
    app.route('/check').get(checkToken)


}


export default routes