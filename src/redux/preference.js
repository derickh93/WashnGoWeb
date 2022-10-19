import {createSlice} from "@reduxjs/toolkit";

export const preferenceSlice = createSlice({
    name: "preference",
    initialState: {additional:''},
    reducers:{
        setAdditional: (state,{payload}) => {
            state.additional = payload;
        }
        ,
        clearAdditional: (state) =>{
            state.additional = '';
        }
    }
});

export const {setAdditional,clearAdditional} = preferenceSlice.actions;

export default preferenceSlice.reducer;