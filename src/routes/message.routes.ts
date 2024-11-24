import { Router } from "express";
import messageController from "../controllers/messageController";
import autenticateToken from "../middleware/autenticateToken";

const messageRoutes = Router()

messageRoutes.post('/create', messageController.createMessage)
messageRoutes.get('/get_all', autenticateToken , messageController.getAllMessagesBySenderId)

export {messageRoutes}