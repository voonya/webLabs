import { writable } from 'svelte/store';

export const notes = writable([]);
export const editNoteID = writable(null);
export const popupMsg = writable('');
export const showSpinner = writable(0);
export const sizeTitle = { min: 3, max: 30 };
export const sizeNote = { min: 10, max: 450 };

// auth
export const isAuthenticated = writable(false);
export const popupOpen = writable(false);

export const token = writable('');

export const isOnline = writable(true);
