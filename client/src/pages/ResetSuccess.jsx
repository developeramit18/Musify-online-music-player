import React from 'react'
import { Logo } from '../components'
import { useNavigate } from 'react-router-dom';

export default function ResetSuccess() {
    const navigate = useNavigate();
    const navigateToHome = ()=>{
      navigate('/')
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
            <h2 className="text-2xl md:text-3xl font-bold">You're all set</h2>
            <p className="text-center font-medium">
            Your password has been successfully updated, you are now logged in.
            </p>
            <button onClick={navigateToHome} className='bg-[#ffcd2b] px-6 py-3 rounded-full text-md font-semibold'>Start listening</button>
          </div>
        </div>
  )
}
