<script context="module">
  export const ssr = false;
</script>

<script>
  import { startFetchMyQuery } from '../hasura/graphqlScripts.js';
  import {
    tweets,
    popupShow,
    sizeTitle,
    sizeTweet,
    showSpinner,
  } from '../lib/store.js';
  import Tweet from '../components/Tweet.svelte';
  import Popup from '../components/Popup.svelte';
  import { operationStore, subscription, setClient } from '@urql/svelte';
  import {
    createClient,
    defaultExchanges,
    subscriptionExchange,
  } from '@urql/core';
  import { createClient as createWSClient } from 'graphql-ws';
  import { errorHandle, validateField } from '../lib/scripts.js';
  import Spinner from '../components/Spinner.svelte';
  const wsClient = createWSClient({
    url: import.meta.env.VITE_API_WSS_ENDPOINT,
    reconnect: true,
    connectionParams: {
      headers: {
        'content-type': 'application/json',
        'x-hasura-admin-secret': import.meta.env.VITE_HASURA_ADMIN,
      },
    },
  });

  const client = createClient({
    url: import.meta.env.VITE_API_HTTPS_ENDPOINT,
    exchanges: [
      ...defaultExchanges,
      subscriptionExchange({
        forwardSubscription: operation => ({
          subscribe: sink => ({
            unsubscribe: wsClient.subscribe(operation, sink),
          }),
        }),
      }),
    ],
  });

  setClient(client);

  let form;
  let showCreateTweetLoader = false;
  let popup;
  let text;
  let title;
  const tw = operationStore(`
		subscription newQ {
				tweets(order_by: {time: desc}) {
					date
					id
					liked
					text
					title
				}
			}`);
  const handleSubscription = (tw = [], data) => {
    tw = [...data.tweets];
    tweets.set(tw);
    return tw;
  };
  function loadAllTweets() {
    $showSpinner = true;
    startFetchMyQuery('loadTweets').then(function (data) {
      $tweets = [...data.tweets];
      $showSpinner = false;
    });
    subscription(tw, handleSubscription);
  }

  loadAllTweets();

  function createTweet() {
    let tweet = {};

    Array.from(form.elements).forEach(e => {
      const key = e.name;
      const value = e.value;
      tweet[key] = value;
    });

    title.style.border = 'none';
    text.style.border = 'none';

    if (!validateField($sizeTitle.min, $sizeTitle.max, title, 'Title')) {
      title.style.border = '2px solid red';
      return;
    } else if (!validateField($sizeTweet.min, $sizeTweet.max, text, 'Text')) {
      text.style.border = '2px solid red';
      return;
    }

    showCreateTweetLoader = true;
    startFetchMyQuery('addTweet', {
      title: tweet.title,
      text: tweet.text,
    }).then(function (data) {
      showCreateTweetLoader = false;
      if (data[0]?.message) {
        errorHandle(data[0]);
        return;
      }
      tweet.id = data.insert_tweets_one.id;
      tweet.date = data.insert_tweets_one.date;
      tweet.liked = false;
      $tweets = [tweet, ...$tweets];
    });
  }
</script>

<div class="wrapper">
  <div class="container">
    <h1>MiniTwitter</h1>
    <div class="add-menu">
      {#if showCreateTweetLoader}
        <Spinner />
      {:else}
        <form on:submit|preventDefault={createTweet} bind:this={form}>
          <input name="title" placeholder="Title" bind:this={title} />
          <textarea
            name="text"
            placeholder="Type you tweet here"
            bind:this={text}
          />
          <button type="submit">Create</button>
        </form>
      {/if}
    </div>
    <div class="tweets">
      {#if $showSpinner}
        <Spinner />
      {:else}
        {#each $tweets as tweet}
          <Tweet {tweet} />
        {/each}
      {/if}
    </div>
    {#if $popupShow}
      <Popup bind:this={popup} />
    {/if}
  </div>
</div>

<style>
  .container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 30px 0;
  }
  h1 {
    text-align: center;
  }
  .tweets {
    padding-top: 60px;
    max-width: 70%;
    margin: 0 auto;
  }

  input,
  textarea,
  button {
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
    padding: 7px 20px;
    border-radius: 10px;
    border: none;
    background-color: #17e339;
    color: #fff;
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

  @media (max-width: 960px) {
    .container {
      font-size: 14px;
      max-width: 100%;
      padding: 20px;
    }
    .tweets {
      max-width: 100%;
    }
  }
</style>
