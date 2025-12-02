import React, { useEffect, useRef, useState } from "react";
import MusicButton from "./MusicButton";
import axios from "axios";
import VolumeControl from "./VolumeControl";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";
import { signInSuccess } from "../redux/slices/userSlice";
import { toast } from "react-toastify";
import MusicPlayer2 from "./MusicPlayer2";

export default function MusicPlayer() {
  const [playSong, setPlaySong] = useState(false);
  const { songs } = useSelector((state) => state.songs);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(new Audio());
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const userState = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [animationKey, setAnimationKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (window.innerWidth <= 768) {
      // Only on mobile devices
      setIsFullscreen(!isFullscreen);
    }
  };

  const toggleMusic = () => {
    setPlaySong(!playSong);
  };

  // Handle spacebar play/pause
  useEffect(() => {
    const handleSpacebar = (e) => {
      if (e.code === "Space") setPlaySong((prev) => !prev);
    };
    window.addEventListener("keypress", handleSpacebar);
    return () => {
      window.removeEventListener("keypress", handleSpacebar);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume, isMuted]);

  const handleNext = () => {
    if (songs.length > 0) {
      const nextIndex = (currentIndex + 1) % songs.length;
      setCurrentIndex(nextIndex);
    }
  };

  const handlePrevious = () => {
    if (songs.length > 0) {
      const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
      setCurrentIndex(prevIndex);
    }
  };

  useEffect(() => {
    if (songs.length === 1) {
      setCurrentIndex(0);
      setPlaySong(true);
      const currentSong = songs[currentIndex];
      const audio = audioRef.current;

      if (currentSong?.url) {
        setAnimationKey((prevKey) => prevKey + 1);
        audio.src = currentSong.url;
        audio.load();
        audio
          .play()
          .then(() => setPlaySong(true))
          .catch((error) => console.error("Error playing song:", error));
      }
    }
    if (songs.length > 0 && songs[currentIndex]) {
      const currentSong = songs[currentIndex];
      const audio = audioRef.current;
      setPlaySong(true);

      if (currentSong?.url) {
        setAnimationKey((prevKey) => prevKey + 1);
        audio.src = currentSong.url;
        audio.load();
        audio
          .play()
          .then(() => setPlaySong(true))
          .catch((error) => console.error("Error playing song:", error));
      }
    }
  }, [songs, currentIndex]);

  useEffect(() => {
    const audio = audioRef.current;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleAudioEnd = () => {
      if (songs.length > 0) {
        const nextIndex = (currentIndex + 1) % songs.length;
        setCurrentIndex(nextIndex);
      }
      if (songs.length === 1) {
        setPlaySong(false);
      }
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleAudioEnd);

    if (playSong) {
      audio.play();
    } else {
      audio.pause();
    }

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleAudioEnd);
    };
  }, [playSong, currentIndex, songs]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  const progressWidth = duration ? `${(currentTime / duration) * 100}%` : "0%";

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    audioRef.current.currentTime = newTime; // Move song to new time
    setCurrentTime(newTime);
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

  return (
    <>
      <div
        className={`${
          isFullscreen ? "hidden" : "inline-block"
        } w-screen h-16 bg-white dark:bg-gray-700 flex justify-between items-center px-3 gap-6 `}
        onClick={toggleFullscreen}
      >
        <div className="flex flex-1  justify-start items-center gap-2 ">
          {songs[currentIndex]?.thumbnail && (
            <img
              src={songs[currentIndex]?.thumbnail || ""}
              alt="Thumbnail"
              className="w-10 h-10 sm:w-14 sm:h-14 object-cover"
              onContextMenu={(e) => e.preventDefault()}
            />
          )}
          <div className="flex flex-col max-w-[130px] sm:max-w-[250px] md:max-w-[280px] w-full h-10 sm:h-14">
            <h3 className="text-sm sm:text-md text-black dark:text-white font-semibold overflow-hidden whitespace-nowrap relative">
              <span key={animationKey} className="w-fit animate-scroll">
                {songs[currentIndex]?.title || ""} &nbsp;&nbsp;{" "}
                {(songs[currentIndex]?.title.length > 40 &&
                  songs[currentIndex]?.title) ||
                  ""}
              </span>
            </h3>

            <p className="text-black/80 dark:text-white/60 truncate text-sm md:text-md">
              {songs[currentIndex]?.artist.map((artist, index) => (
                <Link
                  to={`/artist/${artist._id}`}
                  onClick={(e) => e.stopPropagation()}
                  key={artist._id + index}
                  className="hover:underline"
                >
                  {artist.name}
                  {index < songs[currentIndex]?.artist.length - 1 && ", "}
                </Link>
              ))}
            </p>
          </div>
          <div className="ml-auto">
            {userState?.user?.liked_songs?.some(
              (s) => s._id === songs[currentIndex]?._id
            ) ? (
              <IoRemoveCircleOutline
                className="text-2xl text-red-500 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFromFavourite(songs[currentIndex]?._id);
                }}
              />
            ) : (
              <IoAddCircleOutline
                className="text-2xl text-green-500 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToFavourite(songs[currentIndex]?._id);
                }}
              />
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center md:flex-1 gap-1">
          <MusicButton
            playSong={playSong}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            toggleMusic={toggleMusic}
          />
          <div className="hidden md:flex items-center gap-3 w-full">
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
        </div>

        {/* Volume Control */}
        <VolumeControl
          volume={volume}
          setVolume={setVolume}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
        />
      </div>
      {isFullscreen && (
        <MusicPlayer2
          song={songs[currentIndex]}
          animationKey={animationKey}
          currentTime={currentTime}
          duration={duration}
          progressWidth={progressWidth}
          setIsFullscreen={setIsFullscreen}
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          playSong={playSong}
          toggleMusic={toggleMusic}
          handleSeek={handleSeek}
          handleAddToFavourite={handleAddToFavourite}
          handleRemoveFromFavourite={handleRemoveFromFavourite}
        />
      )}
    </>
  );
}
