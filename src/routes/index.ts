import express from 'express'

import {userRoutes} from './user.routes.ts'
import { messageRoutes } from './message.routes.js'

const routes = express()

routes.use('/user', userRoutes)
routes.use('/message', messageRoutes)

export {routes}