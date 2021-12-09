import { writable } from 'svelte/store';

export const tweets = writable([]);
export const editTweetID = writable(null);
export const popupMsg = writable('');
export const showSpinner = writable(false);
export const sizeTitle = { min: 3, max: 30 };
export const sizeTweet = { min: 10, max: 450 };
