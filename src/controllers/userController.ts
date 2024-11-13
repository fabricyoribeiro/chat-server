import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export default {
  async createUser(req: Request, res: Response){

    try {
      
      const createUserBody = z.object({
        username: z.string(),
        password: z.string()
      })

      const { username, password } = createUserBody.parse(req.body)

      const userExists = await prisma.user.findUnique({ where: { username } })

      if(userExists){
        return res.status(409).json({error: "username already exists"})
      }

      console.log(username, password)

      const user = await prisma.user.create({
        data: {
          username,
          password,
        }
      })

      return res.status(200).json(user)


    } catch (error) {

      if(error instanceof z.ZodError){
        res.status(400).json({error: "Parametro invalido"})
      }else{
        console.log("erro ao criar user", error)
        res.json({error: "Error while creating user"})
      }
    
    }

  }
} 