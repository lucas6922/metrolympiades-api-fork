import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

export async function ranking(app: FastifyInstance) {
	app.get('/ranking', async (_, reply) => {
		const teams = await prisma.team.findMany({
			select: {
				id: true,
				name: true,
				matches1: {
					select: {
						id: true,
						team1Score: true,
						team2Score: true,
					},
				},
				matches2: {
					select: {
						id: true,
						team1Score: true,
						team2Score: true,
					},
				},
			},
		})

		// victory = 3 points
		// draw = 1 point
		// defeat = 0 points
		// returns { team: string, points: number }

		const teamsWithPoints = teams.map((team) => {
			const points =
				team.matches1.reduce((acc, match) => {
					if (match.team1Score > match.team2Score) {
						return acc + 3
					}
					if (match.team1Score === match.team2Score) {
						return acc + 1
					}
					return acc
				}, 0) +
				team.matches2.reduce((acc, match) => {
					if (match.team2Score > match.team1Score) {
						return acc + 3
					}
					if (match.team1Score === match.team2Score) {
						return acc + 1
					}
					return acc
				}, 0)

			return {
				team: team.name,
				points,
			}
		})

		const sortedTeams = teamsWithPoints.sort((a, b) => b.points - a.points)
		reply.send(sortedTeams)
	})
}
