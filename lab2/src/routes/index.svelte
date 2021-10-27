<script context="module">
	export const prerender = true;
</script>

<script>
	let showSpinner = false;
	let statusMessage = false;
	let errorMessage = false;
	let formBtnDisable = false;
	let errorText = '';
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
			let res = await fetch('/api/sendmail', {
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data),
				method: 'POST'
			}).then((res) => {
				if (res.status >= 200 && res.status < 300 && res.ok) {
					return res;
				}
				else{
					throw(res);
				}
			});
			statusMessage = true;
			showSpinner = false;
			formBtnDisable = false;
			e.target.reset();
		} catch (e) {
			if(e.status >= 500){
				errorText = 'Server error';
			}
			else if(e.status === 429){
				errorText = 'You sent mail a lot of times';
			}
			else if(e.status === 400){
				errorText = 'No message';
			}
			errorMessage = true;
			showSpinner = false;
			formBtnDisable = false;
			statusMessage = false;
		}
	};
</script>
<section>
		<div class="welcome">
			<picture>
				<source srcset="svelte-welcome.webp" type="image/webp" />
				<img src="svelte-welcome.png" alt="Welcome" />
			</picture>
		</div>
	<h1>Please contact us</h1>
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
			</p>
		{:else if errorMessage}
			<p class="status-text error">
				{errorText}
			</p>
		{/if}
		{#if showSpinner}
			<div class="spinner" />
		{/if}
		<button class="contact-form-btn" type="submit" disabled={formBtnDisable}> Submit </button>
	</form>
</section>
