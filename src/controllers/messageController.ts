import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import {z} from 'zod'

export default {
  async createMessage(req: Request, res: Response) {

    try {
      //verificação dos tipos de dados
      const createMessageBody = z.object({
        sender_id: z.string(),
        receiver_id: z.string(),
        content: z.string()
      })

      const { sender_id, receiver_id, content } = createMessageBody.parse(req.body)

      const senderExists = await prisma.user.findUnique({
        where: { id: sender_id }
      })
      const receiverExists = await prisma.user.findUnique({
        where: { id: receiver_id }
      })

      if(!senderExists || !receiverExists){
        return res.status(404).json({error: 'User does not exists'})
      }

      const message = await prisma.message.create({
        data: {
          sender_id,
          receiver_id,
          content,
        }
      })

      res.status(200).json(message)

    } catch (error) {

      if(error instanceof z.ZodError){
        console.log("Erro nos parâmetros do createMessage", error)
        return res.status(400).json({error: 'Erro nos parâmetros do createMessage'})
      }else{
        console.log("error while creating message", error)
        return res.json({ message: error.message })
      }

    }
  }
}