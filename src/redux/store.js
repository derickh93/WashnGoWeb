import {configureStore} from "@reduxjs/toolkit";
import dryCleanReducer from "./dry-clean-qty"
import washReducer from "./wash-qty"
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";

const persistConfig = {
    key: "root",
    version: 1,
    storage
};

const reducer = combineReducers({
    dryClean: dryCleanReducer,
    wash: washReducer
})

const persistedReducer = persistReducer(persistConfig,reducer)


export default configureStore({
    reducer: persistedReducer
})