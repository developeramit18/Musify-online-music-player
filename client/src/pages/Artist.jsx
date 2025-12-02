import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import ArtistPlaylist from "../components/ArtistPlaylist";
import { IoMdArrowRoundForward } from "react-icons/io";
import { toast } from "react-toastify";

export default function Artist() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // ==========================
  // Normal Artist Fetch (No debounce)
  // ==========================
  const fetchArtists = useCallback(async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `/api/artist?startIndex=${skip}&limit=8`
      );

      const newArtists = res.data.artists;

      if (skip === 0) {
        setArtists(newArtists);
      } else {
        setArtists((prev) => [...prev, ...newArtists]);
      }

      setHasMore(newArtists.length > 0);
    } catch (err) {
      toast.error("Error fetching artists");
    } finally {
      setLoading(false);
    }
  }, [skip]);

  // ==========================
  // Search Fetch (Debounced)
  // ==========================
  const fetchSearchArtists = useCallback(async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `/api/artist/search?artist=${searchTerm}`
      );

      setArtists(res.data.artists || []);
      setHasMore(false); // Disable Show More for search results
    } catch (err) {
      toast.error(err.response?.data?.message || "Error searching artists");
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  // ==========================
  // Main useEffect (Debounce for Search)
  // ==========================
  useEffect(() => {
    // If search is active → debounce
    if (searchTerm.trim() !== "") {
      const delay = setTimeout(() => {
        fetchSearchArtists();
      }, 500);

      return () => clearTimeout(delay);
    }

    // If search empty → normal fetch
    fetchArtists();
  }, [searchTerm, skip, fetchArtists, fetchSearchArtists]);

  return (
    <div className="flex-1 h-full bg-gray-100 dark:bg-gray-600 dark:text-white overflow-y-auto noScrollbar rounded-md p-4">

      {/* Search Bar */}
      <div className="w-full flex border border-black/20 dark:border-white/50 rounded-md overflow-hidden">
        <input
          type="text"
          className="w-full p-2 focus:outline-none ring-0 text-black dark:bg-white"
          placeholder="Search for artists.."
          value={searchTerm}
          onChange={(e) => {
            setSkip(0);        // Reset skip on search
            setSearchTerm(e.target.value);
          }}
        />
        <div className="grid place-items-center px-3 cursor-pointer" title="search">
          <IoMdArrowRoundForward />
        </div>
      </div>

      {/* Artist List */}
      <div className="flex items-center justify-center gap-4 p-4 overflow-y-auto noScrollbar flex-wrap">
        {artists.length > 0 ? (
          artists.map((artist) => (
            <ArtistPlaylist key={artist._id} artist={artist} />
          ))
        ) : (
          <p className="text-gray-500">No artists found</p>
        )}
      </div>

      {/* Show More Button */}
      {hasMore && searchTerm.trim() === "" && (
        <div className="grid place-items-center mt-4">
          <button
            className="text-[#333333] font-semibold px-3 py-2 rounded-sm flex items-center bg-[#ffcd2b] hover:bg-[#e6b722]"
            onClick={() => setSkip((prev) => prev + 9)}
            disabled={loading}
          >
            {loading ? (
              <div className="animate-spin h-5 w-5 border-t-2 border-blue-600 rounded-full mr-2"></div>
            ) : (
              "Show more"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
