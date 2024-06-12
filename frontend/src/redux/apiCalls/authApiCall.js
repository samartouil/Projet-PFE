import {authActions}from "../slices/authSlice";
import request from "../../utils/request";
import { toast } from "react-toastify";


//login
export function loginUser (user){
    return async (dispatch) =>{
        try {
            //{}object structuring
            const {data}= await request.post("/api/auth/login", user)

            //data heya payload 
            dispatch(authActions.login(data));
            localStorage.setItem("userInfo", JSON.stringify(data));
            localStorage.setItem("profilePhoto", JSON.stringify(data.profilePhoto));
            localStorage.setItem("token", data.token);
        } catch (error) {
            toast.error(error.response.data.message);
            
        }
    }

}


//logout
export function logout(){
    return  (dispatch) =>{
        dispatch(authActions.logout());
        localStorage.removeItem("userInfo");
        localStorage.removeItem("profilePhoto");
        localStorage.removeItem("token");
    }

}
//resgister
export function register (user){
    return async (dispatch) =>{try {
        //{}object structuring
        const {data}= await request.post("/api/auth/register", user)

        //data heya payload 
        dispatch(authActions.register(data.message));
        
    } catch (error) {
        toast.error(error.response.data.message);
    }
    }
}