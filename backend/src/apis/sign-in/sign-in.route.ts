import { Router } from 'express'
import { signInController } from './sign-in.controller'

// declare a basePath for this router
const basePath = '/apis/sign-in'

// instantiate a new router object
const router = Router()

// define signup route for this router
router.route('/').post(signInController)

// export the router with the basePath and router object
export const signInRoute = { basePath, router }
