import { render, screen } from '@testing-library/svelte'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import '@testing-library/jest-dom/vitest'
import type { Draw, DrawPageData, PbListResponse, Prediction, SelectedUser, Slot } from '$lib/types'
import slotData from '$lib/testing/data/slot_data.json'
import DrawPageSetup from '$lib/testing/components/DrawPageSetup.svelte'
import { predictionStore, selectedUsers } from '$lib/store'

const data: DrawPageData = {
	active: {
		items: [
			{
				collectionId: 'zpjgxcf4d9ojqcd',
				collectionName: 'draw',
				created: '2024-05-02 15:42:20.397Z',
				end_date: '2024-06-09 23:00:00.000Z',
				event: "Men's Singles",
				id: 'j5mehm6fvdf9105',
				name: 'French Open',
				prediction_close: '',
				size: 128,
				start_date: '2024-05-26 12:00:00.000Z',
				updated: '2024-05-02 15:44:08.159Z',
				url: 'https://www.atptour.com/en/scores/archive/roland-garros/520/2024/draws',
				year: 2024
			}
		],
		page: 1,
		perPage: 30,
		totalItems: 1,
		totalPages: 1
	} as PbListResponse<Draw>,
	completed: {
		items: [
			{
				collectionId: 'zpjgxcf4d9ojqcd',
				collectionName: 'draw',
				created: '2024-05-02 15:42:20.397Z',
				end_date: '2024-06-09 23:00:00.000Z',
				event: "Men's Singles",
				id: '757duh3a8vpgyrq',
				name: 'Australian Open',
				prediction_close: '2024-01-28 05:32:34.187Z',
				size: 128,
				start_date: '2024-01-13 13:00:00.000Z',
				updated: '2024-01-27 19:47:22.187Z',
				url: 'https://www.atptour.com/en/scores/current/australian-open/580/draws',
				year: 2024
			}
		],
		page: 1,
		perPage: 30,
		totalItems: 1,
		totalPages: 1
	} as PbListResponse<Draw>,
	draw: {
		collectionId: 'zpjgxcf4d9ojqcd',
		collectionName: 'draw',
		created: '2024-05-02 15:42:20.397Z',
		end_date: '2024-06-09 23:00:00.000Z',
		event: "Men's Singles",
		id: 'j5mehm6fvdf9105',
		name: 'French Open',
		prediction_close: '',
		size: 128,
		start_date: '2024-05-26 12:00:00.000Z',
		updated: '2024-05-02 15:44:08.159Z',
		url: 'https://www.atptour.com/en/scores/archive/roland-garros/520/2024/draws',
		year: 2024
	} as Draw,
	slots: slotData as PbListResponse<Slot>,
	currentUser: {
		selectorId: 'userId',
		id: 'userId',
		username: 'will',
		color: 'bg-blue-300'
	} as SelectedUser,
	pb_auth_valid: true,
	pb_auth_cookie: 'dummy_cookie'
}

