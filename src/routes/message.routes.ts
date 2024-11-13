import { Router } from "express";
import messageController from "../controllers/messageController";

const messageRoutes = Router()

messageRoutes.post('/create', messageController.createMessage)

export {messageRoutes}