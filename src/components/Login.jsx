import React, { useContext, useState } from 'react'
import {  useNavigate, Link } from 'react-router-dom';
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
  e.preventDefault()
  let isValid = validatInput({email,password});
  if(!isValid){return;}

  axios.post('/user/login',{
    email,password
  }).then((res)=>{
    localStorage.setItem('token',res.data.token)
    setUser(res.data.user)
    navigate('/' )
  }).catch((err) => {
    setErrors(prev =>({...prev,api:err.response?.data?.err || 'Login failed'}))
  });
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <div className="w-full max-w-md px-4 relative z-10">
        <div className="bg-slate-900/60 border border-slate-800 backdrop-blur-xl shadow-2xl rounded-3xl px-8 py-10 transform transition-all duration-500">
          
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
               <i className="ri-lock-fill text-3xl text-indigo-400"></i>
            </div>
          </div>

          <h2 className="text-3xl font-extrabold text-white mb-2 text-center tracking-tight">
            Welcome Back
          </h2>
          <p className="text-slate-400 text-center mb-8 text-sm">Sign in to continue to your AI Workspace</p>
          
          {errors.api && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-6 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <i className="ri-error-warning-fill text-red-400"></i>
              <p className="text-red-400 text-sm">
                {typeof errors.api === "string" ? errors.api : "Login failed"}
              </p>
            </div>
          )}

        <form onSubmit={submitHandler} className="space-y-5">
            <InputButton
              label="Email Address"
              id="email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="name@example.com"
              error={errors.email}
            />

            <InputButton
              label="Password"
              id="password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              error={errors.password}
            />

          <button
           type='submit'
           className='w-full p-3.5 mt-2 rounded-xl bg-indigo-600 font-semibold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-500 hover:shadow-indigo-500/50 transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900' >
            Sign In
          </button>
        </form>
        
        <p className="text-slate-400 mt-8 text-center text-sm">
            Don't have an account? {' '}
            <Link to="/register" className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors">Create one</Link>
        </p>
      </div>
    </div>
    
    {/* Decorative background elements */}
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
    </div>
  )
}

export default Login
