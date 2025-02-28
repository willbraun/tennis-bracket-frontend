<script lang="ts">
	import EmailField from '$lib/components/EmailField.svelte'
	import FormError from '$lib/components/FormError.svelte'
	import { makeSetType } from '$lib/utils.js'
	import { enhance } from '$app/forms'
	import type { AuthResult } from '$lib/types'
	import { onMount } from 'svelte'
	import AuthBase from '../AuthBase.svelte'

	let email = $state('')
	let showEmailValidation = $state(false)
	let error = $state('')
	let loading = $state(false)
	let success = $state(false)
	let disabled = $derived(loading || showEmailValidation)

	// focus on the button after correcting email format and tabbing
	let buttonRef: HTMLButtonElement | null = $state(null)
	$effect(() => {
		if (buttonRef && !showEmailValidation) {
			buttonRef.disabled = false
			buttonRef.focus()
		}
	})

	const setType = makeSetType<AuthResult>()

	let emailRef: HTMLInputElement | null = $state(null)
	onMount(() => {
		if (emailRef) {
			emailRef.focus()
		}
	})
</script>

<AuthBase>
	<h1 class="mb-4 text-4xl font-semibold">Reset Password</h1>
	<p class="mb-4">Enter your email and we'll send you a link to reset your password</p>
	<form
		method="POST"
		use:enhance={() => {
			loading = true
			error = ''
			return async ({ result, update }) => {
				await update()
				const typedResult = setType(result)
				if (result.status === 200) {
					success = true
				} else {
					success = false
					error = typedResult.data.error
				}
				loading = false
			}
		}}
	>
		<EmailField bind:email bind:showValidation={showEmailValidation} bind:ref={emailRef} />
		<div class="flex justify-center">
			<button
				type="submit"
				class="variant-filled-primary btn mx-auto my-4 rounded-xl text-xl font-semibold"
				{disabled}
				bind:this={buttonRef}
			>
				{loading ? 'Sending...' : 'Send password reset link'}
			</button>
		</div>
	</form>

	{#if success}
		<p class="text-center">
			Sent! Please check your email and spam folder for your password reset link
		</p>
	{/if}
	<div class="mt-2">
		<FormError {error} />
	</div>
	<div class="mt-6">
		<p><a class="underline" href="/login">Back to Login</a></p>
		<p>Don't have an account? Create one <a class="underline" href="/create-account">here</a></p>
		<p><a class="underline" href="/">Home</a></p>
	</div>
</AuthBase>
