import { writable } from 'svelte/store';

export const tweets = writable([]);
export const editTweetID = writable(null);
export const popupMsg = writable('All is good');
export const popupShow = writable(false);
export const showSpinner = writable(false);
export const sizeTitle = writable({ min: 3, max: 30 });
export const sizeTweet = writable({ min: 10, max: 450 });
