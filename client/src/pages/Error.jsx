import React from 'react'
import { Logo } from '../components'
import { Link } from 'react-router-dom'

export default function Error() {
  return (
    <div className='w-screen h-screen flex justify-center items-center'>
        <div className="max-w-md flex flex-col items-center gap-4">
            <Logo size={'extraLarge'}/>
            <h1 className='font-bold text-3xl md:text-4xl'>Page not found</h1>
            <p className='text-gray-500 text-center text-wrap w-[90%] md:w-full'>We can’t seem to find the page you are looking for.</p>
            <Link to={'/'} className="bg-[#ffcd2b] hover:bg-[#f1c40f] py-2 px-5 uppercase text-md rounded-full font-bold text-black">Home</Link>
        </div>
    </div>
  )
}
