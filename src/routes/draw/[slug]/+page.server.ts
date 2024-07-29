import { fail, type Actions } from '@sveltejs/kit'
import { errorMessage, fetchDraws, mainColor } from '$lib/utils'
import type { ClientResponseError } from 'pocketbase'
import type {
	Draw,
	DrawPageData,
	Leaderboard,
	PbListResponse,
	PredictionRecord,
	SelectedUser,
	Slot
} from '$lib/types'
import { PUBLIC_POCKETBASE_URL } from '$env/static/public'

const getCurrentUser = (locals: App.Locals): SelectedUser => {
	return {
		selectorId: locals.pb.authStore.model?.id ?? '',
		id: locals.pb.authStore.model?.id ?? '',
		username: locals.pb.authStore.model?.username ?? '',
		color: mainColor
	}
}

export async function load({ fetch, params, locals }) {
	const id: string = params.slug.split('-').at(-1) ?? ''
	const url = PUBLIC_POCKETBASE_URL
	const currentUser = getCurrentUser(locals)
	const options = {
		headers: {
			Authorization: locals.pb.authStore.token
		}
	}

	const drawRes = await fetch(`${url}/api/collections/draw/records/${id}`, options)
	const drawData: Draw = await drawRes.json()

	const slotRes = await fetch(
		`${url}/api/collections/draw_slot/records?perPage=255&filter=(draw_id="${id}")`,
		options
	)
	const slotData: PbListResponse<Slot> = await slotRes.json()

	const [activeData, completedData] = await fetchDraws(fetch, url, locals.pb.authStore.token)

	const leaderboardRes = await fetch(
		`${url}/api/collections/draw_leaderboard/records?perPage=255&filter=(draw_id="${id}")`,
		options
	)
	const leaderboardData: PbListResponse<Leaderboard> = await leaderboardRes.json()
	console.log(leaderboardData)

	return {
		active: activeData,
		completed: completedData,
		draw: drawData,
		slots: slotData,
		leaderboard: leaderboardData,
		currentUser: currentUser,
		pb_auth_valid: locals.pb.authStore.isValid as boolean,
		pb_auth_cookie: locals.pb.authStore.exportToCookie() as string
	} as DrawPageData
}

export const actions: Actions = {
	selectUser: async ({ request, locals }) => {
		const form = await request.formData()
		const username = (form.get('username') ?? '') as string
		const currentUser = getCurrentUser(locals)

		if (username === '') {
			return fail(400, {
				error: 'Please enter a username'
			})
		}

		try {
			// search for username, case insensitive
			const data = await locals.pb
				.collection('user')
				.getFirstListItem(`username~"${username}"&&"${username}"~username`)
			return {
				user: {
					selectorId: currentUser.id,
					id: data.id,
					username: data.username,
					color: ''
				} as SelectedUser,
				error: ''
			}
		} catch (e) {
			const statusCode = (e as ClientResponseError).status
			if (statusCode === 404) {
				return fail(statusCode, {
					error: 'Error: 404 - Username not found'
				})
			}
			return fail(statusCode, {
				error: errorMessage(e)
			})
		}
	},

	addPrediction: async ({ request, locals }) => {
		const form = await request.formData()
		const slotId = (form.get('slotId') ?? '') as string
		const currentPredictionId = (form.get(`currentPredictionId`) ?? '') as string
		const predictionValue = (form.get(`predictionValue`) ?? '') as string

		if (!locals.pb.authStore.isValid || !locals.pb.authStore.model) {
			return fail(400, {
				error: 'Must be logged in to make a prediction'
			})
		}

		if (!predictionValue) {
			return fail(400, {
				error: `Invalid prediction: "${predictionValue}"`
			})
		}

		if (!slotId) {
			return fail(400, {
				error: `Invalid slot: "${slotId}"`
			})
		}

		const data = {
			draw_slot_id: slotId,
			user_id: locals.pb.authStore.model.id,
			name: predictionValue,
			points: 0
		}

		if (currentPredictionId) {
			try {
				const record: PredictionRecord = await locals.pb
					.collection('prediction')
					.update(currentPredictionId, data)
				return {
					record
				}
			} catch (e) {
				const statusCode = (e as ClientResponseError).status
				return fail(statusCode, {
					error: errorMessage(e)
				})
			}
		} else {
			try {
				const record: PredictionRecord = await locals.pb.collection('prediction').create(data)
				return {
					record
				}
			} catch (e) {
				const statusCode = (e as ClientResponseError).status
				return fail(statusCode, {
					error: errorMessage(e)
				})
			}
		}
	}
}
