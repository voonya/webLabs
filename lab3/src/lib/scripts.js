import { popupMsg } from './store.js';

export function errorHandle(errors) {
  if (errors?.message === 'hasura cloud limit of 60 requests/minute exceeded') {
    popupMsg.set('You make a lot of requests. Try later');
    return true;
  }
  popupMsg.set('Server Error');
  return true;
}

let timeout;

export function validateField(min, max, el, name) {
  if (el.value.length < min || el.value.length > max) {
    popupMsg.set(
      `${name} should have more than ${min} symbols and less then ${max}.`
    );
    clearTimeout(timeout);
    timeout = setTimeout(() => popupMsg.set(''), 4000);
    return false;
  }
  return true;
}
