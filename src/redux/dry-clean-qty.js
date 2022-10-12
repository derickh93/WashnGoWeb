import {createSlice} from "@reduxjs/toolkit";

export const dryCleanSlice = createSlice({
    name: "dryClean",
    initialState: {arr: new Array(20).fill(90)},
    reducers:{
        increment: (state,idx) => {
            state.arr[idx] += 1;
        }
        ,
        decrement: (state,idx) =>{
            state.arr[idx] -= 1;
        }
    }
});

export const {increment,decrement} = dryCleanSlice.actions;

export default dryCleanSlice.reducer;