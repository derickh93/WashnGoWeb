import {createSlice} from "@reduxjs/toolkit";

export const bulkySlice = createSlice({
    name: "bulky",
    initialState: {bulkyArr: new Array(6).fill(0)},
    reducers:{
        incrementBulky: (state,{payload}) => {
            state.bulkyArr[payload] += 1;
        }
        ,
        decrementBulky: (state,{payload}) =>{
            if(state.bulkyArr[payload] > 0){
                state.bulkyArr[payload] -= 1;
            }
        }
        ,
        resetBulky: (state) =>{
            state.bulkyArr = new Array(6).fill(0);
        }
    }
});

export const {incrementBulky,decrementBulky,resetBulky} = bulkySlice.actions;

export default bulkySlice.reducer;