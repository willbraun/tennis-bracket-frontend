import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import { fetchJson } from '$lib/server/utils.js'
import type { Banner, Draw, HomePageData, PbListResponse } from '$lib/types.js'
import { errorMessage } from '$lib/utils'
import { fail, type Actions } from '@sveltejs/kit'
import { format } from 'date-fns'
import type { ClientResponseError } from 'pocketbase'

export async function load({ fetch, locals }) {
	const url = PUBLIC_POCKETBASE_URL
	const today = format(new Date(), 'yyyy-MM-dd')
	const token = locals.pb.authStore.token

	const [active, completed, banner]: [
		PbListResponse<Draw>,
		PbListResponse<Draw>,
		PbListResponse<Banner>
	] = await Promise.all([
		fetchJson(
			`${url}/api/collections/draw/records?filter=(end_date>="${today}")&sort=-start_date,event`,
			token,
			fetch
		),
		fetchJson(
			`${url}/api/collections/draw/records?filter=(end_date<"${today}")&sort=-start_date,event`,
			token,
			fetch
		),
		fetchJson(`${url}/api/collections/banner/records?perPage=1`, token, fetch)
	])

	return {
		active,
		completed,
		banner: banner.items[0],
		pb_auth_valid: locals.pb.authStore.isValid as boolean,
		pb_auth_cookie: locals.pb.authStore.exportToCookie() as string,
		pb_auth_username: (locals.pb.authStore.model?.username ?? '') as string
	} as HomePageData
}

export const actions: Actions = {
	logout: async ({ locals, cookies }) => {
		try {
			locals.pb.authStore.clear()
			cookies.delete('isLeaderboard', { path: '/' })
			return {
				error: ''
			}
		} catch (e) {
			const statusCode = (e as ClientResponseError).status
			return fail(statusCode, {
				error: errorMessage(e)
			})
		}
	}
}
