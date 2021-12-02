<script>
  import {
    tweets,
    editTweetID,
    popupMsg,
    popupShow,
    sizeTitle,
    sizeTweet,
    showSpinner,
  } from '../store.js';
  import { errorHandle, validateField } from '../scripts.js';
  import { startFetchMyQuery } from '../../hasura/graphqlScripts.js';

  export let tweet;
  let textArea;
  let titleInput;
  function likeClick() {
    $showSpinner = true;
    startFetchMyQuery('updateLike', { id: tweet.id, liked: !tweet.liked }).then(
      function (data) {
        $showSpinner = false;
        if (data[0]?.message) {
          errorHandle(data[0]);
          return;
        }
        tweet.liked = !tweet.liked;
      }
    );
  }
  function deleteClick() {
    let id = tweet.id;
    if (id === $editTweetID) {
      editTweetID.set(null);
      popupShow.set(false);
    }
    $showSpinner = true;
    startFetchMyQuery('deleteTweet', { id: tweet.id }).then(function (data) {
      $showSpinner = false;
      if (data[0]?.message) {
        errorHandle(data[0]);
        return;
      }
      tweets.set($tweets.filter(tweet => tweet.id != id));
    });
  }

  function editTweet() {
    if ($editTweetID === tweet.id || !$editTweetID) {
      editTweetID.set(tweet.id);
    } else {
      popupMsg.set('Save current tweet before go to another');
      popupShow.set(true);
      setTimeout(() => popupShow.set(false), 4000);
    }
  }
  function saveTweet() {
    popupShow.set(false);
    titleInput.style.border = '1px solid #aa51f3';
    textArea.style.border = '1px solid #aa51f3';

    if (!validateField($sizeTitle.min, $sizeTitle.max, titleInput, 'Title')) {
      titleInput.style.border = '2px solid red';
      return;
    } else if (
      !validateField($sizeTweet.min, $sizeTweet.max, textArea, 'Text')
    ) {
      textArea.style.border = '2px solid red';
      return;
    }

    editTweetID.set(null);
    $showSpinner = true;
    startFetchMyQuery('editTweet', {
      id: tweet.id,
      text: textArea.value,
      title: titleInput.value,
    }).then(function (data) {
      $showSpinner = false;
      if (data[0]?.message) {
        errorHandle(data[0]);
        return;
      }
      tweet.title = titleInput.value;
      tweet.text = textArea.value;
    });
  }
  function discardChanges() {
    editTweetID.set(null);
  }
</script>

<div class="tweet">
  <div class="title">
    {#if $editTweetID === tweet.id}
      <input bind:this={titleInput} value={tweet.title} />
    {:else}
      <h3>{tweet.title}</h3>
    {/if}

    <span>{tweet.date}</span>
  </div>
  {#if $editTweetID === tweet.id}
    <textarea bind:this={textArea} class="tweet_text">{tweet.text}</textarea>
  {:else}
    <div class="tweet_text">{tweet.text}</div>
  {/if}
  <div class="controls">
    {#if $editTweetID === tweet.id}
      <div class="btn save-btn" on:click={() => saveTweet()} />
      <div class="btn delete-btn" on:click={() => discardChanges()} />
    {:else}
      {#if tweet.liked}
        <div class="btn like-btn liked" on:click={() => likeClick()} />
      {:else}
        <div class="btn like-btn" on:click={() => likeClick()} />
      {/if}
      <div class="btn edit-btn" on:click={() => editTweet()} />
      <div class="btn delete-btn" on:click={() => deleteClick()} />
    {/if}
  </div>
</div>

<style>
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
    color: #fff;
    background-color: #3d3d3d;
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
    border: 2px solid #000;
    transition: all ease 0.3s;
  }
  .like-btn {
    background-image: url('/static/heart.png');
  }
  .like-btn.liked {
    background-color: #17e339;
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
    border: 1px solid #aa51f3;
  }
  input {
    color: #fff;
    background-color: #3d3d3d;
    border: 1px solid #aa51f3;
    outline: none;
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
      background-color: #17e339;
    }
    .like-btn.liked:hover {
      background-color: transparent;
    }
    .delete-btn:hover {
      background-color: #ff0000;
    }
    .edit-btn:hover {
      background-color: #aa51f3;
    }
  }
</style>
