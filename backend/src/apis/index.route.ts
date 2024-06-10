import { Router } from 'express'
import { indexController } from './index.controller'

const basePath = '/apis'

const router = Router()

router.route('/')
  .get(indexController)

export const indexRoute = { basePath, router }