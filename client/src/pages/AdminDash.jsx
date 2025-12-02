import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
export default function AdminDash() {
  const [loading, setLoading] = useState(false);
  const [dashData, setDashData] = useState({
    lastMonthSongs: 0,
    lastMonthUsers: 0,
    totalSize: 0,
    totalArtists: 0,
    recentlyAddedSongs: [],
    recentlyAddedArtist: [],
    totalSongs: 0,
    totalUsers: 0,
  });

  const totalSizeInBytes = 5 * 1024 * 1024 * 1024;

  const getStorageUsage = (sizeInBytes) => {
    const sizeInMB = sizeInBytes / (1024 * 1024);
    const totalSizeInMB = totalSizeInBytes / (1024 * 1024);
    return ((sizeInMB / totalSizeInMB) * 100).toFixed(2);
  };

  const toastId = "toastId";

  const getDashData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/dashboard");
      if (response.status === 200) {
        setLoading(false);
        setDashData(response.data);
      }
    } catch (error) {
      setLoading(false);
      if (!toast.isActive(toastId)) {
        toast.error(error.response.data.message, { toastId });
      }
    }
  };

  useEffect(() => {
    getDashData();
  }, []);

  return (
    <div className="w-full h-full dark:bg-gray-600 dark:text-white p-2">
      <h2 className="text-3xl text-center md:text-left font-semibold mb-6">
        Dashboard Overview
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <div className="bg-white dark:bg-gray-500 shadow-lg rounded-lg p-5 lg:p-6 flex flex-col items-center text-center">
          <h3 className="text-lg font-medium text-gray-500 dark:text-white">Total Artists</h3>
          {loading ? (
            <p className="loading loading-spinner text-primary"></p>
          ) : (
            <p className="text-2xl lg:text-3xl font-bold text-indigo-600 mt-2">
              {dashData.totalArtists.toLocaleString("en-IN") || "0"}
            </p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-500 shadow-lg rounded-lg p-5 lg:p-6 flex flex-col items-center text-center">
          <h3 className="text-lg font-medium text-gray-500 dark:text-white">Total Songs</h3>
          {loading ? (
            <p className="loading loading-spinner text-success"></p>
          ) : (
            <p className="text-2xl lg:text-3xl font-bold text-green-600 mt-2">
              {dashData.totalSongs.toLocaleString("en-IN") || "0"}
            </p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-500 shadow-lg rounded-lg p-5 lg:p-6 flex flex-col items-center text-center">
          <h3 className="text-lg font-medium text-gray-500 dark:text-white">Total Users</h3>
          {loading ? (
            <p className="loading loading-spinner text-info"></p>
          ) : (
            <p className="text-2xl lg:text-3xl font-bold text-blue-600 mt-2">
              {dashData.totalUsers.toLocaleString("en-IN") || "0"}
            </p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-500 shadow-lg rounded-lg p-5 lg:p-6 flex flex-col items-center text-center">
          <h3 className="text-lg font-medium text-gray-500 dark:text-white">Storage Usage</h3>
          {loading ? (
            <p className="loading loading-spinner text-warning"></p>
          ) : (
            <p
              className={`text-2xl lg:text-3xl font-bold line-through ${
                getStorageUsage(dashData.totalSize) <= 40
                  ? "text-green-600"
                  : getStorageUsage(dashData.totalSize) >= 80
                  ? "text-red-500"
                  : "text-yellow-600"
              } mt-2`}
            >
              {getStorageUsage(dashData.totalSize)}%
            </p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-500 shadow-lg rounded-lg p-5 lg:p-6 flex flex-col items-center text-center">
          <h3 className="text-lg font-medium text-gray-500 dark:text-white">
            New Songs (Last 30 Days)
          </h3>
          {loading ? (
            <p className="loading loading-spinner text-secondary"></p>
          ) : (
            <p className="text-2xl lg:text-3xl font-bold text-purple-600 mt-2">
              {dashData.lastMonthSongs.toLocaleString("en-IN") || "0"}
            </p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-500 shadow-lg rounded-lg p-5 lg:p-6 flex flex-col items-center text-center">
          <h3 className="text-lg font-medium text-gray-500 dark:text-white">
            New Users (Last 30 Days)
          </h3>
          {loading ? (
            <p className="loading loading-spinner text-warning"></p>
          ) : (
            <p className="text-2xl lg:text-3xl font-bold text-yellow-600 mt-2">
              {dashData.lastMonthUsers.toLocaleString("en-IN") || "0"}
            </p>
          )}
        </div>
      </div>

      <div className="mt-10">
        <div className="bg-white dark:bg-gray-500 shadow-lg rounded-lg p-3 md:p-5 lg:p-6 mb-6">
          <h3 className="text-xl text-center md:text-left font-semibold text-gray-700 dark:text-white mb-4">
            Recently Added Songs
          </h3>
          {loading ? (
            <p className="text-gray-500 dark:text-white">Loading...</p>
          ) : (
            <ul className="space-y-3">
              {dashData.recentlyAddedSongs.length > 0 ? (
                dashData.recentlyAddedSongs.map((song) => (
                  <li
                    key={song._id}
                    className="flex justify-between items-center gap-2 text-gray-600 dark:text-white/90 min-w-0"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="block truncate text-sm md:text-base">
                        {song.title}
                      </span>
                    </div>
                    <span className="hidden md:inline-block text-gray-500">
                      {new Date(song.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No recent songs found.</p>
              )}
            </ul>
          )}
        </div>

        <div className="bg-white dark:bg-gray-500 shadow-lg rounded-lg p-3 md:p-5 lg:p-6 mb-6">
          <h3 className="text-xl text-center md:text-left font-semibold text-gray-700 dark:text-white mb-4">
            Recently Added Artist
          </h3>
          {loading ? (
            <p className="text-gray-500 dark:text-white">Loading...</p>
          ) : (
            <ul className="space-y-3">
              {dashData.recentlyAddedArtist.length > 0 ? (
                dashData.recentlyAddedArtist.map((artist) => (
                  <li
                    key={artist._id}
                    className="flex justify-between items-center gap-2 text-gray-600 dark:text-white/90 min-w-0"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="block truncate text-sm md:text-base">
                        {artist.name}
                      </span>
                    </div>
                    <span className="hidden md:inline-block text-gray-500">
                      {new Date(artist.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No recent artist found.</p>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
