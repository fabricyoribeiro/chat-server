import {Router} from 'express'
import userController from "../controllers/userController";


const userRoutes = Router()

userRoutes.post('/create', userController.createUser)

export {userRoutes}