<script context="module">
  export const ssr = false;
</script>

<script>
  import { startFetchMyQuery } from '../hasura/graphqlScripts.js';
  import {
    notes,
    sizeTitle,
    sizeNote,
    showSpinner,
    popupMsg,
    isAuthenticated,
    token,
    isOnline,
  } from '../lib/store.js';
  import Note from '../lib/components/Note.svelte';
  import Popup from '../lib/components/Popup.svelte';
  import { errorHandle, validateField } from '../lib/scripts.js';
  import Spinner from '../lib/components/Spinner.svelte';

  import { onMount } from 'svelte';
  import auth from '../lib/auth';

  window.onoffline = () => {
    isOnline.set(false);
  };
  window.ononline = () => {
    isOnline.set(true);
  };

  let auth0Client;

  onMount(async () => {
    showLoader = true;
    auth0Client = await auth.createClient();

    $isAuthenticated = await auth0Client.isAuthenticated();

    const authToken = await auth0Client.getIdTokenClaims();
    $token = authToken?.__raw ?? '';

    showLoader = false;
    if ($token !== '') {
      loadAllNotes();
    }
  });

  token.subscribe(async value => {
    if (value !== '') {
      loadAllNotes();
    }
  });

  function login() {
    auth.loginWithPopup(auth0Client);
  }

  function logout() {
    auth.logout(auth0Client);
    $isAuthenticated = false;
    $token = '';
  }

  let form;
  let showLoader = false;
  let popup;
  let text;
  let title;
  let dataValid = { title: true, text: true };

  function loadAllNotes() {
    $showSpinner++;
    startFetchMyQuery('loadNotes')
      .then(data => {
        if (data[0]?.message && errorHandle(data[0])) {
          return;
        }
        console.log(data);
        $notes = [...data.lab5_notes];
      })
      .catch(() => errorHandle())
      .finally(() => {
        $showSpinner--;
      });
  }

  function createNote() {
    let note = {};

    Array.from(form.elements)
      .filter(e => e.nodeName !== 'BUTTON')
      .forEach(e => (note[e.name] = e.value));
    Object.keys(dataValid).forEach(el => (dataValid[el] = ''));
    if (!validateField(sizeTitle.min, sizeTitle.max, title, 'Title')) {
      dataValid.title = 'invalid';
      return;
    }

    if (!validateField(sizeNote.min, sizeNote.max, text, 'Text')) {
      dataValid.text = 'invalid';
      return;
    }

    showLoader = true;
    startFetchMyQuery('addNote', {
      title: note.title,
      text: note.text,
    })
      .then(data => {
        if (data[0]?.message && errorHandle(data[0])) {
          return;
        }
        note.id = data.insert_lab5_notes_one.id;
        note.date = data.insert_lab5_notes_one.date;
        note.liked = false;
        $notes = [note, ...$notes];
      })
      .catch(() => errorHandle())
      .finally(() => {
        showLoader = false;
      });
  }
</script>

<div class="wrapper">
  <div class="container">
    {#if $isOnline}
      <header>
        <h1>YourNotes</h1>
        {#if $isAuthenticated}
          <button disabled={showLoader} on:click={() => logout()}>Logout</button
          >
        {:else}
          <button disabled={showLoader} on:click={() => login()}>Login</button>
        {/if}
      </header>

      <div class="add-menu">
        {#if showLoader}
          <Spinner />
        {:else if $isAuthenticated}
          <form on:submit|preventDefault={createNote} bind:this={form}>
            <input
              name="title"
              placeholder="Title"
              bind:this={title}
              class={dataValid.title}
            />
            <textarea
              name="text"
              placeholder="Type you note here"
              bind:this={text}
              class={dataValid.text}
            />
            <button type="submit">Create</button>
          </form>
        {:else}
          <h2>To manipulate Notes please Login or Register</h2>
        {/if}
      </div>
      {#if $isAuthenticated}
        <div class="notes">
          {#if $showSpinner}
            <Spinner />
          {:else}
            {#each $notes as note (note.id)}
              <Note {note} />
            {/each}
          {/if}
        </div>
      {/if}
      {#if $popupMsg}
        <Popup bind:this={popup} />
      {/if}
    {:else}
      <h2>Oops. Check your internet connection</h2>
    {/if}
  </div>
</div>

<style>
  :root {
    --invalid-color: red;
    --btn-bg: #17e339;
    --text-color: #fff;
    --btn-disable: rgba(51, 197, 75, 0.5);
  }
  .container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 30px 0;
    text-align: center;
  }
  h1 {
    text-align: center;
  }
  .notes {
    padding-top: 60px;
    max-width: 70%;
    margin: 0 auto;
  }

  header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  input,
  textarea {
    display: block;
    margin-bottom: 15px;
  }
  input,
  textarea {
    width: 100%;
  }
  textarea {
    resize: none;
    height: 200px;
  }
  button {
    display: block;
    padding: 7px 20px;
    border-radius: 10px;
    border: none;
    background-color: var(--btn-bg);
    color: var(--text-color);
  }
  form {
    width: 500px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .add-menu {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 150px;
  }
  .invalid {
    border: 2px solid var(--invalid-color);
  }

  button:disabled {
    background-color: var(--btn-disable);
  }
  @media (max-width: 960px) {
    .container {
      font-size: 14px;
      max-width: 100%;
      padding: 20px;
    }
    .notes {
      max-width: 100%;
    }
  }
</style>
