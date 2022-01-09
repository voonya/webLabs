<svelte:options immutable={true} />

<script>
  import {
    notes,
    editNoteID,
    popupMsg,
    sizeTitle,
    sizeNote,
    showSpinner,
  } from '../store.js';
  import { errorHandle, validateField } from '../scripts.js';
  import { startFetchMyQuery } from '../../hasura/graphqlScripts.js';
  export let note;
  let textArea;
  let titleInput;
  let dataValid = { title: true, text: true };

  function likeClick() {
    $showSpinner++;
    startFetchMyQuery('updateLike', { id: note.id, liked: !note.liked })
      .then(data => {
        if (data[0]?.message && errorHandle(data[0])) {
          return;
        }
        note.liked = !note.liked;
        const index = $notes.findIndex(el => el.id === note.id);
        $notes[index] = { ...note };
      })
      .catch(() => errorHandle())
      .finally(() => {
        $showSpinner--;
      });
  }

  function deleteClick() {
    let id = note.id;
    if (id === $editNoteID) {
      editNoteID.set(null);
      popupMsg.set('');
    }
    $showSpinner++;
    startFetchMyQuery('deleteNote', { id: note.id })
      .then(data => {
        if (data[0]?.message && errorHandle(data[0])) {
          return;
        }
        // don`t use splice in order to make reactive sub in the shortest way
        $notes = $notes.filter(el => el.id !== id);
      })
      .catch(() => errorHandle())
      .finally(() => {
        $showSpinner--;
      });
  }

  function editNote() {
    if ($editNoteID === note.id || !$editNoteID) {
      editNoteID.set(note.id);
      return;
    }
    popupMsg.set('Save current note before go to another');
    setTimeout(() => popupMsg.set(''), 4000);
  }
  function saveNote() {
    popupMsg.set('');
    Object.keys(dataValid).forEach(el => (dataValid[el] = true));
    if (!validateField(sizeTitle.min, sizeTitle.max, titleInput, 'Title')) {
      dataValid.title = false;
      return;
    }

    if (!validateField(sizeNote.min, sizeNote.max, textArea, 'Text')) {
      dataValid.text = false;
      return;
    }

    $showSpinner++;
    editNoteID.set(null);

    let title = titleInput.value;
    let text = textArea.value;

    startFetchMyQuery('editNote', {
      id: note.id,
      text: text,
      title: title,
    })
      .then(data => {
        if (data[0]?.message && errorHandle(data[0])) {
          return;
        }
        note.title = title;
        note.text = text;
        const index = $notes.findIndex(el => el.id === note.id);
        $notes[index] = { ...note };
      })
      .catch(() => errorHandle())
      .finally(() => {
        $showSpinner--;
      });
  }
  function discardChanges() {
    editNoteID.set(null);
  }
</script>

<div class="note">
  <div class="title">
    {#if $editNoteID === note.id}
      <input
        bind:this={titleInput}
        value={note.title}
        class:invalid={!dataValid.title}
      />
    {:else}
      <h3>{note.title}</h3>
    {/if}

    <span>{note.date}</span>
  </div>
  {#if $editNoteID === note.id}
    <textarea
      bind:this={textArea}
      class="note_text"
      class:invalid={!dataValid.text}>{note.text}</textarea
    >
  {:else}
    <div class="note_text">{note.text}</div>
  {/if}
  <div class="controls">
    {#if $editNoteID === note.id}
      <div class="btn save-btn" on:click={saveNote} />
      <div class="btn delete-btn" on:click={discardChanges} />
    {:else}
      <div
        class="btn like-btn"
        class:liked={note.liked}
        on:click={() => likeClick()}
      />
      <div class="btn edit-btn" on:click={editNote} />
      <div class="btn delete-btn" on:click={deleteClick} />
    {/if}
  </div>
</div>

<style>
  :root {
    --bg-color: #3d3d3d;
    --text-color: #fff;
    --invalid-color: red;
    --button-border: #000;
    --main-color: #aa51f3;
    --save-like-btn-bg: #17e339;
    --delete-btn-bg: #ff0000;
  }
  .note {
    margin-top: 20px;
    padding: 10px 0;
  }
  .title {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    margin-bottom: 20px;
  }
  h3 {
    margin-bottom: 6px;
    font-size: 1.1em;
  }
  .note_text {
    color: var(--text-color);
    margin-bottom: 15px;
    word-wrap: break-word;
    text-align: left;
  }
  .note_text:focus {
    outline: none;
  }
  .controls {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .btn {
    background-repeat: no-repeat;
    background-position: center center;
    height: 32px;
    width: 32px;
    padding: 5px;
    border-radius: 25px;
    border: 2px solid var(--button-border);
    transition: all ease 0.3s;
  }
  .like-btn {
    background-image: url('/static/heart.png');
  }
  .like-btn.liked {
    background-color: var(--save-like-btn-bg);
  }
  .delete-btn {
    background-image: url('/static/cross.png');
    padding: 3px;
  }
  .edit-btn {
    background-image: url('/static/pencil.png');
  }
  .save-btn {
    background-image: url('/static/check.png');
  }

  textarea {
    display: block;
    resize: none;
    height: 150px;
    width: 100%;
    border: none;
    border: 1px solid var(--main-color);
    background-color: var(--bg-color);
  }
  input {
    color: #fff;
    background-color: var(--bg-color);
    border: 1px solid var(--main-color);
    outline: none;
  }
  .invalid {
    border: 2px solid var(--invalid-color);
  }
  @media (min-width: 1024px) {
    h3 {
      font-size: 1.5em;
      margin: 0;
    }

    .title {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
    .btn:hover {
      transform: scale(1.1);
    }
    .like-btn.liked,
    .save-btn:hover {
      background-color: var(--save-like-btn-bg);
    }
    .like-btn.liked:hover {
      background-color: transparent;
    }
    .delete-btn:hover {
      background-color: var(--delete-btn-bg);
    }
    .edit-btn:hover {
      background-color: var(--main-color);
    }
  }
</style>
