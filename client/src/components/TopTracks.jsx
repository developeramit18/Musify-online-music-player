import React from "react";
import { FaPlay } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addSongs } from "../redux/slices/songSlice";

export default function TopTracks({ song }) {
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handlePlaySong = (song) => {
    if (userState.isLoggedIn) {
      dispatch(addSongs([song]));
    } else {
      navigate("/signin");
    }
  };

  return (
    <div
      key={song._id}
      className="flex group items-center w-full gap-2 md:gap-4 px-2 md:px-4 py-2 bg-gray-100 dark:bg-transparent dark:hover:bg-gray-400 hover:bg-gray-200 cursor-pointer"
      title={`Play - ${song.title}`}
      onClick={() => handlePlaySong(song)}
    >
      <div className="w-8 h-8 sm:w-10 sm:h-10 flex justify-center items-center rounded-md overflow-hidden relative">
        <img
          src={song.thumbnail}
          alt={song.title}
          className="w-full h-full object-cover min-w-full min-h-full"
        />
        <div className="md:hidden group-hover:inline-block absolute top-0 left-0 right-0 bottom-0 w-full bg-black/40"></div>
        <FaPlay className="inline-block md:hidden group-hover:inline-block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs w-3 text-white" />
      </div>
      <h3 className="text-sm md:text-md font-medium overflow-hidden truncate flex-1">{song.title}</h3>
    </div>
  );
}
