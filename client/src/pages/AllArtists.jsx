import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DeleteArtistPopupModal from "../components/DeleteArtistPopupModal";
import PaginationBar from "../components/PaginationBar";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

export default function AllArtists() {
  const [artists, setArtists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [totalArtist, setTotalArtist] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [deleteArtistId, setDeleteArtistId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const toastId = "toastId";
  const artistsPerPages = 8;

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredArtists(artists); 
    } else {
      const filtered = artists.filter(
        (artist) => artist.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredArtists(filtered);
      setCurrentPage(1);
    }
  }, [searchTerm, artists]);

  const getAllArtists = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/artist`);
      setLoading(false);

      if (response.status === 200) {
        setArtists(response.data.artists);
        setTotalArtist(response.data.totalArtists);
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

  const paginatedArtists = filteredArtists.slice(
    (currentPage - 1) * artistsPerPages,
    currentPage * artistsPerPages
  );

  const handleShowPopup = (artistId) => {
    setShowPopup(true);
    setDeleteArtistId(artistId);
  };

  const handleHidePopup = () => {
    setShowPopup(false);
    setDeleteArtistId(null);
  };

  useEffect(() => {
    getAllArtists();
  }, []);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-GB");
  };

  const handlePageClick = (selected) => {
    setCurrentPage(selected);
  };

  return (
    <div className="w-full h-full">
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between p-2 pb-4">
        <h2 className="text-2xl font-semibold">Total Artists: {totalArtist}</h2>
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
                    Pic
                  </th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium hidden sm:table-cell">
                    Total Songs
                  </th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium hidden md:table-cell">
                    uploaded Date
                  </th>
                  <th className="px-4 py-3 text-center text-gray-600 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {!loading && paginatedArtists.length <= 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No Artist, upload artist first to see here.
                    </td>
                  </tr>
                ) : (
                  paginatedArtists.map((artist, index) => (
                    <tr
                      key={index + 1}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">
                        <img
                          src={artist.pic}
                          alt={artist.name}
                          onContextMenu={(e) => e.preventDefault()}
                          className="w-8 h-8 sm:w-14 sm:h-14 object-cover rounded-md"
                        />
                      </td>

                      <td className="px-4 py-3 text-gray-700 font-bold max-w-[200px] truncate">
                        {artist.name}
                      </td>

                      <td className="px-4 py-3 text-gray-700 hidden sm:table-cell">
                        {artist.songs.length}
                      </td>

                      <td className="px-4 py-3 text-gray-700 hidden md:table-cell">
                        {formatDate(artist.createdAt)}
                      </td>

                      <td className="px-4 py-3 text-center flex items-center justify-center space-x-2">
                        <Link
                          to={`/admin/update-artist/${artist._id}`}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          Edit
                        </Link>
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleShowPopup(artist._id)}
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
              totalPages={Math.ceil(filteredArtists.length / artistsPerPages)}
              handlePageClick={handlePageClick}
            />
            {showPopup && (
              <DeleteArtistPopupModal
                showPopup={showPopup}
                deleteArtistId={deleteArtistId}
                handleHidePopup={handleHidePopup}
                getAllArtists={getAllArtists}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
