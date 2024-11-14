import { Router } from "express";
import messageController from "../controllers/messageController";

const messageRoutes = Router()

messageRoutes.post('/create', messageController.createMessage)
messageRoutes.get('/get_all', messageController.getAllMessagesBySenderId)

export {messageRoutes}