import React from 'react';
import { useNavigate } from 'react-router-dom';

const SignupFooter = () => {
    const navigate = useNavigate();
  return (
    <div className="w-full h-fit px-4 py-4 flex justify-between items-center bg-gradient-to-r from-purple-500 to-blue-500 text-white text-center md:text-left overflow-hidden">
  <div className="w-full md:w-auto">
    <h2 className="text-lg md:text-xl font-semibold">Preview of Musify</h2>
    <p className="text-sm md:text-md">Sign up to listen to songs without any ads.</p>
  </div>
  <button
    onClick={() => navigate('/signup')}
    className="w-full hidden md:inline-block md:w-auto px-4 py-2 text-sm md:text-md font-semibold bg-white text-black rounded-full"
  >
    Sign up free
  </button>
</div>


  );
};

export default SignupFooter;
