import {createSlice} from "@reduxjs/toolkit";

export const accountPrefSlice = createSlice({
    name: "accountPref",
    initialState: {doorman:false,hotel:false,code: false,code_door:''},
    reducers:{
        changeDoorman: (state) => {
            state.doorman = !state.doorman;
        }
        ,
        changeHotel: (state) => {
            state.hotel = !state.hotel;
        }
        ,
        changeCode: (state) => {
            state.code = !state.code;
        }
        ,
        setDoorCode: (state,{payload}) => {
            state.code_door = payload;
        },
        resetAccountPrefs: (state,{payload}) => {
            state.code = false;
            state.doorman = false;
            state.hotel = false;
            state.code_door = '';
        }
    }
});

export const {changeDoorman,changeHotel,changeCode,setDoorCode,resetAccountPrefs} = accountPrefSlice.actions;

export default accountPrefSlice.reducer;