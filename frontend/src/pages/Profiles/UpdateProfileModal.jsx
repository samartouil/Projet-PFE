import { useState } from "react";

const user={
    username:"samar",
    phone: "+216 52812107",
}

const UpdateProfileModal=({setUpdateProfile}) =>{
    const [username , setUsername]= useStateState(user.username);
    const [email , setEmail]= useState(user.email);
    const [password , setPassword]= useState("");
    const [phone, setPhone]= useState(user.phone);
   
    const formSubmitHandler = (e) => {
        e.preventDefault();

        const updatedUser ={username, email, phone}

        if(password.trim()!==""){
            updatedUser.password =password;
        }
        console.log(updatedUser);
    }
    
}
