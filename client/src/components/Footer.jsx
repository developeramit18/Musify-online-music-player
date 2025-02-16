import React from 'react'
import SignupFooter from './SignupFooter'
import { useSelector } from 'react-redux'
import MusicPlayer from './MusicPlayer';

export default function Footer() {
    const userState = useSelector(state => state.user);
    const { songs } = useSelector((state) => state.songs);

  return (
    <div className='fixed h-fit bottom-0 w-full z-[100] bg-white'>
        {userState.isLoggedIn ? songs.length > 0 && <MusicPlayer/> : <SignupFooter/>}
    </div>
  )
}
