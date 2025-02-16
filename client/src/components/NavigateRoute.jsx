import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';

export default function NavigateRoute() {
    const userState = useSelector(state => state.user);
  return (
    userState.user && userState.user.isAdmin ? <Outlet/>  : <Navigate to={'/'}/>
  )
}
