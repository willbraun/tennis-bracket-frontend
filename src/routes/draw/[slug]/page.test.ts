import { render, screen, within } from '@testing-library/svelte'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'
import type {
	Draw,
	DrawPageData,
	DrawResult,
	PbListResponse,
	Prediction,
	SelectedUser,
	Slot
} from '$lib/types'
import PageSetup from '$lib/components/PageSetup.test.svelte'
import Page from './+page.svelte'
import { isAuth, selectedUsers } from '$lib/store'
import { formatScore } from '$lib/utils'

const emptySlotData: Slot[] = []
for (let i = 1; i <= 8; i++) {
	for (let j = 1; j <= 2 ** (8 - i); j++) {
		emptySlotData.push({
			collectionId: 'x9dn3y760dvxbek',
			collectionName: 'slots_with_scores',
			created: '2024-05-02 15:48:21.972Z',
			draw_id: 'j5mehm6fvdf9105',
			id: 'v8mjytmle1h650x',
			round: i,
			position: j,
			name: '',
			seed: '',
			updated: '2024-05-02 15:48:21.972Z',
			set1_id: 'set1_dummy',
			set1_games: null,
			set1_tiebreak: null,
			set2_id: 'set2_dummy',
			set2_games: null,
			set2_tiebreak: null,
			set3_id: 'set3_dummy',
			set3_games: null,
			set3_tiebreak: null,
			set4_id: 'set4_dummy',
			set4_games: null,
			set4_tiebreak: null,
			set5_id: 'set5_dummy',
			set5_games: null,
			set5_tiebreak: null
		})
	}
}

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
	slots: emptySlotData,
	drawResults: {
		items: [
			{
				collectionId: 'zpjgxcf4d9ojqcd',
				collectionName: 'draw_results',
				draw_id: 'j5mehm6fvdf9105',
				id: 'j5mehm6fvdf9105',
				total_points: 16,
				rank: 1,
				user_id: 'userId',
				username: 'will'
			},
			{
				collectionId: 'zpjgxcf4d9ojqcd',
				collectionName: 'draw_results',
				draw_id: 'j5mehm6fvdf9105',
				id: 'j5mehm6fvdf9105',
				total_points: 12,
				rank: 2,
				user_id: 'userId',
				username: 'john'
			},
			{
				collectionId: 'zpjgxcf4d9ojqcd',
				collectionName: 'draw_results',
				draw_id: 'j5mehm6fvdf9105',
				id: 'j5mehm6fvdf9105',
				total_points: 8,
				rank: 3,
				user_id: 'userId',
				username: 'steve'
			},
			{
				collectionId: 'zpjgxcf4d9ojqcd',
				collectionName: 'draw_results',
				draw_id: 'j5mehm6fvdf9105',
				id: 'j5mehm6fvdf9105',
				total_points: 4,
				rank: 4,
				user_id: 'userId',
				username: 'sally'
			}
		] as DrawResult[],
		page: 1,
		perPage: 30,
		totalItems: 4,
		totalPages: 1
	} as PbListResponse<DrawResult>,
	predictions: {
		items: [
			{
				collectionId: 'collectionId',
				collectionName: 'view_predictions',
				draw_id: 'drawId',
				draw_slot_id: 'drawSlotId',
				round: 7,
				position: 1,
				seed: '(1)',
				id: 'predictionId1',
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
				id: 'predictionId2',
				name: 'Bad PredictionTest',
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
				id: 'predictionId3',
				name: 'Roger Federer',
				points: 8,
				user_id: 'userId',
				username: 'will'
			}
		] as Prediction[],
		page: 1,
		perPage: 30,
		totalItems: 0,
		totalPages: 1
	} as PbListResponse<Prediction>,
	cookieSelectedUsers: [
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
	],
	currentUser: {
		selectorId: 'userId',
		id: 'userId',
		username: 'will',
		color: 'bg-blue-300'
	} as SelectedUser,
	isLeaderboard: 'false'
}

// Mock the Resize Observer
class ResizeObserverMock {
	constructor(private callback: ResizeObserverCallback) {}

	observe(target: Element) {
		// Immediately invoke the callback with an entry that indicates the target is resized
		this.callback(
			[{ target, contentRect: target.getBoundingClientRect() } as ResizeObserverEntry],
			this
		)
	}

	unobserve(target: Element) {
		// No-op
	}

	disconnect() {
		// No-op
	}
}

// Mock the global ResizeObserver
global.ResizeObserver = ResizeObserverMock as any

// Mock the element.animate function
global.Element.prototype.animate = vi.fn().mockReturnValue({
	onfinish: null,
	play: vi.fn(),
	pause: vi.fn(),
	finish: vi.fn(),
	cancel: vi.fn(),
	reverse: vi.fn(),
	commitStyles: vi.fn(),
	persist: vi.fn(),
	currentTime: 0,
	playbackRate: 1,
	startTime: null,
	timeline: null,
	ready: Promise.resolve(),
	finished: Promise.resolve()
})

