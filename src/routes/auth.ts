import { FastifyInstance } from 'fastify'
import bcrypt from 'bcrypt'
import { prisma } from '../lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET as string

interface RegisterBody {
	email: string
	username: string
	teamName: string
	password: string
}

interface LoginBody {
	email: string
	password: string
}

export async function auth(app: FastifyInstance) {
	app.post('/auth/register', async (request, reply) => {
		const { email, username, password, teamName } =
			request.body as RegisterBody

		const hashedPassword = await bcrypt.hash(password, 10)

		try {
			const user = await prisma.user.create({
				data: {
					email,
					username,
					password: hashedPassword,
				},
			})

			const team = await prisma.team.create({
				data: {
					name: teamName,
					leaderId: user.id,
				},
			})

			const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
				expiresIn: '7d',
			})

			reply.code(201).send({
				id: user.id,
				email: user.email,
				username: user.username,
				team: {
					id: team.id,
					name: team.name,
				},
				token,
			})
		} catch (error) {
			reply.code(400).send({ message: 'User already exists' })
		}
	})

	app.post('/auth/login', async (request, reply) => {
		const { email, password } = request.body as LoginBody
		console.log(email)
		const user = await prisma.user.findUnique({
			where: {
				email,
			},
			include: {
				team: true,
			},
		})

		if (!user) {
			return reply
				.code(401)
				.send({ message: 'Invalid email or password' })
		}

		const passwordMatch = await bcrypt.compare(password, user.password)

		if (!passwordMatch) {
			return reply
				.code(401)
				.send({ message: 'Invalid email or password' })
		}

		const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
			expiresIn: '7d',
		})
		reply.send({
			id: user.id,
			email: user.email,
			username: user.username,
			team: user.team && {
				id: user.team.id,
				name: user.team.name,
			},
			token,
		})
	})
}
