import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PaginationBar from "../components/PaginationBar";
import DeletePlaylistPopupModal from "../components/DeletePlaylistPopupModal";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";


export default function AllPlaylists() {
  const [playlists, setPlaylists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);
  const [totalPlaylists, setTotalPlaylists] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [deletePlaylistId, setDeletePlaylistId] = useState(null);
  const [loading, setLoading] = useState(false);
  const toastId = "toastId";
  const [currentPage, setCurrentPage] = useState(1);
  const playlistsPerPages = 8;


  useEffect(() => {
      if (searchTerm.trim() === "") {
        setFilteredPlaylists(playlists); 
      } else {
        const filtered = playlists.filter((playlist) =>
          playlist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          playlist.songs.some((song) => song.title.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredPlaylists(filtered);
        setCurrentPage(1); 
      }
    }, [searchTerm, playlists]);

  const getAllPlaylists = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/playlist`);
      setLoading(false);

      if (response.status === 200) {
        setPlaylists(response.data.playlists);
        setTotalPlaylists(response.data.playlists.length);
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

  const paginatedPlaylists = filteredPlaylists.slice(
    (currentPage - 1) * playlistsPerPages,
    currentPage * playlistsPerPages
  );

  const handleShowPopup = (playlistId) => {
    setShowPopup(true);
    setDeletePlaylistId(playlistId);
  };

  const handleHidePopup = () => {
    setShowPopup(false);
    setDeletePlaylistId(null);
  };

  useEffect(() => {
    getAllPlaylists();
  }, []);

  const handlePageClick = (selected) =>{
    setCurrentPage(selected);
  }

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-GB'); 
  };

  return (
    <div className="w-full h-full">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between p-2 pb-4">
          <h2 className="text-2xl font-semibold">Total Playlists: {totalPlaylists}</h2>
          <div className="flex items-center relative gap-2 bg-gray-300 p-2 rounded-full cursor-pointer group">
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
            <div className="text-center">Loading...</div>
          ) : (
            <>
              <div className="overflow-x-auto bg-white min-h-[calc(100vh-170px)]">
              <table className="min-w-full rounded-lg border border-gray-300">
        <thead>
          <tr className="bg-gray-200 border-b-2 border-gray-300">
            <th className="px-4 py-3 text-left text-gray-600 font-medium">
              Thumbnail
            </th>
            <th className="px-4 py-3 text-left text-gray-600 font-medium">
              Name
            </th>
            <th className="px-4 py-3 text-left text-gray-600 font-medium hidden sm:table-cell">
              Total Songs
            </th>
            <th className="px-4 py-3 text-left text-gray-600 font-medium hidden md:table-cell">
              Created Date
            </th>
            <th className="px-4 py-3 text-center text-gray-600 font-medium">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {!loading && paginatedPlaylists.length <= 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-4">
                No Playlist, create playlist first to see here.
              </td>
            </tr>
          ) : (
            paginatedPlaylists
              .map((playlist, index) => (
                <tr key={index + 1} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <img
                      src={playlist.thumbnail}
                      alt={playlist.name}
                      onContextMenu={(e) => e.preventDefault()}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                  </td>
    
                  <td className="px-4 py-3 text-gray-700 font-bold max-w-[200px] truncate">
                    {playlist.name}
                  </td>
    
                  <td className="px-4 py-3 text-gray-700 hidden sm:table-cell">
                    {playlist.songs.length}
                  </td>
    
                  <td className="px-4 py-3 text-gray-700 hidden md:table-cell">
                    {formatDate(playlist.createdAt)}
                  </td>
    
                  <td className="px-4 py-3 text-center flex items-center justify-center space-x-2">
                    <Link to={`/admin/update-playlist/${playlist._id}`} className="text-blue-500 hover:text-blue-700">
                      Edit
                    </Link>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleShowPopup(playlist._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
          )}
        </tbody>
      </table>
    
                <PaginationBar totalPages={Math.ceil(filteredPlaylists.length / playlistsPerPages)} handlePageClick={handlePageClick}/>
                {showPopup && (
                  <DeletePlaylistPopupModal
                    showPopup={showPopup}
                    deletePlaylistId={deletePlaylistId}
                    handleHidePopup={handleHidePopup}
                    getAllPlaylists={getAllPlaylists}
                  />
                )}
              </div>
            </>
          )}
        </div>
  );
}
