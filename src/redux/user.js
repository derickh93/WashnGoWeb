import {createSlice} from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: {id:'',name:'',phone:'',email:'',shipping:'',contact:'',zip:''},
    reducers:{
        setId: (state,{payload}) => {
            state.id = payload;
        }
        ,
        clearID: (state) =>{
            state.id = '';
        },

        setName: (state,{payload}) => {
            state.name = payload;
        }
        ,
        clearName: (state) =>{
            state.name = '';
        },

        setPhone: (state,{payload}) => {
            state.phone = payload;
        }
        ,
        clearPhone: (state) =>{
            state.phone = '';
        },

        setEmail: (state,{payload}) => {
            state.email = payload;
        }
        ,
        clearEmail: (state) =>{
            state.email = '';
        },

        setShipping: (state,{payload}) => {
            state.shipping = payload;
        }
        ,
        clearShipping: (state) =>{
            state.shipping = '';
        },
        setContact: (state,{payload}) => {
            state.contact = payload;
        }
        ,
        clearContact: (state) =>{
            state.contact = '';
        }
    }
});

export const {setEmail,setId,setName,setPhone,setShipping,clearEmail,clearID,clearName,clearPhone,clearShipping,setContact,clearContact} = userSlice.actions;

export default userSlice.reducer;