import React from 'react'
import { Logo } from '../components'
import { useNavigate } from 'react-router-dom'

export default function ForgotSuccess() {
  const navigate= useNavigate();
  const navigateTologin = ()=>{
    navigate('/signin')
  }
  const navigateToforgotPassword = ()=>{
    navigate('/forgot-password')
  }
  return (
    <div className="w-screen h-screen flex justify-center items-center">
          <div className="max-w-md w-full flex flex-col items-center p-4 py-8 gap-4">
            <div className="flex items-center gap-2">
              <Logo size={"large"} />
              <h1 className="text-2xl font-semibold">
                Musify<sup className="text-sm">®</sup>
              </h1>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">Check your email</h2>
            <p className="text-center font-medium">
            We've successfully sent you an email. Follow the instructions to access your Musify account.
            </p>
            <button onClick={navigateTologin} className='bg-[#ffcd2b] px-6 py-3 rounded-full text-md font-semibold'>Back to login</button>
            <button onClick={navigateToforgotPassword} className='border border-[#ffcd2b] bg-transparent px-6 py-3 rounded-full text-md font-semibold'>Edit Email</button>
          </div>
        </div>
  )
}
