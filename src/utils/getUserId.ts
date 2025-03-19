import { FastifyRequest } from 'fastify'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET as string

export async function getUserId(request: FastifyRequest) {
	const authorization = request.headers.authorization

	if (!authorization) {
		throw new Error('Not authenticated')
	}

	const token = authorization.replace('Bearer ', '')
	const { userId } = jwt.verify(token, JWT_SECRET) as { userId: string }

	return userId
}