const mockGetPredictions = vi.fn().mockResolvedValue(data.predictions)

vi.mock('$lib/api', () => ({
	getPredictions: () => mockGetPredictions()
}))

describe('Draw page component', () => {
	const initialSelections: SelectedUser[] = []

	beforeEach(() => {
		isAuth.set(true)
		selectedUsers.set(initialSelections)
	})

	afterEach(() => {
		selectedUsers.set(initialSelections)
	})

	test('Renders', () => {
		render(PageSetup, {
			props: {
				component: Page,
				data
			}
		})

		expect(screen.getByText('Active Round:')).toHaveTextContent('Active Round: Qualifying Rounds')
		expect(screen.getByText('Predictions open until:')).toHaveTextContent(
			'Predictions open until: 12h after R16 is full'
		)
		expect(screen.queryByText('Predictions closed:')).not.toBeInTheDocument()
		expect(screen.getByText('Users:')).toBeInTheDocument()
		expect(screen.queryByText('Log in to play!')).not.toBeInTheDocument()
		expect(screen.getByTestId('SlotNameR8P1')).toHaveTextContent('TBD')
	})

	test('Logged out', () => {
		isAuth.set(false)
		render(PageSetup, {
			props: {
				component: Page,
				data
			}
		})

		expect(screen.queryByText('Users:')).not.toBeInTheDocument()
		expect(screen.getByText('Log in to play!')).toBeInTheDocument()
	})

	const testActiveRound = (activeRound: number, expectedTextContent: string) => {
		const newSlots = emptySlotData.map((slot) => {
			return slot.round <= activeRound ? { ...slot, name: 'Some Player' } : slot
		}) as Slot[]

		render(PageSetup, {
			props: {
				component: Page,
				data: {
					...data,
					slots: newSlots
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
		render(PageSetup, {
			props: {
				component: Page,
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
			'Predictions closed: Jan 28, 2024 12:32am' // America/New_York
		)
		expect(screen.queryByText('Predictions open until:')).not.toBeInTheDocument()
	})

	test('Selected users render', () => {
		selectedUsers.set(data.cookieSelectedUsers)

		render(PageSetup, {
			props: {
				component: Page,
				data
			}
		})

		expect(screen.getByText('john')).toBeInTheDocument()
		expect(screen.getByText('steve')).toBeInTheDocument()
		expect(screen.getByText('sally')).toBeInTheDocument()
	})

	test('Points tallied correctly', () => {
		render(PageSetup, {
			props: {
				component: Page,
				data
			}
		})

		expect(screen.getByTestId('User_will')).toHaveTextContent('will')
		expect(screen.getByTestId('User_will')).toHaveClass('bg-blue-300')
		expect(screen.getByTestId('UserPoints_will')).toHaveTextContent('16')
	})

	test('Leaderboard toggles in and out', async () => {
		render(PageSetup, {
			props: {
				component: Page,
				data
			}
		})

		const leaderboardToggle = screen.getByTestId('LeaderboardToggle')
		const buttons = within(leaderboardToggle).getAllByRole('button')

		expect(buttons[0]).toHaveClass('text-white')
		expect(buttons[1]).not.toHaveClass('text-white')
		expect(screen.getByTestId('Draw')).toBeInTheDocument()
		expect(screen.queryByTestId('Leaderboard')).not.toBeInTheDocument()

		await userEvent.click(buttons[1])
		expect(buttons[0]).not.toHaveClass('text-white')
		expect(buttons[1]).toHaveClass('text-white')
		expect(screen.getByTestId('Leaderboard')).toBeInTheDocument()

		await userEvent.click(buttons[0])
		expect(buttons[0]).toHaveClass('text-white')
		expect(buttons[1]).not.toHaveClass('text-white')
	})

	test('Correct slots render, 128 draw', () => {
		render(PageSetup, {
			props: {
				component: Page,
				data
			}
		})

		const totalRounds = 8
		for (let round = 1; round <= totalRounds; round++) {
			const positions = 2 ** (totalRounds - round)
			for (let position = 1; position <= positions; position++) {
				const testId = `SlotNameR${round}P${position}`
				if (round >= 4) {
					expect(screen.getByTestId(testId)).toBeInTheDocument()
				} else {
					expect(screen.queryByTestId(testId)).not.toBeInTheDocument()
				}
			}
		}
	})

	test('Slot renders with data', () => {
		const slot = emptySlotData.at(-1) as Slot
		const newSlot = {
			...slot,
			name: 'Roger Federer',
			seed: '(1)',
			score: '6-3, 6-4, 6-2'
		} as Slot
		const newSlots = emptySlotData.with(-1, newSlot) as Slot[]

		render(PageSetup, {
			props: {
				component: Page,
				data: {
					...data,
					slots: newSlots
				}
			}
		})

		expect(screen.getByTestId('SlotNameR8P1')).toHaveTextContent('(1) Roger Federer')
		expect(screen.getByTestId('SlotScoreR8P1')).toHaveTextContent('6-3, 6-4, 6-2')
	})

	test('Slot renders without data', () => {
		render(PageSetup, {
			props: {
				component: Page,
				data
			}
		})

		expect(screen.getByTestId('SlotNameR8P1')).toHaveTextContent('TBD')
		expect(screen.queryByTestId('SlotScoreR8P1')).not.toBeInTheDocument()
	})

	test('Score is formatted correctly', () => {
		const blank = emptySlotData.at(-1) as Slot

		const scenarios = [
			{
				winner: {
					...blank,
					set1_games: 6,
					set1_tiebreak: 0,
					set2_games: 6,
					set2_tiebreak: 0,
					set3_games: 6,
					set3_tiebreak: 0
				},
				loser: {
					...blank,
					set1_games: 3,
					set1_tiebreak: 0,
					set2_games: 4,
					set2_tiebreak: 0,
					set3_games: 2,
					set3_tiebreak: 0
				},
				showTieBreak: true,
				expectedScore: '6-3, 6-4, 6-2'
			},
			{
				winner: {
					...blank,
					set1_games: 7,
					set1_tiebreak: 0,
					set2_games: 5,
					set2_tiebreak: 0,
					set3_games: 6,
					set3_tiebreak: 10,
					set4_games: 6,
					set4_tiebreak: 0,
					set5_games: 6,
					set5_tiebreak: 0
				},
				loser: {
					...blank,
					set1_games: 6,
					set1_tiebreak: 7,
					set2_games: 7,
					set2_tiebreak: 0,
					set3_games: 7,
					set3_tiebreak: 0,
					set4_games: 3,
					set4_tiebreak: 0,
					set5_games: 0,
					set5_tiebreak: 0
				},
				showTieBreak: true,
				expectedScore: '7-6 (7), 5-7, 6-7 (10), 6-3, 6-0'
			},
			{
				winner: blank,
				loser: blank,
				showTieBreak: true,
				expectedScore: 'Walkover'
			},
			{
				winner: {
					...blank,
					set1_games: 7,
					set1_tiebreak: 0,
					set2_games: 6,
					set2_tiebreak: 0,
					set3_games: 7,
					set3_tiebreak: 0
				},
				loser: {
					...blank,
					set1_games: 6,
					set1_tiebreak: 0,
					set2_games: 7,
					set2_tiebreak: 0,
					set3_games: 6,
					set3_tiebreak: 0
				},
				showTieBreak: false,
				expectedScore: '7-6, 6-7, 7-6'
			},
			{
				winner: blank,
				loser: blank,
				showTieBreak: false,
				expectedScore: 'Walkover'
			},
			{
				winner: {
					...blank,
					set1_games: 5,
					set1_tiebreak: 0
				},
				loser: {
					...blank,
					set1_games: 3,
					set1_tiebreak: 0
				},
				showTieBreak: true,
				expectedScore: '5-3 (Ret.)'
			},
			{
				winner: {
					...blank,
					set1_games: 6,
					set1_tiebreak: 0
				},
				loser: {
					...blank,
					set1_games: 5,
					set1_tiebreak: 0
				},
				showTieBreak: true,
				expectedScore: '6-5 (Ret.)'
			},
			{
				winner: {
					...blank,
					set1_games: 6,
					set1_tiebreak: 0,
					set2_games: 1,
					set2_tiebreak: 0,
					set3_games: 0,
					set3_tiebreak: 0
				},
				loser: {
					...blank,
					set1_games: 4,
					set1_tiebreak: 0,
					set2_games: 6,
					set2_tiebreak: 0,
					set3_games: 0,
					set3_tiebreak: 0
				},
				showTieBreak: true,
				expectedScore: '6-4, 1-6 (Ret.)'
			},
			{
				winner: {
					...blank,
					set1_games: 6,
					set1_tiebreak: 0,
					set2_games: 6,
					set2_tiebreak: 0,
					set3_games: 7,
					set3_tiebreak: 0
				},
				loser: {
					...blank,
					set1_games: 2,
					set1_tiebreak: 0,
					set2_games: 2,
					set2_tiebreak: 0,
					set3_games: 6,
					set3_tiebreak: 4
				},
				showTieBreak: true,
				expectedScore: '6-2, 6-2, 7-6 (4)'
			}
		]

		scenarios.forEach(({ winner, loser, showTieBreak, expectedScore }) => {
			const formattedScore = formatScore(winner, loser, showTieBreak)
			expect(formattedScore).toBe(expectedScore)
		})
	})
})
