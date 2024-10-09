import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import type {
	AveragePoints,
	CorrectPredictions,
	PbListResponse,
	ProfilePageData,
	User
} from '$lib/types.js'

export async function load({ fetch, params, locals }) {
	const username = params.username
	const url = PUBLIC_POCKETBASE_URL
	const options = {
		headers: {
			Authorization: locals.pb.authStore.token
		}
	}

	const userRes = await fetch(
		`${url}/api/collections/user/records?filter=(username="${username}")`,
		options
	)
	const userData: PbListResponse<User> = await userRes.json()
	const user = userData.items[0]

	const [averagePointsRes, correctPredictionsRes] = await Promise.all([
		fetch(`${url}/api/collections/average_points/records/${user.id}_avg`, options),
		fetch(`${url}/api/collections/correct_predictions/records/${user.id}_cp`, options)
	])

	const [averagePoints, correctPredictions] = await Promise.all([
		averagePointsRes.json(),
		correctPredictionsRes.json()
	])

	return {
		username: user.username,
		created: user.created,
		averagePoints,
		correctPredictions
	} as ProfilePageData
}
