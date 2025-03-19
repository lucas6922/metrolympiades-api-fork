import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

interface ActivitiesBody {
	name: string
}

export async function activities(app: FastifyInstance) {
	app.post('/activities', async (request, reply) => {
		const { name } = request.body as ActivitiesBody

		const activity = await prisma.activity.create({
			data: {
				name,
			},
		})

		reply.code(201).send(activity)
	})

	app.get('/activities', async (request, reply) => {
		const activities = await prisma.activity.findMany()

		reply.send(activities)
	})
}
