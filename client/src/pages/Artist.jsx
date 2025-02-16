import axios from "axios";
import React, { useState, useEffect } from "react";
import ArtistPlaylist from "../components/ArtistPlaylist";
import { IoMdArrowRoundForward } from "react-icons/io";
import { toast } from "react-toastify"; // Assuming you use react-toastify for error messages

export default function Artist() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const getArtists = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/artist?startIndex=${skip}&limit=8`);
      if (response.data.artists.length === 0) {
        setHasMore(false);
      } else {
        setArtists((prevArtists) => [...prevArtists, ...response.data.artists]);
      }
    } catch (error) {
      toast.error("Error fetching artists");
    } finally {
      setLoading(false);
    }
  };

  const getSearchedArtist = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/artist/search?artist=${searchTerm}`);
      setArtists(response.data.artists); // Update with searched artists
      setHasMore(false); // Disable "Show more" for search results
    } catch (error) {
      toast.error(error.response?.data?.message || "Error searching artist!");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  useEffect(() => {
    setLoading(true);
  
    const fetchData = async () => {
      try {
        if (searchTerm.trim() === "") {
          const response = await axios.get(`/api/artist?startIndex=${skip}&limit=8`);
          if (skip === 0) {
            setArtists(response.data.artists); 
          } else {
            setArtists((prevArtists) => [...prevArtists, ...response.data.artists]); 
          }
          setHasMore(response.data.artists.length > 0);
        } else {

          const response = await axios.get(`/api/artist/search?artist=${searchTerm}`);
          setArtists(response.data.artists);
          setHasMore(false);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Error fetching artists!");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [searchTerm, skip]);
  

  return (
    <div className="flex-1 h-full bg-gray-100 overflow-y-auto noScrollbar rounded-md p-4">
      <div className="w-full flex border border-black/20 rounded-md overflow-hidden">
        <input
          type="text"
          className="w-full p-2 focus:outline-none ring-0"
          placeholder="Search for artists.."
          value={searchTerm}
          onChange={handleChange}
        />
        <div className="grid place-items-center px-3 cursor-pointer" title="search">
          <IoMdArrowRoundForward />
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 p-4 overflow-y-auto noScrollbar flex-wrap">
        {artists.length > 0 ? (
          artists.map((artist) => <ArtistPlaylist key={artist._id} artist={artist} />)
        ) : (
          <p className="text-gray-500">No artists found</p>
        )}
      </div>

      {hasMore && !searchTerm && (
        <div className="grid place-items-center mt-4">
          <button
            className="text-[#333333] font-semibold px-3 py-2 rounded-sm flex items-center bg-[#ffcd2b] hover:bg-[#e6b722]"
            onClick={() => setSkip((prevSkip) => prevSkip + 9)}
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
