import React from "react";
import { FaPlayCircle, FaPauseCircle } from "react-icons/fa";
import { IoPlaySkipBack, IoPlaySkipForward } from "react-icons/io5";

export default function MusicButton({playSong, toggleMusic, handleNext, handlePrevious}) {

    return (
        <div className="flex items-center gap-6 text-3xl text-black dark:text-white">
            <IoPlaySkipBack
                onClick={(e)=>{
                    e.stopPropagation();
                    handlePrevious()
                }}
                className="hidden md:inline-block cursor-pointer text-black/80 hover:text-black"
                title="Previous"
            />
            {!playSong ? (
                <FaPlayCircle
                    onClick={(e)=>{
                        e.stopPropagation();
                        toggleMusic()
                    }}
                    className="cursor-pointer hover:scale-105"
                    title="Play"
                />
            ) : (
                <FaPauseCircle
                    onClick={(e)=>{
                        e.stopPropagation();
                        toggleMusic()
                    }}
                    className="cursor-pointer hover:scale-105"
                    title="Pause"
                />
            )}
            <IoPlaySkipForward
                onClick={(e)=>{
                    e.stopPropagation();
                    handleNext()
                }}
                className="hidden md:inline-block cursor-pointer text-black/80 hover:text-black"
                title="Next"
            />
        </div>
    );
}
