import {createSlice} from "@reduxjs/toolkit";

export const dryCleanSlice = createSlice({
    name: "dryClean",
    initialState: {arr: new Array(20).fill(0)},
    reducers:{
        increment: (state,{payload}) => {
            state.arr[payload] += 1;
        }
        ,
        decrement: (state,{payload}) =>{
            state.arr[payload] -= 1;
        }
    }
});

export const {increment,decrement} = dryCleanSlice.actions;

export default dryCleanSlice.reducer;