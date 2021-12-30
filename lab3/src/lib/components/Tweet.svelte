<svelte:options immutable={true} />

<script>
  import {
    tweets,
    editTweetID,
    popupMsg,
    sizeTitle,
    sizeTweet,
    showSpinner,
  } from '../store.js';
  import { errorHandle, validateField } from '../scripts.js';
  import { startFetchMyQuery } from '../../hasura/graphqlScripts.js';

  export let tweet;
  let textArea;
  let titleInput;
  let dataValid = { title: true, text: true };

  function likeClick() {
    $showSpinner++;
    startFetchMyQuery('updateLike', { id: tweet.id, liked: !tweet.liked })
      .then(data => {
        if (data[0]?.message && errorHandle(data[0])) {
          return;
        }
        tweet.liked = !tweet.liked;
      })
      .catch(()=>errorHandle())
      .finally(() => {
        $showSpinner--;
      });
  }

  function deleteClick() {
    let id = tweet.id;
    if (id === $editTweetID) {
      editTweetID.set(null);
      popupMsg.set('');
    }
    $showSpinner++;
    startFetchMyQuery('deleteTweet', { id: tweet.id })
      .then(data => {
        if (data[0]?.message && errorHandle(data[0])) {
          return;
        }
        //tweets.set($tweets.filter(tweet => tweet.id != id));
        /* you recommend to remove tweet with splice */
        let index = $tweets.findIndex((el) => el.id === id);
        $tweets.splice(index, 1);
      })
      .catch(()=>errorHandle())
      .finally(() => {
        $showSpinner--;
      });
  }

  function editTweet() {
    if ($editTweetID === tweet.id || !$editTweetID) {
      editTweetID.set(tweet.id);
      return;
    }
    popupMsg.set('Save current tweet before go to another');
    setTimeout(() => popupMsg.set(''), 4000);
  }
  function saveTweet() {
    popupMsg.set('');
    Object.keys(dataValid).forEach(el => (dataValid[el] = true));
    if (!validateField(sizeTitle.min, sizeTitle.max, titleInput, 'Title')) {
      dataValid.title = false;
      return;
    }

    if (!validateField(sizeTweet.min, sizeTweet.max, textArea, 'Text')) {
      dataValid.text = false;
      return;
    }

    $showSpinner++;
    editTweetID.set(null);

    let title = titleInput.value;
    let text = textArea.value;

    startFetchMyQuery('editTweet', {
      id: tweet.id,
      text: text,
      title: title,
    })
      .then(data => {
        if (data[0]?.message && errorHandle(data[0])) {
          return;
        }
        tweet.title = title;
        tweet.text = text;
      })
      .catch(()=>errorHandle())
      .finally(() => {
        $showSpinner--;
      });
  }
  function discardChanges() {
    editTweetID.set(null);
  }
</script>

<div class="tweet">
  <div class="title">
    {#if $editTweetID === tweet.id}
      <input
        bind:this={titleInput}
        value={tweet.title}
        class:invalid={!dataValid.title}
      />
    {:else}
      <h3>{tweet.title}</h3>
    {/if}

    <span>{tweet.date}</span>
  </div>
  {#if $editTweetID === tweet.id}
    <textarea
      bind:this={textArea}
      class="tweet_text"
      class:invalid={!dataValid.text}
      >{tweet.text}</textarea
    >
  {:else}
    <div class="tweet_text">{tweet.text}</div>
  {/if}
  <div class="controls">
    {#if $editTweetID === tweet.id}
      <div class="btn save-btn" on:click={() => saveTweet()} />
      <div class="btn delete-btn" on:click={() => discardChanges()} />
    {:else}
      <div
        class="btn like-btn {tweet.liked ? 'liked' : ''}"
        on:click={() => likeClick()}
      />
      <div class="btn edit-btn" on:click={() => editTweet()} />
      <div class="btn delete-btn" on:click={() => deleteClick()} />
    {/if}
  </div>
</div>

<style>
  :root{
    --bg-color: #3d3d3d;
    --text-color: #fff;
    --invalid-color: red;
    --button-border: #000;
    --main-color: #aa51f3;
    --save-like-btn-bg: #17e339;
    --delete-btn-bg: #ff0000;
  }
  .tweet {
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
  .tweet_text {
    color: var(--text-color);
    margin-bottom: 15px;
    word-wrap: break-word;
  }
  .tweet_text:focus {
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
