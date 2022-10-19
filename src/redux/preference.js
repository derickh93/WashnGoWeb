import {createSlice} from "@reduxjs/toolkit";

export const preferenceSlice = createSlice({
    name: "preference",
    initialState: {additional:'',detergentScent:''},
    reducers:{
        setAdditional: (state,{payload}) => {
            state.additional = payload;
        }
        ,
        clearAdditional: (state) =>{
            state.additional = '';
        },

        setDetergentScent: (state,{payload}) => {
            state.detergentScent = payload;
        }
        ,
        clearDetergentScent: (state) =>{
            state.detergentScent = '';
        }
    }
});

export const {setAdditional,clearAdditional,setDetergentScent,clearDetergentScent} = preferenceSlice.actions;

export default preferenceSlice.reducer;