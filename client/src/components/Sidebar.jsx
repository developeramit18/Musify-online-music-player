import React from "react";
import { BiSolidPlaylist } from "react-icons/bi";
import { FaPlay } from "react-icons/fa6";
import SidebarLogin from "./SidebarLogin";
import { useDispatch, useSelector } from "react-redux";
import SidebarPlaylist from "./SidebarPlaylist";
import { addSongs } from "../redux/slices/songSlice";

export default function Sidebar() {
  const userState = useSelector((state) => state.user);
  const dispatch = useDispatch();
  return (
    <div className="w-full h-full bg-gray-100 flex flex-col overflow-y-auto noScrollbar ">
      <div className="w-full flex justify-between items-center text-lg sticky z-20 top-0 p-4 bg-gray-100">
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

      <div className="">
        {userState.isLoggedIn ? (
          userState?.user?.liked_songs?.length > 0 ? (
            userState?.user?.liked_songs?.map((song, index) => (
              <SidebarPlaylist key={index + "1"} song={song} index={index} />
            ))
          ) : (
            <div className="bg-slate-200 p-4 w-full rounded-lg text-black mt-3">
              <h2 className="text-lg font-semibold"> Let the music play!</h2>
              <p className="text-sm md:text-md text-gray-700 mt-1">
              No liked songs yet, but the best ones are just a click away!
              </p>
            </div>
          )
        ) : (
          <SidebarLogin />
        )}
      </div>
    </div>
  );
}
