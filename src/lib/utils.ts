import type { ClientResponseError } from 'pocketbase'
import { selectedUsers } from './store'
import {
	DrawStatus,
	type Draw,
	type DrawResult,
	type SelectedUser,
	type SelectedUserNoColor,
	type SlotWithRawScore
} from './types'
import { get } from 'svelte/store'
import Cookies from 'js-cookie'
import { selectColors } from './data'
import { cubicInOut } from 'svelte/easing'
import type { TransitionConfig } from 'svelte/transition'

type ErrorObjData = {
	[key: string]: {
		code: string
		message: string
	}
}

export const errorMessage = (error: unknown) => {
	const errorObj = error as ClientResponseError
	const data = errorObj?.data?.data as ErrorObjData
	let dataMessage = ''

	if (data && Object.keys(data).length > 0) {
		dataMessage = Object.entries(data)
			.map(([key, value]) => `• ${capitalize(key)}: ${value.message}`)
			.join('\n')
	}

	const result = `Error: ${errorObj.status} - ${errorObj.message}${
		dataMessage && `\n${dataMessage}`
	}`
	console.error(result)
	return result
}

const capitalize = (str: string) => {
	if (!str) return ''
	return str[0].toUpperCase() + str.slice(1).toLowerCase()
}

export const makeSetType = <T>() => {
	return (result: object): T => {
		return result as T
	}
}

const isDraw = (draw: Draw | DrawResult): draw is Draw => {
	return draw.collectionName === 'draw'
}

const isDrawResult = (draw: Draw | DrawResult): draw is DrawResult => {
	return draw.collectionName === 'draw_results'
}

export const getSlug = (draw: Draw | DrawResult): string => {
	const slugify = (str: string) => str.toLowerCase().replaceAll(' ', '-').replaceAll("'", '')

	if (isDraw(draw)) {
		return `${slugify(draw.name)}-${slugify(draw.event)}-${draw.year}-${draw.id}`
	} else if (isDrawResult(draw)) {
		return `${slugify(draw.draw_name)}-${slugify(draw.draw_event)}-${draw.draw_year}-${draw.draw_id}`
	} else {
		return ''
	}
}

export const getTitle = (draw: Draw | DrawResult): string => {
	if (isDraw(draw)) {
		return `${draw.name} ${draw.event} ${draw.year}`
	} else if (isDrawResult(draw)) {
		return `${draw.draw_name} ${draw.draw_event} ${draw.draw_year}`
	} else {
		return ''
	}
}

const getNextColor = (users: SelectedUser[]) => {
	return selectColors.filter((color) => !users.some((user) => user.color === color))[0]
}

export const addUser = (user: SelectedUserNoColor) => {
	const users = get(selectedUsers)
	const newUser = {
		...user,
		color: getNextColor(users)
	}
	const newUsers = [...users, newUser]
	selectedUsers.set(newUsers)
	Cookies.set('selectedUsers', JSON.stringify(newUsers))
}

export const removeUser = (userId: string) => {
	const users = get(selectedUsers)
	const newUsers = users.filter((u) => u.id !== userId)
	selectedUsers.set(newUsers)
	Cookies.set('selectedUsers', JSON.stringify(newUsers))
}

export const getDrawStatus = (startDate: string, endDate: string): DrawStatus => {
	const now = new Date()
	const start = new Date(startDate)
	const end = new Date(endDate)

	if (now < start) {
		return DrawStatus.UPCOMING
	} else if (now > end) {
		return DrawStatus.COMPLETED
	} else {
		return DrawStatus.ACTIVE
	}
}

export const formatAvg = (num: number | null): string => {
	if (num === null) {
		return 'N/A'
	}

	let result: string
	const rounded = Math.round(num * 100) / 100
	if (Number.isInteger(rounded)) {
		result = rounded.toString()
	} else if (Number.isInteger(rounded * 10)) {
		result = rounded.toFixed(1)
	} else {
		result = rounded.toFixed(2)
	}

	return result
}

export const formatPercent = (num: number | null): string => {
	if (num === null) {
		return 'N/A'
	}

	let result: string
	if (Number.isInteger(num)) {
		result = num.toString()
	} else {
		const rounded = Math.round(num * 100) / 100
		if (Number.isInteger(rounded)) {
			result = rounded.toString()
		} else {
			result = rounded.toFixed(1)
		}
	}

	return `${result}%`
}

export const formatScore = (
	winner: SlotWithRawScore,
	loser: SlotWithRawScore,
	showTieBreak: boolean
): string => {
	let sets = []
	for (let i = 1; i <= 5; i++) {
		let setScore = ''
		const games = `set${i}_games` as keyof SlotWithRawScore
		const tiebreak = `set${i}_tiebreak` as keyof SlotWithRawScore
		if (winner[games] !== null && loser[games] !== null) {
			setScore = `${winner[games]}-${loser[games]}`
		}

		if (showTieBreak && Number(winner[games]) === 7 && Number(loser[games]) === 6) {
			setScore += ` (${loser[tiebreak]})`
		}
		if (showTieBreak && Number(winner[games]) === 6 && Number(loser[games]) === 7) {
			setScore += ` (${winner[tiebreak]})`
		}

		if (setScore) {
			sets.push(setScore)
		}
	}

	let isRetire = false
	const last = sets.at(-1) || '0-0'

	if (!isCompleteSet(last)) {
		isRetire = true
	}

	if (last === '0-0') {
		sets.pop()
	}

	if (sets.length === 0) {
		return 'Walkover'
	}

	return sets.join(', ') + (isRetire ? ' (Ret.)' : '')
}

const isCompleteSet = (set: string) => {
	const games = set.trim().split(' ')[0]
	const setStrings = games.split('-', 2)
	const [winnerInt, loserInt] = setStrings.map((s) => Number(s))
	if ((winnerInt === 7 && loserInt === 6) || (winnerInt === 6 && loserInt === 7)) {
		return true
	}

	if (Math.max(winnerInt, loserInt) >= 6 && Math.abs(winnerInt - loserInt) >= 2) {
		return true
	}

	return false
}

interface SlideParams {
	duration?: number
	x?: number
}

export function customSlide(
	_: HTMLElement,
	{ duration = 250, x = 0 }: SlideParams = {}
): TransitionConfig {
	return {
		duration,
		css: (t: number): string => {
			const eased = cubicInOut(t)
			return `
        position: fixed;
        transform: translateX(${(1 - eased) * x}px);
      `
		}
	}
}
