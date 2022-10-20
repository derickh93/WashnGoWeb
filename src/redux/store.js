import {configureStore} from "@reduxjs/toolkit";
import dryCleanReducer from "./dry-clean-qty"
import washReducer from "./wash-qty"
import preferenceReducer from "./preference"
import pickupReducer from "./pickup"
import storage from "redux-persist/lib/storage";
import accountPrefReducer from "./account-prefs"
import accountReducer from "./account"

import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from 'redux-persist';
  import { combineReducers,getDefaultMiddleware} from "@reduxjs/toolkit";

const persistConfig = {
    key: "root",
    version: 1,
    storage
};

const reducer = combineReducers({
    dryClean: dryCleanReducer,
    wash: washReducer,
    preference: preferenceReducer,
    pickup: pickupReducer,
    accountPref: accountPrefReducer,
    account: accountReducer
})

const persistedReducer = persistReducer(persistConfig,reducer)


export default configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
})