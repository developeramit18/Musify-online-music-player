import React, { useEffect, useState } from "react";
import ArtistPlaylist from "../../components/ArtistPlaylist";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { FaChevronLeft, FaChevronRight, FaPlay } from "react-icons/fa";
import PlaylistCard from "../../components/PlaylistCard";
import TopTracks from "../../components/TopTracks";
import { useScrollRestore } from "./hooks/useScrollRestore";
import { useHomeData } from "./hooks/useHomeData";
import ArtistSection from "./components/ArtistSection";
import PlaylistSection from "./components/PlaylistSection";
import TopTracksSection from "./components/TopTracksSection";

export default function Home() {
  useScrollRestore("home-scroll");
  const { data, isLoading, isError } = useHomeData();

  // const fetchData = async () => {
  //   try {
  //     setLoading(true);
  //     const [artistResponse, playlistResponse, songListResponse] =
  //       await Promise.all([
  //         axios.get("api/artist?limit=8"),
  //         axios.get("api/playlist"),
  //         axios.get("api/song?limit=10"),
  //       ]);

  //     setArtists(artistResponse.data.artists);
  //     setPlaylists(playlistResponse.data.playlists);
  //     setTopTracks(songListResponse.data.songs);
  //     setLoading(false);
  //   } catch (err) {
  //     toast.error("Error fetching data");
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  // useEffect(() => {
  //   if (!loading) {
  //     checkScroll();
  //   }
  // }, [loading, artists]);

  // useEffect(() => {
  //   checkScroll();
  //   const scrollContainer = scrollContainerRef.current;
  //   if (scrollContainer) {
  //     scrollContainer.addEventListener("scroll", checkScroll);
  //   }
  //   return () => {
  //     if (scrollContainer) {
  //       scrollContainer.removeEventListener("scroll", checkScroll);
  //     }
  //   };
  // }, []);
  if (isError) {
    return <p className="text-red-500 p-4">Something went wrong</p>;
  }
  return (
    <div className="flex-1 h-full bg-gray-100 dark:bg-gray-600 text-black dark:text-white rounded-md overflow-y-auto noScrollbar p-1 md:p-4">
      <ArtistSection loading={isLoading} artists={data?.artists} />
      {/* Playlists Section */}
      <PlaylistSection loading={isLoading} playlists={data?.playlists} />

      {/* Top Tracks Section */}
      <TopTracksSection loading={isLoading} topTracks={data?.topTracks} />
    </div>
  );
}
