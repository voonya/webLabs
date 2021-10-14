<script context="module">
	export const prerender = true;
</script>

<script>
	import Counter from '$lib/Counter.svelte';
	let showSpinner = false;
	let statusMessage = false;
	let errorMessage = false;
	let formBtnDisable = false;

	let contactFormHandler = async (e) => {
		statusMessage = false;
		formBtnDisable = true;
		showSpinner = true;

		const reffererVal = document.referrer;
		const formData = new FormData(e.target);
		const data = {};

		for (let field of formData) {
			const [key, value] = field;
			data[key] = value;
		}
		data['refferal'] = reffererVal;

		try {
			await fetch('api/sendmail', {
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data),
				method: 'POST'
			}).then((res) => {
				if (res.status >= 200 && res.status < 300 && res.data == 'ok') {
					return res;
				}
			});
			statusMessage = true;
			showSpinner = false;
			formBtnDisable = false;
			e.target.reset();
		} catch (e) {
			errorMessage = true;
			showSpinner = false;
			formBtnDisable = false;
		}
	};
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
	<h1>
		<div class="welcome">
			<picture>
				<source srcset="svelte-welcome.webp" type="image/webp" />
				<img src="svelte-welcome.png" alt="Welcome" />
			</picture>
		</div>
		to your new<br />SvelteKit app
	</h1>
	<form class="contact-form" on:submit|preventDefault={contactFormHandler}>
		<input class="contact-form-input" type="text" placeholder="Name" name="userName" required />
		<input class="contact-form-input" type="email" placeholder="Email" name="userMail" required />
		<textarea
			name="userMessage"
			id="text-mail"
			cols="30"
			rows="10"
			placeholder="Type your text here"
			required
		/>

		{#if statusMessage}
			<p class="status-text success">
				Message sent!
				<!-- <button class="close-btn" on:click=""></button> -->
			</p>
		{:else if errorMessage}
			<p class="status-text error">
				Email doesn`t exist
				<!-- <button class="close-btn" on:click=""></button> -->
			</p>
		{/if}
		{#if showSpinner}
			<div class="spinner" />
		{/if}
		<button class="contact-form-btn" type="submit" disabled={formBtnDisable}> Submit </button>
	</form>
	<h2>
		try editing <strong>src/routes/index.svelte</strong>
	</h2>

	<Counter />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
	form {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.spinner {
		background-color: #edf0f8;
		border: 8px solid #f3f3f3; /* Light grey */
		border-top: 8px solid #3498db; /* Blue */
		border-radius: 50%;
		width: 60px;
		height: 60px;
		animation: spin 2s linear infinite;
		margin-bottom: 10px;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
	input {
		margin-bottom: 20px;
	}
	button {
		flex-grow: 0;
	}
	textarea {
		resize: none;
		margin-bottom: 10px;
	}
	p {
		font-weight: 600;
		text-transform: uppercase;
	}
</style>
