import{ createSlice} from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    //el etat initiail
    initialState: {
        user: localStorage.getItem("userInfo") ?
        JSON.parse(localStorage.getItem("userInfo")) : null,
        registerMessage: null,
    },
    //elli ybadel, yekhou el etat wel action eli bech tetamal
    reducers:{
        login(state,action){
            state.user= action.payload;
        },
        logout(state){
            state.user= null;
        },
        register(state,action){
            state.registerMessage = action.payload;
        },
        setUsername(state,action){
            state.user.username = action.payload;
        }

    }
});

const authReducer = authSlice.reducer;
const authActions = authSlice.actions;

export {authActions, authReducer}