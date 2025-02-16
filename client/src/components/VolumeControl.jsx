import React from 'react'
import { RxSpeakerLoud, RxSpeakerModerate, RxSpeakerOff  } from "react-icons/rx";

export default function VolumeControl({volume, setVolume, isMuted, setIsMuted}) {


  const handleVolumeChange = (e)=>{
    setVolume(parseInt(e.target.value));
    e.target.value > 0 ? setIsMuted(false) : setIsMuted(true)
  }
  
  const handleMute = (e) =>{
    if(isMuted){
        setIsMuted(false);
        setVolume(100)
    } else{
        setIsMuted(true);
        setVolume(0);
    }
  }

  return (
    <div className='hidden lg:flex items-center gap-4'>
        {
            isMuted || volume == 0 ? (
                <RxSpeakerOff onClick={handleMute} className='cursor-pointer text-black/80 hover:text-black text-xl'/>
            ) : !isMuted && volume >= 70 ? (
                <RxSpeakerLoud onClick={handleMute} className='cursor-pointer text-black/80 hover:text-black text-xl'/>
            ) : (
                <RxSpeakerModerate onClick={handleMute} className='cursor-pointer text-black/80 hover:text-black text-xl'/>
            )
        }
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={volume}
          onChange={handleVolumeChange}
          className="w-25 h-[5px] appearance-none bg-gray-200"
          style={{
            background: `linear-gradient(to right, #FFCD2B ${volume}%, #F4F4F4 ${volume}%)`,
          }}
        />
    </div>
  )
}
