import { configureStore } from '@reduxjs/toolkit'
import menuReducer from './menuSlice'
import screenReducer from "./screenSlice";
import windowsReducer from "./windowsSlice";
import settingsReducer from "./settingsSlice";
import authReducer from "./authSlice.js";
import localforage from "localforage";

async function loadFromLocalStorage() {
  try {
    const serialisedState = await localforage.getItem("persistantState");
    if (!serialisedState) return undefined;
    return JSON.parse(serialisedState);
  } catch (e) {
    console.warn(e);
    return undefined;
  }
}

async function saveToLocalStorage(state) {
  try {
    const serialisedState = JSON.stringify(state);
    await localforage.setItem("persistantState", serialisedState);
  } catch (e) {
    console.error(e);
  }
}

const store = configureStore({
  reducer: {
    menu: menuReducer,
    screen: screenReducer,
    windows: windowsReducer,
    settings: settingsReducer,
    auth: authReducer,
  },
  preloadedState: await loadFromLocalStorage()
});

store.subscribe(async () => 
  await saveToLocalStorage(store.getState())
);

export default store;
