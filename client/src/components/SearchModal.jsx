import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addSongs } from "../redux/slices/songSlice";

export default function SearchModal({ showSearchModal, setShowSearchModal, search, setSearch, searchLoading, searchedData, showSearchData }) {
  const userState = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowSearchModal(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setShowSearchModal]);

  const handlePlaySong = (song) => {
      setShowSearchModal(false);
      if (userState.isLoggedIn) {
        dispatch(addSongs([song]));
        setSearch("");
      } else {
        navigate("/signin");
      }
    };


  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-[1000] bg-black bg-opacity-50 transition-opacity ${
        showSearchModal ? "visible opacity-100" : "invisible opacity-0"
      }`}
      onClick={() => setShowSearchModal(false)}
    >
      <div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-white w-full max-w-2xl mx-auto p-4 rounded-b-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ✕ Close Button in the Top-Right Corner of the Modal Header */}
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
          onClick={() => setShowSearchModal(false)}
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="flex justify-center border-b pb-3">
          <h2 className="text-lg font-semibold">Search Song</h2>
        </div>

        <input
          type="text"
          placeholder="What do you want to play"
          className="outline-none dark:bg-white border border-black w-full mt-4 px-2 py-3 rounded-sm"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />

{showSearchData &&
            (searchLoading ? (
              <div className="w-full  text-black p-2 rounded-b-lg">
                <Loader />
              </div>
            ) : showSearchData && searchedData.length > 0 ? (
              <div className="w-full max-h-[300px] overflow-y-auto text-black p-2 rounded-b-lg">
                {searchedData.map((song) => (
                  <p
                    key={song._id}
                    className="truncate py-2 px-1 transition-all duration-200"
                    onClick={() => handlePlaySong(song)}
                  >
                    {song.title}
                  </p>
                ))}
              </div>
            ) : (
              <div className=" w-full p-2 rounded-b-lg">
                <p>No data found :)</p>
              </div>
            ))}
      </div>
    </div>
  );
}
