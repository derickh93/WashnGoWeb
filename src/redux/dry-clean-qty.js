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
            if(state.arr[payload] > 0){
                state.arr[payload] -= 1;
            }
        }
        ,
        resetDry: (state) =>{
            state.arr = new Array(20).fill(0);
        }
    }
});

export function sumDryCleanArr(state) {
    return state.dryClean.arr.reduce((accumulator, value) => {
        return accumulator + value;
      }, 0);}
export const {increment,decrement,resetDry} = dryCleanSlice.actions;

export default dryCleanSlice.reducer;