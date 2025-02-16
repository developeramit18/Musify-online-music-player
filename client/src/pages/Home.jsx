import React, { useEffect, useState } from "react";
import ArtistPlaylist from "../components/ArtistPlaylist";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { FaChevronLeft, FaChevronRight, FaPlay } from "react-icons/fa";
import PlaylistCard from "../components/PlaylistCard";
import TopTracks from "../components/topTracks";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [artists, setArtists] = useState([]);
  const artistLoading = new Array(12).fill(null);
  const playlistLoading = new Array(15).fill(null);
  const topTracksLoading = new Array(10).fill(null);
  const [playlists, setPlaylists] = useState([]);
  const [showLeftIcon, setShowLeftIcon] = useState(false);
  const [showRightIcon, setShowRightIcon] = useState(true);
  const [topTracks, setTopTracks] = useState([]);
  const scrollContainerRef = useRef(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [artistResponse, playlistResponse, songListResponse] =
        await Promise.all([
          axios.get("api/artist?limit=8"),
          axios.get("api/playlist"),
          axios.get("api/song?limit=10"),
        ]);

      setArtists(artistResponse.data.artists);
      setPlaylists(playlistResponse.data.playlists);
      setTopTracks(songListResponse.data.songs);
      setLoading(false);
    } catch (err) {
      toast.error("Error fetching data");
      setLoading(false);
    }
  };

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftIcon(scrollLeft > 0);
      setShowRightIcon(scrollLeft + clientWidth < scrollWidth); 
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth / 2; 
      scrollContainerRef.current.scrollTo({
        left:
          direction === "left"
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading) {
      checkScroll();
    }
  }, [loading, artists]);

  useEffect(() => {
    checkScroll(); 
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", checkScroll);
    }
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", checkScroll);
      }
    };
  }, []);
  return (
    <div className="flex-1 h-full bg-gray-100 rounded-md overflow-y-auto noScrollbar p-1 md:p-4">
      <div className="relative">
        <h2 className="text-xl md:text-2xl font-bold px-2 md:px-4">Artists</h2>
        <div className="relative">
          {/* Left Scroll Icon */}
          {showLeftIcon && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-gray-100 p-2 rounded-full shadow-md hover:bg-gray-200"
            >
              <FaChevronLeft size={20} />
            </button>
          )}

          {/* Scrollable Artist Container */}
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-4 p-2 md:p-4 overflow-x-auto noScrollbar flex-nowrap"
          >
            {loading ? (
              artistLoading.map((el, index) => (
                <div
                  className="min-w-28 min-h-28 max-w-28 max-h-28 md:min-w-36 md:max-w-36 md:max-h-36 md:min-h-36 rounded-full bg-slate-200 animate-pulse"
                  key={`artistLoading ${index}`}
                ></div>
              ))
            ) : (
              <>
                {artists.length > 0 &&
                  artists.map((artist) => (
                    <ArtistPlaylist key={artist._id} artist={artist} />
                  ))}
                {artists.length > 0 && (
                  <Link
                    to="/artist"
                    className="text-blue-600 w-full text-nowrap hover:underline"
                  >
                    Show more
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Right Scroll Icon */}
          {showRightIcon && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-gray-100 p-2 rounded-full shadow-md hover:bg-gray-200"
            >
              <FaChevronRight size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Playlists Section */}

      <div className="relative mt-4">
        <h2 className="text-xl md:text-2xl font-bold px-2 md:px-4">
          Playlists
        </h2>
        <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start p-2 md:p-4  ">
          {loading ? (
            playlistLoading.map((el, index) => (
              <div
                className="w-full h-32 md:min-w-52 md:max-w-52 md:min-h-52 md:max-h-52 bg-slate-200 animate-pulse"
                key={`playlistLoading ${index}`}
              ></div>
            ))
          ) : (
            <>
              {playlists.length > 0 &&
                playlists.map((playlist) => (
                  <PlaylistCard key={playlist._id} playlist={playlist} />
                ))}
            </>
          )}
        </div>
      </div>

      {/* Top Tracks Section */}

      <div className="relative mt-4">
        <h2 className="text-xl md:text-2xl font-bold px-2 md:px-4">
          Top Tracks
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center p-2 md:p-4  ">
          {loading ? (
            topTracksLoading.map((el, index) => (
              <div
                className="w-full h-8 md:min-w-32 md:max-w-32 md:min-h-8 md:max-h-8 bg-slate-200 animate-pulse"
                key={`topTracksLoading ${index}`}
              ></div>
            ))
          ) : (
            <>
              {topTracks.length > 0 &&
                topTracks.map((song) => (
                  <TopTracks key={song._id} song={song} />
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
