import { z } from 'zod'
import { prisma } from "./lib/prisma"
import { FastifyInstance } from "fastify"
import dayjs from 'dayjs'

export async function appRoutes(app: FastifyInstance) {

  app.post('/habits', async (request) => {

    const createHabitBody = z.object({
      title: z.string(),
      weekDays: z.array(z.number().min(0).max(6))
    })

    const { title, weekDays } = createHabitBody.parse(request.body)

    // Zerando o horário da criação dos hábitos, ex: 23-01-23 00:00:00
    const today = dayjs().startOf('day').toDate()

    await prisma.habit.create({
      data: {
        title,
        created_at: today,
        weekDays: {
          create: weekDays.map(weekDay => {
            return {
              week_day: weekDay
            }
          })
        }
      }
    })
  })

  app.get('/day', async (request) => {
    const getDayParams = z.object({
      date: z.coerce.date() // Converte uma string vinda do parametro para um date
    })

    const { date } = getDayParams.parse(request.query)

    const parsedDate = dayjs(date).startOf('day') // C
    const weekday = parsedDate.get('day') // day => retorna o dia da semana, date => retorna o dia do mes

    // todos os hábitos possíveis
    const possibleHabits = await prisma.habit.findMany({
      where: {
        created_at: {
          lte: date, // lte => menor ou igual
        },
        weekDays: {
          some: {
            week_day: weekday
          }
        }
      }
    })

    const day = await prisma.day.findUnique({
      where: {
        date: parsedDate.toDate()
      },
      include: {
        dayHabits: true,
      }
    })

    const completedHabits = day?.dayHabits.map(dayHabit => {
      return dayHabit.habit_id
    })

    return {
      possibleHabits,
      completedHabits,
    }

    // hábitos que já foram completados
  })
}
