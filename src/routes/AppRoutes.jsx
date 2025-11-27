import React from 'react'
import {Route ,BrowserRouter,Routes} from 'react-router-dom'
import Home from '../components/Home'
import Login from '../components/Login'
import Register  from '../components/Regester'
import Project from '../components/Project'
import UserAuth from '../auth/UserAuth'


function AppRoutes() {
  return (
  <BrowserRouter>
  <Routes>
    <Route path='/'  element={<UserAuth><Home/></UserAuth>}></Route>
    <Route path='/login'  element={<Login/>}></Route>
    <Route path='/register'  element={<Register/>}></Route>
    <Route path='/project'  element={<Project/>}></Route>
  </Routes>
  </BrowserRouter>
  )
}

export default AppRoutes
