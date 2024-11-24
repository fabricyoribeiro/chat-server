import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { checkUsersExist } from "./messageController";

const SECRET_KEY = process.env.JWT_SECRET; 

export default {

  async login(req: Request, res: Response) {
    try {
      const loginBody = z.object({
        username: z.string(),
        password: z.string()
      })

      const { username, password } = loginBody.parse(req.body)

      const user = await prisma.user.findUnique({ where: { username } })

      if (!user) {
        return res.status(404).json({ error: "User does not exists" })
      }

      const passwordMatch = await bcrypt.compare(password, user.password)

      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' })

      return res.status(200).json({ token, message: "Login successful" });

    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Parametro invalido" })
      } else {
        console.log("erro ao fazer login", error)
        res.json({ error: "Error while login" })
      }
    }
  },

  async createUser(req: Request, res: Response) {

    try {

      const createUserBody = z.object({
        username: z.string(),
        password: z.string()
      })

      const { username, password } = createUserBody.parse(req.body)

      const userExists = await prisma.user.findUnique({ where: { username } })

      if (userExists) {
        return res.status(409).json({ error: "username already exists" })
      }

      console.log(username, password)

      const hashedPassword = await hashPassword(password)

      const user = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
        }
      })

      return res.status(200).json(user)


    } catch (error) {

      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Parametro invalido" })
      } else {
        console.log("erro ao criar user", error)
        res.json({ error: "Error while creating user" })
      }

    }

  },

  async getContactsByUser(req: Request, res: Response) {
    try {
      const getContactsBody = z.object({
        id: z.string()
      })

      const { id } = getContactsBody.parse(req.params)

      console.log('id', id)

      const user = await prisma.user.findUnique({
        where: {
          id
        },
        select: {
          contact: {
            select: {
              id: true,
              username: true,
              sent_messages: {
                where: {
                  receiver_id: id,
                },
                orderBy: {
                  created_at: 'desc'
                },
                take: 1
              },
              received_messages: {
                where: {
                  sender_id: id,
                },
                orderBy: {
                  created_at: 'desc'
                },
                take: 1
              },

            }
          }
        }
        
      })

      if (!user) {
        console.error("User not found");
        return res.status(404).json({ error: "User not found" });
      }

      const contactsWithMessages = user.contact.map((contact) => {
        const sentMessage = contact.sent_messages[0] || {
          created_at: new Date(0),
        }; 
        const receivedMessage = contact.received_messages[0] || {
          created_at: new Date(0),
        };

        const latestMessageDate =
          sentMessage.created_at > receivedMessage.created_at
            ? sentMessage.created_at
            : receivedMessage.created_at;

        return {
          ...contact,
          latestMessageDate,
        };
      });

      const sortedContacts = contactsWithMessages.sort(
        (a, b) => b.latestMessageDate - a.latestMessageDate
      );

      console.log(sortedContacts);
      res.status(200).json(sortedContacts);

    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Parametro invalido" })
      } else {
        console.log("erro ao buscar contatos", error)
        res.json({ error: "Error while getting contacts" })
      }

    }
  },

  async setContactToUser(req: Request, res: Response) {
    try {
      const setContactBody = z.object({
        id: z.string(),
        contact_id: z.string()
      })

      const { id, contact_id } = setContactBody.parse(req.body)

      const usersExist = await checkUsersExist(id, contact_id)

      if (usersExist.error) {
        return res.status(404).json(usersExist)
      }

      await prisma.user.update({
        where: {
          id,
        },
        data: {
          contact: {
            connect: {
              id: contact_id
            },
          }
        }
      })

      await prisma.user.update({
        where: {
          id: contact_id,
        },
        data: {
          contact: {
            connect: {
              id
            },
          }
        }
      })

      res.status(200).json({message: "Set contact successful"})

    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Parametro invalido" })
      } else {
        console.log("erro ao criar contato", error)
        res.json({ error: "Error while setting contact" })
      }

    }
  },

} 

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10
  return await bcrypt.hash(password, saltRounds)
}