import createAuth0Client from '@auth0/auth0-spa-js';
import { isAuthenticated, popupOpen, token } from './store';
import config from './auth_config';
import { errorHandle } from './scripts';
async function createClient() {
  return createAuth0Client({
    domain: config.domain,
    client_id: config.clientId,
  });
}

async function loginWithPopup(client, options) {
  popupOpen.set(true);
  try {
    await client.loginWithPopup(options);

    const authToken = await client.getIdTokenClaims();
    token.set(authToken.__raw);
    isAuthenticated.set(true);
  } catch (e) {
    errorHandle(e);
  } finally {
    popupOpen.set(false);
  }
}

function logout(client) {
  return client.logout();
}

const auth = {
  createClient,
  loginWithPopup,
  logout,
};

export default auth;
