import React ,{useContext, useEffect, useState} from  'react';
import { UserContext } from '../context/user.context';
import { useNavigate } from 'react-router-dom';

function UserAuth( {children}) {

    const navigate = useNavigate()

    const {user} = useContext(UserContext);

    const [loading ,setLoading] = useState(true);
    const token = localStorage.getItem('token')
// if(user){
//     setLoading(false)
// }

 

    useEffect(()=>{
        if(!token){
            navigate('/login')

        }else        if(!user){
            navigate("login")
        }else{  setLoading(false)}
        
    },[token,user,navigate])
       if(loading){
        return  <div> Loading ...</div>
    }
  return (<>{
        children}</>
      
    
  )
}

export default UserAuth
