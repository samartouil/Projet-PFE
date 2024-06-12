import {profileActions}from "../slices/profileSlice";
import request from "../../utils/request";
import { toast } from "react-toastify";
import { authActions } from "../slices/authSlice";





//get user profile
export function getUserProfile (userId){
    return async (dispatch) =>{
        try {
            //{}object structuring
            const {data}= await request.get(`/api/users/profile/${userId} `);

            //data heya payload 
            dispatch(profileActions.setProfile(data));
          
        } catch (error) {
            toast.error(error.response.data.message);
            
        }
    }

}


//upload profile photo
export function uploadProfilePhoto (newPhoto){
    return async (dispatch,getState) =>{
        try {
           
            //{}object structuring
            const {data}= await request.post(`/api/users/profile/profile-photo-upload `, newPhoto, {
                headers:{
                    //Authorization: "Bearer " + getState().auth.user.token,
                    "Content-Type": "multipart/form-data",
                }
            });
            
            if (!data) {
                // Handle error case
                return;
              }

            //data heya payload 
            dispatch(profileActions.setProfilePhoto(data.profilePhoto));
            
            toast.success(data.message);
          
        } catch (error) {
            toast.error(error.response.data.message);
            
        }
    }

}

//update profile
export function updateProfile(userId, profile){
    return async (dispatch, getState) => {
        try{
            
            const {data}= await request.put(`/api/users/profile/${userId}`,profile,
                {
                    headers:{
                        Authorization: "Bearer " + getState().auth.user.token,
                    },
                }
            );
            if (!data) {
                
            dispatch(profileActions.updateProfile(data));
            dispatch(authActions.setUsername(data.username));
            //modify the user in local storage with new username
            const user= JSON.parse(localStorage.getItem("userInfo"));
            user.username = data?.username;
            localStorage.setItem("userInfo", JSON.stringify(user));
        }else {
            throw new Error("No data received from server");
        }
        }catch (error){
            const errorMessage = error.response?.data?.message || error.message || "An error occurred";
            toast.error(errorMessage);
        }
    };
}