describe('Draw page component', () => {
	const initialSelections: SelectedUser[] = []
	const initialPredictions: Prediction[] = []

	beforeEach(() => {
		selectedUsers.set(initialSelections)
		predictionStore.set(initialPredictions)
	})

	afterEach(() => {
		selectedUsers.set(initialSelections)
		predictionStore.set(initialPredictions)
	})

	test('Renders', () => {
		render(DrawPageSetup, { props: { data } })

		expect(screen.getByText('Active Round:')).toHaveTextContent('Active Round: Qualifying Rounds')
		expect(screen.getByText('Predictions open until:')).toHaveTextContent(
			'Predictions open until: 12h after R16 is full'
		)
		expect(screen.queryByText('Predictions closed:')).not.toBeInTheDocument()
		expect(screen.getByText('Users:')).toBeInTheDocument()
		expect(screen.queryByText('Log in to play!')).not.toBeInTheDocument()
		expect(screen.getByTestId('SlotR8P1')).toHaveTextContent('TBD')
	})

	test('Logged out', () => {
		render(DrawPageSetup, {
			props: {
				data: {
					...data,
					pb_auth_valid: false
				}
			}
		})

		expect(screen.queryByText('Users:')).not.toBeInTheDocument()
		expect(screen.getByText('Log in to play!')).toBeInTheDocument()
	})

	test('Name and seed render in slot', () => {
		const slot = slotData.items.at(-1) as Slot
		const newSlot = {
			...slot,
			name: 'Roger Federer',
			seed: '(1)'
		} as Slot
		const newSlots = slotData.items.with(-1, newSlot) as Slot[]

		render(DrawPageSetup, {
			props: {
				data: {
					...data,
					slots: {
						...slotData,
						items: newSlots
					}
				}
			}
		})

		expect(screen.getByTestId('SlotR8P1')).toHaveTextContent('(1) Roger Federer')
	})

	test('Correct slots render, 128 draw', () => {
		render(DrawPageSetup, { props: { data } })

		const totalRounds = 8
		for (let round = 1; round <= totalRounds; round++) {
			const positions = 2 ** (totalRounds - round)
			for (let position = 1; position <= positions; position++) {
				const testId = `SlotR${round}P${position}`
				if (round >= 4) {
					expect(screen.getByTestId(testId)).toBeInTheDocument()
				} else {
					expect(screen.queryByTestId(testId)).not.toBeInTheDocument()
				}
			}
		}
	})

	const testActiveRound = (activeRound: number, expectedTextContent: string) => {
		const newSlots = slotData.items.map((slot) => {
			return slot.round <= activeRound ? { ...slot, name: 'Some Player' } : slot
		}) as Slot[]

		render(DrawPageSetup, {
			props: {
				data: {
					...data,
					slots: {
						...slotData,
						items: newSlots
					}
				}
			}
		})

		expect(screen.getByText('Active Round:')).toHaveTextContent(expectedTextContent)
	}

	test('Active Round: 1st Round', () => {
		testActiveRound(1, 'Active Round: 1st Round (R128)')
	})
	test('Active Round: 2nd Round', () => {
		testActiveRound(2, 'Active Round: 2nd Round (R64)')
	})
	test('Active Round: 3rd Round', () => {
		testActiveRound(3, 'Active Round: 3rd Round (R32)')
	})
	test('Active Round: Round of 16', () => {
		testActiveRound(4, 'Active Round: Round of 16')
	})
	test('Active Round: Quarterfinals', () => {
		testActiveRound(5, 'Active Round: Quarterfinals')
	})
	test('Active Round: Semifinals', () => {
		testActiveRound(6, 'Active Round: Semifinals')
	})
	test('Active Round: Final', () => {
		testActiveRound(7, 'Active Round: Final')
	})
	test('Active Round: Tournament Completed', () => {
		testActiveRound(8, 'Active Round: Tournament Completed')
	})

	test('Predictions closed', () => {
		render(DrawPageSetup, {
			props: {
				data: {
					...data,
					draw: {
						...data.draw,
						prediction_close: '2024-01-28 05:32:34.187Z' // UTC
					}
				}
			}
		})

		expect(screen.getByText('Predictions closed:')).toHaveTextContent(
			'Predictions closed: 1/28/2024 12:32am' // America/New_York
		)
		expect(screen.queryByText('Predictions open until:')).not.toBeInTheDocument()
	})

	test('Selected users appear', () => {
		const users: SelectedUser[] = [
			{
				selectorId: 'userId',
				id: 'userId1',
				username: 'john',
				color: 'bg-red-300'
			},
			{
				selectorId: 'userId',
				id: 'userId2',
				username: 'steve',
				color: 'bg-yellow-300'
			},
			{
				selectorId: 'userId',
				id: 'userId3',
				username: 'sally',
				color: 'bg-green-300'
			}
		]

		selectedUsers.set(users)

		render(DrawPageSetup, { props: { data } })

		expect(screen.getByText('john')).toBeInTheDocument()
		expect(screen.getByText('steve')).toBeInTheDocument()
		expect(screen.getByText('sally')).toBeInTheDocument()
	})

	test('Points tallied correctly', () => {
		const predictions = [
			{
				collectionId: 'collectionId',
				collectionName: 'view_predictions',
				draw_id: 'drawId',
				draw_slot_id: 'drawSlotId',
				round: 7,
				position: 1,
				seed: '(1)',
				id: 'predictionId',
				name: 'Roger Federer',
				points: 4,
				user_id: 'userId',
				username: 'will'
			},
			{
				collectionId: 'collectionId',
				collectionName: 'view_predictions',
				draw_id: 'drawId',
				draw_slot_id: 'drawSlotId',
				round: 7,
				position: 2,
				seed: '(2)',
				id: 'predictionId',
				name: 'Rafael Nadal',
				points: 4,
				user_id: 'userId',
				username: 'will'
			},
			{
				collectionId: 'collectionId',
				collectionName: 'view_predictions',
				draw_id: 'drawId',
				draw_slot_id: 'drawSlotId',
				round: 8,
				position: 1,
				seed: '(1)',
				id: 'predictionId',
				name: 'Roger Federer',
				points: 8,
				user_id: 'userId',
				username: 'will'
			}
		] as Prediction[]

		predictionStore.set(predictions)

		render(DrawPageSetup, { props: { data } })

		expect(screen.getByTestId('User_will')).toHaveTextContent('will')
		expect(screen.getByTestId('User_will')).toHaveClass('bg-blue-300')
		expect(screen.getByTestId('UserPoints_will')).toHaveTextContent('16')
	})
})
