import {createSlice} from "@reduxjs/toolkit";

export const pickupSlice = createSlice({
    name: "pickup",
    initialState: {pickupDate: '',pickupTime:''},
    reducers:{
        setPickupDate: (state,{payload}) => {
            state.pickupDate = payload;
        }
        ,
        setPickupTime: (state,{payload}) => {
            state.pickupTime = payload;
        }
        ,
        clearPickupTime: (state) =>{
            state.pickupTime = '';
        },
        clearPickupDate: (state) =>{
            state.pickupDate = '';
        },
    }
});

export const {setPickupDate,setPickupTime,clearPickupDate,clearPickupTime} = pickupSlice.actions;

export default pickupSlice.reducer;