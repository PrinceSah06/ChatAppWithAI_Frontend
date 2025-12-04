import React, { useContext, useState } from 'react'
import {  useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from '../config/axios.js';
import {UserContext} from '../context/user.context.jsx'
import useAuthentication from '../hooks/useValidation.jsx';
import InputButton from './InputButton.jsx';
function Login() {
  const [ email , setEmail ] = useState('');
  const [ password , setPassword ] = useState('');

  const { setUser } = useContext(UserContext)

  const{ errors,setErrors,validatInput} = useAuthentication()


const navigate = useNavigate()


function submitHandler(e){
  console.log('inside login submit hendlerfunction')
  e.preventDefault()
  let isValid = validatInput({email,password});
   console.log("isValid", isValid, "errors", errors);

   if(!isValid){return;}

  axios.post('/user/login',{
    email,password
  }).then((res)=>{
    console.log(res.data)

    localStorage.setItem('token',res.data.token)
    setUser(res.data.user)

    navigate('/' )
  }).catch((err) => {
  console.log('error :', err?.response?.data.err);
  setErrors(prev =>({...prev,api:err.response.data.err}))
  // optionally show message:
  // alert(err?.response?.data?.message || 'Login failed');
});
}



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
      <div className="w-full max-w-md px-4">
        <div className="bg-slate-900/80 border border-slate-700/60 backdrop-blur-md shadow-2xl rounded-2xl px-8 py-10">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Login
          </h2>
                 {errors.api && (
  <p className="text-red-400 text-sm mb-3">
    {typeof errors.api === "string" ? errors.api : "Registration failed"}
  </p>
)}
        <form 
        onSubmit={submitHandler}
        >
          <div className="mb-4">
                <InputButton
            label="Email"
            id="email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="Enter your email"
            error={errors.email}
          />

          <InputButton
            label="Password"
            id="password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="Enter your password"
            error={errors.password}
          /></div>
          <button
           type='submit'
          
          className='w-full p-3 rounded bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white hover:bg-blue-600 ' >
            Login
          </button>
        </form>
              <p className="text-gray-400 mt-4">
                    Don't have an account? 
                    <Link to="/register" className="text-blue-500 hover:underline">Create one</Link>
                </p>
      </div>
      
    </div>
    </div>
  )
}

export default Login
