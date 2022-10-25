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
            if(state.arrWash[payload] > 0){
                state.arrWash[payload] -= 1;
            }
        }
        ,
        resetWash: (state) =>{
            state.arrWash = new Array(3).fill(0);
        }
    }
});

export function sumArrWash(state) {

    return state.wash.arrWash.reduce((accumulator, value) => {
        return accumulator + value;
      }, 0);
}

export const {incrementWash,decrementWash,resetWash} = washSlice.actions;

export default washSlice.reducer;