// Back-end API RESTfull
import Fastify from "fastify"
import cors from '@fastify/cors'
import { appRoutes } from "./routes"

const app = Fastify()

/* app.register(cors, {
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://192.168.100.113:19000']
})
*/

app.register(cors)
app.register(appRoutes)

app.listen({
  port: 3333,
  host: '0.0.0.0', //O Fastify Não aceita conexão com IP: Apenas com local host, isso evita error de [AxiosError: Network Error].
}).then((url) => {
  console.log(`HTTP Server running on ${url}`)
})