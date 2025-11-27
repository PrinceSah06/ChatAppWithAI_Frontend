import React, { useContext, useState } from 'react'
import {  useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from '../config/axios.js';
import {UserContext} from '../context/user.context.jsx'
function Login() {
  const [ email , setEmail ] = useState('');
  const [ password , setPassword ] = useState('');

  const { setUser } = useContext(UserContext)


const navigate = useNavigate()


function submitHandler(e){
  e.preventDefault()
   
  axios.post('/user/login',{
    email,password
  }).then((res)=>{
    console.log(res.data)

    localStorage.setItem('token',res.data.token)
    setUser(res.data.user)

    navigate('/' )
  }).catch((err) => {
  console.log('error :', err?.response?.data);
  // optionally show message:
  // alert(err?.response?.data?.message || 'Login failed');
});
}



  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-900'>
      <div className="bg-gray-800 p-8 rounded-lg shadowo-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6">Login</h2>
        <form 
        onSubmit={submitHandler}
        >
          <div className="mb-4">
            <label className="block text-gray-400 mb-2 " htmlFor='email'>Email

            </label>
            <input onChange={(e)=> setEmail(e.target.value)}
            type='email'
            id='email'
            placeholder='Enter your emial'
            className='w-full p-3 rounded bg-gary-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'>
            </input>
          </div>
             <div className="mb-4">
            <label className="block text-gray-400 mb-2 " htmlFor='password'>Email

            </label>
            <input onChange={(e)=> setPassword(e.target.value)}
            type='password'
            id='password'
            placeholder='Enter your password'
            className='w-full p-3 rounded bg-gary-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'>
            </input>
          </div>
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
  )
}

export default Login
