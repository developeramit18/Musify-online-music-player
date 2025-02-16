import React, { useState } from "react";
import { FaPlay } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { addSongs } from "../redux/slices/songSlice";
import { IoEllipsisVerticalSharp } from "react-icons/io5";
import { signInSuccess } from "../redux/slices/userSlice";
import { toast } from "react-toastify";
import axios from "axios";

export default function SidebarPlaylist({ song, index }) {
  const dispatch = useDispatch();
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  const handleRemoveFromFavourite = async (songId) => {
    if (songId) {
      try {
        const response = await axios.post(
          `/api/song/remove-from-favourite/${songId}`
        );
        if (response.status === 200) {
          toast.success(response.data.message);
          dispatch(signInSuccess(response.data.user));
          setOpenDropdownIndex(null);
        }
      } catch (error) {
        toast.error("Error removing song from favourite");
        console.log(error);
      }
    }
  };

  const toggleDropdown = (index) => {
    setOpenDropdownIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="px-2 py-3 w-full cursor-pointer group hover:bg-gray-200 rounded-md">
      <div className="flex justify-between items-center ">
        <div
          className="flex items-center gap-2 w-[90%]"
          onClick={() => dispatch(addSongs([song]))}
        >
          {/* Play Icon */}
          <div className="flex items-center justify-center w-5 h-w-5">
            <FaPlay
              title={`Play - ${song.title}`}
              className="text-sm text-black/80 hidden group-hover:inline-block"
            />
            <span className="text-md text-black group-hover:hidden">
              {index + 1}.
            </span>
          </div>

          <img
            src={song.thumbnail}
            alt={song.title}            
            className="w-6 h-6 rounded-sm object-cover"
            onContextMenu={(e) => e.preventDefault()}
          />

          <h3 className="text-sm font-medium overflow-hidden whitespace-nowrap z-10 flex-1 ">
            <span className="inline-block animate-scroll">{song.title}</span>
          </h3>
        </div>

        <div
          className="dropdown dropdown-top dropdown-end"
        >
          <IoEllipsisVerticalSharp
            className="text-sm"
            tabIndex={0}
            role="button"
            onClick={() => toggleDropdown(index)}
          />
          {openDropdownIndex === index && (
            <button
            className={`dropdown-content menu text-red-600 font-semibold text-md bg-white z-[20] w-56 p-4 px-2 shadow-md absolute`}
            onClick={() => handleRemoveFromFavourite(song._id)}
          >
            Remove from liked song
          </button>
          )}
        </div>
      </div>
    </div>
  );
}
