import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DeleteSongPopupModal from "../components/DeleteSongPopupModal";
import PaginationBar from "../components/PaginationBar";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

export default function AllSongs() {
  const [songs, setSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [totalSong, setTotalSong] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [deleteSongId, setDeleteSongId] = useState(null);
  const [loading, setLoading] = useState(false);
  const toastId = "toastId";
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const songsPerPages = 8;

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredSongs(songs);
    } else {
      const filtered = songs.filter(
        (song) =>
          song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          song.artist.some((artist) =>
            artist.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
      setFilteredSongs(filtered);
      setCurrentPage(1);
    }
  }, [searchTerm, songs]);

  const getAllSongs = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/song`);
      setLoading(false);

      if (response.status === 200) {
        setSongs(response.data.songs);
        setTotalSong(response.data.totalSongs);
        setTotalPages(Math.ceil(response.data.totalSongs / songsPerPages));
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

  const paginatedSongs = filteredSongs.slice(
    (currentPage - 1) * songsPerPages,
    currentPage * songsPerPages
  );

  const handleShowPopup = (songId) => {
    setShowPopup(true);
    setDeleteSongId(songId);
  };

  const handleHidePopup = () => {
    setShowPopup(false);
    setDeleteSongId(null);
  };

  useEffect(() => {
    getAllSongs();
  }, []);

  const handlePageClick = (selected) => {
    setCurrentPage(selected);
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-GB");
  };

  return (
    <div className="w-full h-full dark:text-white">
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between p-2 pb-4">
        <h2 className="text-2xl font-semibold">Total Songs: {totalSong}</h2>
        <div className="flex items-center relative gap-2 bg-gray-300 dark:bg-gray-500 p-2 w-full rounded-full cursor-pointer group">
          <FiSearch
            className={`text-xl font-bold text-black/70 transition-all duration-200`}
            title="search"
          />
          <input
            type="text"
            className={`flex flex-1 bg-transparent text-black placeholder:text-black/70 outline-none focus:outline-none`}
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center dark:text-white">Loading...</div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white dark:bg-gray-500 min-h-[calc(100vh-170px)]">
            <table className="min-w-full rounded-lg border border-gray-300 dark:border-gray-500">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-500 border-b-2 border-gray-300 dark:border-gray-400">
                  <th className="px-4 py-3 text-left text-gray-600 dark:text-white font-medium">
                    Thumbnail
                  </th>
                  <th className="px-4 py-3 text-left text-gray-600 dark:text-white font-medium">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-gray-600 dark:text-white font-medium hidden sm:table-cell">
                    Artist
                  </th>
                  <th className="px-4 py-3 text-left text-gray-600 dark:text-white font-medium hidden md:table-cell">
                    Upload Date
                  </th>
                  <th className="px-4 py-3 text-center text-gray-600 dark:text-white font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {!loading && paginatedSongs.length <= 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No Songs, upload a song first to see here.
                    </td>
                  </tr>
                ) : (
                  paginatedSongs.map((song, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-400"
                    >
                      <td className="px-4 py-3">
                        <img
                          src={song.thumbnail}
                          alt={song.title}
                          onContextMenu={(e) => e.preventDefault()}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                      </td>

                      <td className="px-4 py-3 text-gray-700 dark:text-white/80 font-bold max-w-[200px] truncate">
                        {song.title}
                      </td>

                      <td className="px-4 py-3 text-gray-700 hidden sm:table-cell">
                        {song.artist.slice(0, 3).map((artist, index, arr) => (
                          <span key={artist.name}>
                            {artist.name}
                            {index < arr.length - 1 ? ", " : ""}
                          </span>
                        ))}
                        {song.artist.length > 3 && "..."}
                      </td>

                      <td className="px-4 py-3 text-gray-700 hidden md:table-cell">
                        {formatDate(song.createdAt)}
                      </td>

                      <td className="px-4 py-3 text-center flex items-center justify-center space-x-2">
                        <Link
                          to={`/admin/update-song/${song._id}`}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          Edit
                        </Link>
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleShowPopup(song._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <PaginationBar
              totalPages={Math.ceil(filteredSongs.length / songsPerPages)}
              handlePageClick={handlePageClick}
            />
            {showPopup && (
              <DeleteSongPopupModal
                showPopup={showPopup}
                deleteSongId={deleteSongId}
                handleHidePopup={handleHidePopup}
                getAllSongs={getAllSongs}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
