import {configureStore} from "@reduxjs/toolkit";
import dryCleanReducer from "./dry-clean-qty"
import washReducer from "./wash-qty"
export default configureStore({
    reducer: {
        dryClean: dryCleanReducer,
        wash: washReducer
    }
})