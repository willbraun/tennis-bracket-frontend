import { render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { isAuth } from '../store'
import PageSetup from './PageSetup.test.svelte'
import NavMenuContent from './NavMenuContent.svelte'

describe('NavMenu component', () => {
	test('Renders logged out', () => {
		isAuth.set(false)
		render(PageSetup, { component: NavMenuContent })

		expect(screen.queryByText('Draws')).toBeInTheDocument()
		expect(screen.queryByText('My Profile')).not.toBeInTheDocument()
		expect(screen.queryByText('Rankings')).toBeInTheDocument()
		expect(screen.getByText('About')).toBeInTheDocument()
		expect(screen.getByText('Log in')).toBeInTheDocument()
		expect(screen.getByText('Sign up')).toBeInTheDocument()
		expect(screen.queryByText('Log out')).not.toBeInTheDocument()
	})
	test('Renders logged in', () => {
		isAuth.set(true)
		render(PageSetup, { component: NavMenuContent })

		expect(screen.getByText('Draws')).toBeInTheDocument()
		expect(screen.getByText('My Profile')).toBeInTheDocument()
		expect(screen.getByText('Rankings')).toBeInTheDocument()
		expect(screen.getByText('About')).toBeInTheDocument()
		expect(screen.queryByText('Log in')).not.toBeInTheDocument()
		expect(screen.queryByText('Sign up')).not.toBeInTheDocument()
		expect(screen.getByText('Log out')).toBeInTheDocument()
	})
})
