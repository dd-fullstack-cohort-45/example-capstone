import { Router } from 'express'
import { signupProfileController } from './sign-up.controller'
import { activationController } from './activation.controller'

// declare a basePath for this router
const basePath = '/apis/sign-up'

// instantiate a new router object
const router = Router()

// define signup route for this router
router.route('/').post(signupProfileController)

// define activation route for this router
router.route('/activation/:activation').get(activationController)

// export the router with the basePath and router object
export const signUpRoute = { basePath, router }
