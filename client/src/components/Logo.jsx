import React from 'react'
import { RiNeteaseCloudMusicFill } from "react-icons/ri";

export default function Logo({ size }) {
  // Define a map of sizes
  const sizeClass = {
    small: 'text-sm',
    medium: 'text-xl',
    large: 'text-3xl',
    extraLarge: 'text-4xl'
  };

  return (
    <div className='flex items-center' aria-label='musify-music-player'>
        <RiNeteaseCloudMusicFill className={`text-[#ffcd2b] ${sizeClass[size]}`} />
    </div>
  )
}
