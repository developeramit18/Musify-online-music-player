import React from 'react'
import Lottie from "lottie-react";
import loader from "../assets/loading.json"
const Loader = () => {
 return (
 <div className="w-full h-full flex justify-center items-center">
    <div /* style={{width: '300px', height: '200px' }} */ className='w-1/3 h-1/4 md:w-1/4 md:h-1/6'>
 <Lottie animationData={loader} loop={true} />
 </div>
 </div>
 )
}
export default Loader