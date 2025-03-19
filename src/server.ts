import Fastify from 'fastify'
import dotenv from 'dotenv'
import { auth } from './routes/auth'
import { teams } from './routes/teams'
import { matches } from './routes/matches'
import { activities } from './routes/activities'
import { ranking } from './routes/ranking'

dotenv.config()

const fastify = Fastify({ logger: true })

fastify.register(auth)
fastify.register(teams)
fastify.register(matches)
fastify.register(activities)
fastify.register(ranking)

const start = async () => {
	try {
		await fastify.listen({ port: 3000 })
		console.log('Server running on http://localhost:3000')
	} catch (err) {
		fastify.log.error(err)
		process.exit(1)
	}
}

start()
