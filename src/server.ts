// Back-end API RESTfull
import Fastify from "fastify"
import cors from '@fastify/cors'
import { PrismaClient } from "@prisma/client"

const app = Fastify()
const prisma = new PrismaClient()

app.register(cors, {
  origin: 'http://localhost:3000'
})

app.get('/', async () => {

  const habits = await prisma.habit.findMany({
    where: {
      title: {
        startsWith: 'Beber'
      }
    }
  })

  return habits
})


app.listen({
  port: 3333,
}).then(() => {
  console.log('HTTP Server is running!')
})