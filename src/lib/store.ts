import { derived, writable } from 'svelte/store'
import type { Prediction, SelectedUser } from '$lib/types'
import { persisted } from 'svelte-persisted-store'
import Cookies from 'js-cookie'

export const isAuth = writable<boolean>()
isAuth.subscribe((value) => {
	if (value === false) {
		Cookies.remove('isLeaderboard')
		currentUsername.set('')
	}
})

export const currentUsername = writable<string>('')
export const currentUserId = writable<string>('')
export const predictionStore = writable<Prediction[]>([])
export const selectedUsers = persisted<SelectedUser[]>('selectedUsers', [])
export const mySelectedUsers = derived(
	[selectedUsers, currentUserId],
	([$selectedUsers, $currentUserId]) => {
		return $selectedUsers.filter((user) => user.selectorId === $currentUserId)
	}
)
export const isLeaderboard = writable<boolean>(false)
export const drawNavUrl = writable<string>('')
export const currentDrawId = writable<string>('')
export const loginGoto = writable<string>('/')

export const predictionsError = writable<string>('')
predictionsError.subscribe((value) => {
	if (value) {
		console.error(value)
	}
})

export const isMobile = writable<boolean>(false)
if (typeof window !== 'undefined') {
	const value = 'maxTouchPoints' in navigator && navigator.maxTouchPoints > 0
	isMobile.set(value)
}
