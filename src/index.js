// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import store, { persistor } from './store';

import { isTokenExpired } from "./assets/authUtils";
import authSlice from "./store/authSlice";

const logoutIfTokenExpired = () => {
  const state = store.getState();
  const { isAuthenticated, loginTime } = state.auth;

  if (isAuthenticated && isTokenExpired(loginTime)) {
    store.dispatch(authSlice.actions.logout());
  }
};

logoutIfTokenExpired();

setInterval(logoutIfTokenExpired, 60000*5); // Check every 5 minutes

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
