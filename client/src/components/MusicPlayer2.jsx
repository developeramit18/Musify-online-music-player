import React, { useState } from "react";
import MusicButton from "./MusicButton";
import {
  IoAddCircleOutline,
  IoPlaySkipBack,
  IoPlaySkipForward,
  IoRemoveCircleOutline,
} from "react-icons/io5";
import { FaPauseCircle, FaPlayCircle } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function MusicPlayer2({
  song,
  animationKey,
  currentTime,
  duration,
  progressWidth,
  setIsFullscreen,
  handleNext,
  handlePrevious,
  toggleMusic,
  playSong,
  handleSeek,
  handleAddToFavourite,
  handleRemoveFromFavourite,
}) {
  const userState = useSelector((state) => state.user);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-white z-[10000] w-full h-full p-4">
      <div className="w-full h-full flex flex-col justify-between">
        {/* Header */}
        <div
          className="self-start flex gap-1 cursor-pointer rounded-md"
          onClick={() => setIsFullscreen(false)}
        >
         <IoMdArrowRoundBack className="text-2xl"/>
        </div>

        {/* Song Thumbnail */}
        <div className="w-full h-fit flex flex-col bg-gray-200 rounded-xl">
          <img
            src={
              song?.thumbnail ||
              "https://firebasestorage.googleapis.com/v0/b/music-player-48afa.appspot.com/o/Others%2Fthumb.png?alt=media&token=2291d13e-a7c9-466e-9fc8-b189c8b5201a"
            }
            className="w-full h-fit rounded-xl"
            onContextMenu={(e)=>e.preventDefault()}
            alt="Thumbnail"
          />
        </div>

        {/* Footer/ Music player button and seekbar */}
        <div className="flex flex-col gap-2">
          {/* Song title and song artist */}
          <div className=" w-full flex justify-between items-center">
            <div className="flex flex-col gap-0 w-[85%]">
              {song?.title ? (
                <h3 className="text-lg text-black font-semibold overflow-hidden whitespace-nowrap relative">
                  <span key={animationKey} className="w-fit animate-scroll">
                    {song?.title || ""} &nbsp;&nbsp;{" "}
                    {(song?.title.length > 40 && song?.title) || ""}
                  </span>
                </h3>
              ) : (
                <h3 className="text-lg text-black font-semibold overflow-hidden whitespace-nowrap relative">
                  Title
                </h3>
              )}
              <p className="text-black/90 font-medium text-md truncate">
                {song?.artist &&
                  song.artist.map((artist, index) => (
                    <Link
                      to={`/artist/${artist._id}`}
                      onClick={() => setIsFullscreen(false)}
                      key={artist._id + index}
                      className="hover:underline"
                    >
                      {artist.name}
                      {index < song?.artist.length - 1 && ", "}
                    </Link>
                  ))}
              </p>
            </div>

            {/* add/remove to/from like song */}
            <div className="">
              {userState?.user?.liked_songs?.some(
                (s) => s._id === song?._id
              ) ? (
                <IoRemoveCircleOutline
                  className="text-3xl text-red-500 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFromFavourite(song?._id);
                  }}
                />
              ) : (
                <IoAddCircleOutline
                  className="text-3xl text-green-500 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToFavourite(song?._id);
                  }}
                />
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 w-full">
            <h3>{formatTime(currentTime)}</h3>
            <input
              type="range"
              min="0"
              max={duration} // Total song duration
              step="0.1"
              value={currentTime} // Current song progress
              onChange={handleSeek}
              className="w-full h-[5px] appearance-none cursor-pointer rounded-md"
              style={{
                background: `linear-gradient(to right, #FFCD2B ${
                  (currentTime / duration) * 100
                }%, #aaaaaa ${(currentTime / duration) * 100}%)`,
                outline: "none",
                border: "none",
                accentColor: "transparent",
              }}
            />

            <h3>{formatTime(duration)}</h3>
          </div>

          <div className="flex justify-center w-full">
            <div className="flex items-center gap-6 text-3xl">
              <IoPlaySkipBack
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                className={`text-3xl sm:text-4xl`}
                title="Previous"
              />
              {!playSong ? (
                <FaPlayCircle
                  onClick={toggleMusic}
                  className={`text-3xl sm:text-4xl`}
                  title="Play"
                />
              ) : (
                <FaPauseCircle
                  onClick={toggleMusic}
                  className="text-4xl"
                  title="Pause"
                />
              )}
              <IoPlaySkipForward
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className={`text-3xl sm:text-4xl `}
                title="Next"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
