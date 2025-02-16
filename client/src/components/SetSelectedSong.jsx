import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const SetSelectedSongs = ({filteredSongs, setFilteredSongs, handleSelectSong, handleSelectAll, selectedSongs}) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toastId = "error-toast";

  const getAllSongs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/song`);
      setLoading(false);

      if (response.status === 200) {
        setSongs(response.data.songs);
        setFilteredSongs(response.data.songs);
      }
    } catch (error) {
      setLoading(false);
      if (!toast.isActive(toastId)) {
        toast.error(error.response?.data?.message || "Something went wrong", {
          toastId,
        });
      }
    }
  };

  useEffect(() => {
    getAllSongs();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = songs.filter((song) =>
      song.title.toLowerCase().includes(value)
    );
    setFilteredSongs(filtered);
  };

  return (
    <div className="p-4 bg-white">
      {/* Header Section */}
<div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4 w-full">

{/* Checkbox & Name Label */}
<div className="flex items-center gap-3 w-full md:w-auto p-2">
  <input
    type="checkbox"
    checked={selectedSongs.length === filteredSongs.length && filteredSongs.length > 0}
    onChange={() => handleSelectAll()}
    className="form-checkbox h-5 w-5 text-blue-500"
  />
  <span className="text-lg font-semibold">Name</span>
</div>

{/* Selected Songs Counter */}
<div className="text-center w-full md:w-auto">
  <p className="text-gray-600 font-medium">
    Selected Songs: {selectedSongs.length}
  </p>
</div>

{/* Search Input */}
<div className="w-full md:w-1/3">
  <input
    type="text"
    placeholder="Search songs..."
    value={searchTerm}
    onChange={handleSearch}
    className="p-2 border border-gray-300 rounded w-full"
  />
</div>
</div>


      {/* Songs List */}
      {loading ? (
        <p>Loading songs...</p>
      ) : (
        <div className="overflow-y-auto max-h-[300px] scrollbar-thin scrollbar-thumb-gray-300 w-full">
  <ul className="flex flex-col gap-3 p-2">
    {filteredSongs.length > 0 &&
      filteredSongs.map((song) => (
        <li
          key={song._id}
          className="flex items-center justify-between p-3 rounded-lg shadow-md bg-white hover:bg-gray-200 transition"
        >
          {/* Checkbox & Song Title */}
          <label className="flex items-center gap-3 w-full cursor-pointer">
            <input
              type="checkbox"
              checked={selectedSongs.includes(song._id)}
              onChange={() => handleSelectSong(song._id)}
              className="form-checkbox h-5 w-5 text-blue-500"
            />
            <span className="text-sm truncate w-full md:w-auto">{song.title}</span>
          </label>
        </li>
      ))}
  </ul>
</div>

      )}

      {/* Additional Space */}
      <div className="mt-2"></div>
    </div>
  );
};

export default SetSelectedSongs;
