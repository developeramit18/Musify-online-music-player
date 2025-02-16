import React, { useState } from "react";
import { FaPlay } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { addSongs } from "../redux/slices/songSlice";
import { IoEllipsisVerticalSharp } from "react-icons/io5";
import { signInSuccess } from "../redux/slices/userSlice";
import { toast } from "react-toastify";
import axios from "axios";
import { BiSolidPlaylist } from "react-icons/bi";
import SidebarLogin from "../components/SidebarLogin";

export default function LikedSongs() {
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
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
    <div className="w-full ">
      <div className="flex justify-between items-center text-lg sticky z-20 top-0 p-4 bg-gray-100">
        <div className="flex items-center gap-4">
          <BiSolidPlaylist className="text-2xl" />
          <h3 className="font-bold">Liked Songs</h3>
        </div>
        {userState.isLoggedIn && userState?.user?.liked_songs?.length > 0 && (
          <button
            className="bg-[#ffcd2b] text-black w-8 h-8 rounded-full flex justify-center items-center "
            onClick={() =>
              dispatch(addSongs([].concat(...userState.user.liked_songs)))
            }
          >
            <FaPlay className="w-4 h-4" />
          </button>
        )}
      </div>
      {userState.isLoggedIn ? (
        userState?.user?.liked_songs.length > 0 ? (
          userState?.user?.liked_songs?.map((song, index) => (
            <div
              key={song._id + index}
              className="px-2 py-3 w-full cursor-pointer group hover:bg-gray-200 rounded-md"
            >
              <div className="flex justify-between items-center">
                {/* Left Section */}
                <div
                  className="flex items-center gap-2 w-[95%] min-w-0"
                  onClick={() => dispatch(addSongs([song]))}
                >
                  {/* Play Icon / Index */}
                  <div className="flex items-center justify-center w-6 h-6 shrink-0">
                    <FaPlay
                      title={`Play - ${song.title}`}
                      className="text-sm w-3"
                    />
                  </div>

                  {/* Thumbnail */}
                  <img
                    src={song.thumbnail}
                    alt={song.title}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-sm object-cover shrink-0"
                    onContextMenu={(e) => e.preventDefault()}
                  />

                  {/* Song Title (Scrollable when overflow) */}
                  <h3 className="text-sm sm:text-base font-medium flex-1 overflow-hidden">
                    <span className="inline-block truncate animate-scroll">
                      {song.title}
                    </span>
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
          ))
        ) : (
          <div className="bg-slate-200 p-4 w-full rounded-lg text-black mt-3">
            <h2 className="text-lg font-semibold"> Let the music play!</h2>
            <p className="text-sm text-gray-700 mt-1">
              No liked songs yet, but the best ones are just a click away!
            </p>
          </div>
        )
      ) : (
        <SidebarLogin />
      )}
    </div>
  );
}
