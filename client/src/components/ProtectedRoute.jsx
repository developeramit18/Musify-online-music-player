import React from 'react';
import {useSelector} from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const userState = useSelector(state => state.user);
  
  return(
    userState.isLoggedIn ? <Outlet/> : <Navigate to={'/signin'} />
  )

}
