import {createSlice} from "@reduxjs/toolkit";

export const accountSlice = createSlice({
    name: "account",
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
        }
    }
});

export const {changeDoorman,changeHotel,changeCode,setDoorCode} = accountSlice.actions;

export default accountSlice.reducer;