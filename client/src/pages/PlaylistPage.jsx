import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaPlay } from "react-icons/fa";
import { IoAddCircleOutline, IoEllipsisVerticalSharp, IoRemoveCircleOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { addSongs } from "../redux/slices/songSlice";
import { signInSuccess } from "../redux/slices/userSlice";
import {Loader} from '../components'

export default function PlaylistPage() {
  const { playlistId } = useParams();
  const [playlistData, setPlaylistData] = useState({});
  const [loading, setLoading] = useState(false);
  const [songDurations, setSongDurations] = useState({});
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  const getPlaylistData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/playlist/${playlistId}`);
      setLoading(false);
      if (res.status === 200) {
        setPlaylistData(res.data.playlist);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Error fetching artist data");
    }
  };

  const handleAddToFavourite = async (songId) => {
    if (userState.isLoggedIn && songId) {
      try {
        const response = await axios.post(
          `/api/song/add-to-favourite/${songId}`
        );
        if (response.status === 200) {
          toast.success(response.data.message);
          dispatch(signInSuccess(response.data.user));
        }
      } catch (error) {
        toast.error("Error adding song to favourite");
      }
    } else {
      navigate("/signin");
    }
  };
  const handleRemoveFromFavourite = async (songId) => {
    if (songId) {
      try {
        const response = await axios.post(
          `/api/song/remove-from-favourite/${songId}`
        );
        if (response.status === 200) {
          toast.success(response.data.message);
          dispatch(signInSuccess(response.data.user));
        }
      } catch (error) {
        toast.error("Error removing song from favourite");
      }
    }
  };

  useEffect(() => {
    getPlaylistData();
  }, [playlistId]);

  const fetchSongDuration = (url, songId) => {
    return new Promise((resolve) => {
      const audio = new Audio(url);
      audio.addEventListener("loadedmetadata", () => {
        const duration = formatDuration(audio.duration);
        resolve({ songId, duration });
      });
      audio.addEventListener("error", () => {
        resolve({ songId, duration: "N/A" });
      });
    });
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${remainingSeconds}`;
  };

  const fetchAllDurations = async () => {
    if (playlistData.songs) {
      const durationPromises = playlistData.songs.map((song) =>
        fetchSongDuration(song.url, song._id)
      );
      const durations = await Promise.all(durationPromises);
      const durationMap = durations.reduce((acc, { songId, duration }) => {
        acc[songId] = duration;
        return acc;
      }, {});
      setSongDurations(durationMap);
    }
  };

  const handlePlayPlaylist = () => {
    if (userState.isLoggedIn) {
      dispatch(addSongs([].concat(...playlistData.songs)));
    } else {
      navigate("/signin");
    }
  };

  const handlePlaySong = (song) => {
    if (userState.isLoggedIn) {
      dispatch(addSongs([song]));
    } else {
      navigate("/signin");
    }
  };

  useEffect(() => {
    fetchAllDurations();
  }, [playlistData.songs]);

 const toggleDropdown = (index) => {
    setOpenDropdownIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="w-full rounded-md overflow-y-auto noScrollbar text-black dark:text-white">
      {loading ? (
        <Loader/>
      ) : (
        <div>
          <div className=" w-full h-fit flex flex-col items-center justify-center gap-2">
            <img
              onContextMenu={(e) => e.preventDefault()}
              src={playlistData.thumbnail}
              alt={playlistData.name}
              className="w-44 h-44 object-cover"
            />
            <h1 className="text-2xl sm:text-3xl md:text-6xl font-bold text-black dark:text-white">
              {playlistData.name}
            </h1>
          </div>
          <div className="flex m-4 ">
            <button
              className="bg-[#ffcd2b] text-black w-10 h-10 rounded-full flex justify-center items-center "
              onClick={handlePlayPlaylist}
            >
              <FaPlay className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-col gap-2 px-0 sm:px-1 md:px-4">
            <h2 className="text-2xl font-semibold">Songs</h2>
            <div className="flex flex-col gap-2 pb-3">
              {playlistData.songs &&
                playlistData.songs.map((song, index) => (
                  <div
                    className="flex items-center justify-between py-2 md:py-4 px-2 md:px-6 cursor-pointer group dark:hover:bg-gray-400 hover:bg-gray-200 rounded-md"
                    key={song._id}
                  >
                    <div
                      className="flex items-center gap-2 w-[95%] overflow-hidden"
                      onClick={() => handlePlaySong(song)}
                    >
                      <span className="hidden md:flex group-hover:hidden text-md font-semibold w-3">
                        {index + 1}.
                      </span>
                      <FaPlay
                        title={`Play - ${song.title}`}
                        className="flex md:hidden group-hover:flex text-xs w-3"
                      />
                      <img
                        onContextMenu={(e) => e.preventDefault()}
                        src={song.thumbnail}
                        alt={song.title}
                        className="w-8 h-8 rounded-md"
                      />
                      <span className="text-sm md:text-md font-semibold truncate flex-1 min-w-0">
                        {song.title}
                      </span>
                    </div>
                    <div className="hidden  md:flex gap-4 items-center">
                      {userState.user?.liked_songs?.some(
                        (s) => s._id === song._id
                      ) ? (
                        <IoRemoveCircleOutline
                          className="text-xl text-red-500"
                          onClick={() => handleRemoveFromFavourite(song._id)}
                        />
                      ) : (
                        <IoAddCircleOutline
                          className="text-xl text-green-500"
                          onClick={() => handleAddToFavourite(song._id)}
                        />
                      )}
                      <span className="text-md font-semibold">
                        {songDurations[song._id] || "--:--"}
                      </span>
                    </div>
                    <div className="inline-block md:hidden dropdown dropdown-top dropdown-end">
                      <IoEllipsisVerticalSharp
                        className="text-sm"
                        tabIndex={1}
                        role="button"
                        onClick={() => toggleDropdown(index)}
                      />
                      {openDropdownIndex === index && (
                        <div className="dropdown-content bg-white shadow-md text-red-400">
                          {userState?.user?.liked_songs?.some(
                            (s) => s._id === song._id
                          ) ? (
                            <button
                              className="text-red-600 font-semibold text-md bg-white w-56 p-4 px-2"
                              onClick={() =>
                                handleRemoveFromFavourite(song._id)
                              }
                            >
                              Remove from liked song
                            </button>
                          ) : (
                            <button
                              className="text-green-600 font-semibold text-md bg-white p-4 px-2 w-56"
                              onClick={() => handleAddToFavourite(song._id)}
                            >
                              Add to liked song
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
