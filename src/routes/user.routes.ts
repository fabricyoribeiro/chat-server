import {Router} from 'express'
import userController from "../controllers/userController";
import autenticateToken from '../middleware/autenticateToken';


const userRoutes = Router()

userRoutes.post('/create', userController.createUser)
userRoutes.post('/login', userController.login)
userRoutes.get('/contact/list/:id', autenticateToken, userController.getContactsByUser)
userRoutes.post('/contact/set', autenticateToken, userController.setContactToUser)

export {userRoutes}