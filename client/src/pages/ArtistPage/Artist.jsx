import React, { useState } from "react";
import { IoMdArrowRoundForward } from "react-icons/io";

import { useArtists } from "./hooks/useArtists";
import { useDebounce } from "./hooks/useDebounce";
import ArtistPlaylist from "../../components/ArtistPlaylist";
import { useScrollRestore } from "../Home/hooks/useScrollRestore";

export default function Artist() {
  useScrollRestore("artist-scroll");

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
  } = useArtists(debouncedSearch);

  const artists =
    data?.pages.flatMap((page) => page.artists) || [];

  return (
    <div className="flex-1 h-full bg-gray-100 dark:bg-gray-600 dark:text-white overflow-y-auto noScrollbar rounded-md p-4">

      {/* 🔍 Search Bar */}
      <div className="w-full flex border border-black/20 dark:border-white/50 rounded-md overflow-hidden">
        <input
          type="text"
          className="w-full p-2 focus:outline-none text-black dark:bg-white"
          placeholder="Search for artists.."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="grid place-items-center px-3">
          <IoMdArrowRoundForward />
        </div>
      </div>

      {/* 🎤 Artist List */}
      <div className="flex items-center justify-center gap-4 p-4 flex-wrap">
        {isLoading ? (
          <p className="text-gray-500">Loading artists...</p>
        ) : artists.length > 0 ? (
          artists.map((artist) => (
            <ArtistPlaylist key={artist._id} artist={artist} />
          ))
        ) : (
          <p className="text-gray-500">No artists found</p>
        )}
      </div>

      {/* ➕ Show More */}
      {hasNextPage && !debouncedSearch && (
        <div className="grid place-items-center mt-4">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetching}
            className="text-[#333] font-semibold px-4 py-2 rounded-sm bg-[#ffcd2b] hover:bg-[#e6b722]"
          >
            {isFetching ? "Loading..." : "Show more"}
          </button>
        </div>
      )}
    </div>
  );
}
