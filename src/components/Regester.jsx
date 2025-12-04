import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/user.context";
import axios from "../config/axios";
import InputButton from "./InputButton";
import useAuthentication from "../hooks/useValidation";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setUser } = useContext(UserContext);

  const navigate = useNavigate();
const { errors,setErrors,validatInput } = useAuthentication()
  function submitHandler(e) {
    e.preventDefault();
const isValid = validatInput({email,password})

if(!isValid){
  return;
}
    axios
      .post("/user/register", {
        email,
        password,
      })
      .then((res) => {
        console.log("this is response while register user", res);
        console.log(res.data);
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        navigate("/");
      })
      .catch((err) => {
        setErrors(prev =>({...prev,api:err.response.data}))
        console.log(err.response.data.err);
        console.log('whole error obj :' ,err)
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
        <form onSubmit={submitHandler}>
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
          />

          <button
            type="submit"
         className="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-blue-500 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition"
          >
            Register
          </button>
        </form>
     
  <p className="mt-6 text-center text-sm text-slate-400">
    Already have an account?{" "}
    <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300">
      Login
    </Link>
  </p>
      </div>
    </div>
    </div>
  );
};

export default Register;
