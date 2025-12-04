import { useState } from "react";

export default function useAuthentication(){
 const [errors,setErrors] = useState({}

    )


const validatInput =({email,password})=>{
         const newErrors = {}
    
    if(!email ||email.trim() ===""){
        newErrors.email='Enter Your email';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Enter a valid email";
 
    }

     if( !password ||password.trim() ===""){
        newErrors.password = 'Enter Your password';
    }else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      newErrors.password = "Password must include a special character";
    }else if(password.length<5){
         newErrors.password='Password is too short'
    }

setErrors(newErrors)

return Object.keys(newErrors).length ===0;

}
return{
    errors,setErrors,validatInput
}

}