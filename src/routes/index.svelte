<script context="module">
  export const prerender = true;
</script>

<script>
  let showSpinner = false;
  let statusMessage = false;
  let errorMessage = false;
  let formBtnDisable = false;
  let errorText = '';
  let form;
  let contactFormHandler = async (e) => {
    statusMessage = false;
    formBtnDisable = true;
    showSpinner = true;

    const data = {};
    Array.from(form.elements).forEach((e) => {
      const key = e.name;
      const value = e.value;
      data[key] = value;
    });
    try {
      let res = await fetch('/api/sendmail', {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        method: 'POST',
      }).then((res) => {
        if (res.status === 200 && res.ok) {
          return res;
        }
        throw res;
      });
      statusMessage = true;
      showSpinner = false;
      formBtnDisable = false;
      e.target.reset();
    } catch (error) {
      if (error.status === 400) {
        errorText = 'No message';
      } else if (error.status === 429) {
        errorText = 'You sent mail a lot of times';
      } else {
        errorText = 'Server error';
      }
      errorMessage = true;
      showSpinner = false;
      formBtnDisable = false;
      statusMessage = false;
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
        {errorText}
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
