import { popupMsg, popupShow } from './store.js';

export function errorHandle(errors) {
  popupShow.set(true);
  if (errors?.message === 'hasura cloud limit of 60 requests/minute exceeded') {
    popupMsg.set('You make a lot of requests. Try later');
    return;
  }
  popupMsg.set('Server Error');
}

export function validateField(min, max, el, name) {
  if (el.value.length < min || el.value.length > max) {
    popupMsg.set(
      `${name} should have more than ${min} symbols and less then ${max}.`
    );
    popupShow.set(true);
    setTimeout(() => popupShow.set(false), 4000);
    return false;
  }
  return true;
}
