import {createSlice} from "@reduxjs/toolkit";

export const washSlice = createSlice({
    name: "wash",
    initialState: {arrWash: new Array(3).fill(0)},
    reducers:{
        incrementWash: (state,{payload}) => {
            state.arrWash[payload] += 1;
        }
        ,
        decrementWash: (state,{payload}) =>{
            state.arrWash[payload] -= 1;
        }
    }
});

export const {incrementWash,decrementWash} = washSlice.actions;

export default washSlice.reducer;