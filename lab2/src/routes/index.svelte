<script context="module">
  export const prerender = true;
</script>

<script>
  let showSpinner = false;
  let statusMessage = false;
  let errorMessage = false;
  let formBtnDisable = false;
  let form;
  let contactFormHandler = async e => {
    statusMessage = false;
    formBtnDisable = true;
    showSpinner = true;
    errorMessage = false;
    
    const data = Object.fromEntries(Array.from(form.elements)
    .filter(( element ) => element.tagName !== 'BUTTON')
    .map(el => [el.name, el.value]));
    console.log(data);
    try {
      let res = await fetch('/api/sendmail', {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        method: 'POST',
      });
      if (!res.ok) {
        throw res;
      }
      form.reset();
      statusMessage = true;
      return response;
    } catch (error) {
      if (error.status === 400) {
        errorMessage = 'No message';
      } else if (error.status === 429) {
        errorMessage = 'You sent mail a lot of times';
      } else {
        errorMessage = 'Server error';
      }
      formBtnDisable = false;
    } finally {
      showSpinner = false;
    }
  };
</script>

<section>
  <h1>Please contact us</h1>
  <form
    class="contact-form"
    bind:this={form}
    on:submit|preventDefault={contactFormHandler}
  >
    <input
      class="contact-form-input"
      type="text"
      placeholder="Name"
      name="userName"
      required
    />
    <input
      class="contact-form-input"
      type="email"
      placeholder="Email"
      name="userMail"
      required
    />
    <textarea
      name="userMessage"
      id="text-mail"
      cols="30"
      rows="10"
      placeholder="Type your text here"
      required
    />

    {#if statusMessage}
      <p class="status-text success">Message sent!</p>
    {:else if errorMessage}
      <p class="status-text error">
        {errorMessage}
      </p>
    {/if}
    {#if showSpinner}
      <div class="spinner" />
    {/if}
    <button class="contact-form-btn" type="submit" disabled={formBtnDisable}>
      Submit
    </button>
  </form>
</section>
