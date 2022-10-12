import {createSlice} from "@reduxjs/toolkit";

export const washSlice = createSlice({
    name: "wash",
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

export const {increment,decrement} = washSlice.actions;

export default washSlice.reducer;