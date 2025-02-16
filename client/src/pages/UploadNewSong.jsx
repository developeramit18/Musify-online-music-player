import React, { useRef, useState } from "react";
import Devider from "../components/Devider";
import PicPreview from "../components/PicPreview";
import { toast } from "react-toastify";
import axios from "axios";
import { Loader } from "../components";
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
import { app } from "../firebase";
import SongFileUpload from "../components/SongFileUpload";
import SongThumbUpload from "../components/SongThumbUpload";
import SearchArtistModal from "../components/SearchArtistModal";
import AddArtist from "./AddArtist";

export default function UploadNewSong() {
  const songFileRef = useRef();
  const songThumbnailRef = useRef();
  const [searchArtist, setSearchArtist] = useState('');
  const [songFile, setSongFile] = useState(null);
  const [songThumbnail, setSongThumbnail] = useState(null);
  const [songFileUploadProgress, setSongFileUploadProgress] = useState(null);
  const [toggleCreateArtist, setToggleCreateArtist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [songThumbnailUploadProgress, setSongThumbnailUploadProgress] =
    useState(null);
  const [artists, setArtists] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const toastId = "toast-error";
  const [newSongData, setNewSongData] = useState({
    songTitle: "",
    songUrl: null,
    songThumbnail:
      "https://firebasestorage.googleapis.com/v0/b/music-player-48afa.appspot.com/o/Song%20thumbnail%2Fthumb.png?alt=media&token=ece030b4-f4a8-43a4-8b18-3a09ed2afcd2",
    artists: [],
  });
  const handleAddArtist = (artist) => {
    setNewSongData((prev) => ({
      ...prev,
      artists: prev.artists.some((a) => a._id === artist._id)
        ? prev.artists 
        : [...prev.artists, artist],
    }));
  };
  

  const handleRemoveArtist = (artistId) => {
    setNewSongData((prev) => ({
      ...prev,
      artists: prev.artists.filter((artist) => artist._id !== artistId), 
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSongData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSongUpload = async (folder) => {
    if (!songFile) {
      if (!toast.isActive(toastId))
        toast.error("Select song file first!", { toastId });
      return;
    }
    try {
      const storage = getStorage(app);
      const fileName = `${folder}/${new Date().getTime()}_${songFile.name}`; 
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, songFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setSongFileUploadProgress(progress.toFixed(2));
        },
        (error) => {
          setSongFileUploadProgress(null);
          setSongFile(null);
          toast.error(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setSongFileUploadProgress(null);
            toast.success("Song file uploaded");
            songFileRef.current.value = "";
            setNewSongData((prev) => ({
              ...prev,
              songUrl: downloadURL,
            }));
          });
        }
      );
    } catch (error) {
      toast.error("Error uploading song:", error.message);
      setSongFileUploadProgress(null);
    }
  };
  const handleSongThumbnailUpload = async (folder) => {
    if (!songThumbnail) {
      if (!toast.isActive(toastId))
        toast.error("Select song thumbnail first!", { toastId });
      return;
    }
    try {
      const storage = getStorage(app);
      const fileName = `${folder}/${new Date().getTime()}_${
        songThumbnail.name
      }`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, songThumbnail);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setSongThumbnailUploadProgress(progress.toFixed(2));
        },
        (error) => {
          setSongThumbnailUploadProgress(null);
          setSongThumbnail(null);
          toast.error(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setSongThumbnailUploadProgress(null);
            toast.success("Song thumbnail uploaded");
            songThumbnailRef.current.value = "";
            setNewSongData((prev) => ({
              ...prev,
              songThumbnail: downloadURL,
            }));
          });
        }
      );
    } catch (error) {
      toast.error("Error uploading thumbnail:", error.message);
      setSongFileUploadProgress(null);
    }
  };

  const handleSearchArtist = async (e) => {
    e.preventDefault();
    const { value } = e.target;
    setSearchArtist(value);
    if (value == "") return setArtists([]);
    try {
      setSearchLoading(true);
      const response = await axios.get(`/api/artist/search?artist=${value}`);
      if (response.status === 200) {
        setSearchLoading(false);
        setArtists(response.data.artists);
      }
    } catch (error) {
      setSearchLoading(false);
      toast.error(error.response.data.message);
    }
  };

  const handleUploadNewSong = async () => {
    if (songFileUploadProgress) {
      toast.info("song is uploading...");
      return;
    }
    if (songThumbnailUploadProgress) {
      toast.info("song thumbnail is uploading...");
      return;
    }
    if (!newSongData.songTitle || newSongData.songTitle === "") {
      if (!toast.isActive(toastId))
        toast.error("Song name is required", { toastId });
      return;
    }
    if (!newSongData.songUrl || newSongData.songUrl === "") {
      if (!toast.isActive(toastId))
        toast.error("Song file is required", { toastId });
      return;
    }
    if (!newSongData.artists || newSongData.artists.length <= 0) {
      if (!toast.isActive(toastId))
        toast.error("Song's artist is required", { toastId });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/song/add-new-song", newSongData);
      console.log("response:", response);
      if (response.status === 201) {
        setLoading(false);
        toast.success("Song uploaded successfully");
        setNewSongData({
          songTitle: "",
          songUrl: null,
          songThumbnail:
            "https://firebasestorage.googleapis.com/v0/b/music-player-48afa.appspot.com/o/Song%20thumbnail%2Fthumb.png?alt=media&token=ece030b4-f4a8-43a4-8b18-3a09ed2afcd2",
          artists: [],
        });
      } else {
        setLoading(false);
        if (!toast.isActive(toastId)) {
          toast.error(response.data.message, { toastId });
        }
      }
    } catch (error) {
      setLoading(false);
      if (!toast.isActive(toastId)) {
        toast.error(error.response.data.message, { toastId });
      }
    }
  };

  return (
    <div className="w-full h-full p-2 flex flex-col">
      <h2 className="text-2xl font-bold text-center">Add a new Song</h2>
      <Devider title={"Song Details"} />
      <div className="w-full flex  mt-4 gap-6 bg-white p-3">
        <div className="flex-1 p-2 space-y-4">
          <div className="flex flex-col gap-2">
            <label className="block text-gray-600 font-medium mb-1">
              Song title:
            </label>
            <input
              type="text"
              name="songTitle"
              onChange={handleChange}
              value={newSongData.songTitle}
              className="w-full px-4 py-2 border border-black/50 rounded-lg focus:border-none focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter song title..."
              required
            />
          </div>
          {/* Song File Upload */}
          <SongFileUpload
            newSongData={newSongData}
            handleChange={handleChange}
            songFileRef={songFileRef}
            setSongFile={setSongFile}
            songFileUploadProgress={songFileUploadProgress}
            handleSongUpload={handleSongUpload}
          />

          {/* Song Thumbnail Upload */}
          <SongThumbUpload
            setSongThumbnail={setSongThumbnail}
            songThumbnailRef={songThumbnailRef}
            songThumbnailUploadProgress={songThumbnailUploadProgress}
            handleSongThumbnailUpload={handleSongThumbnailUpload}
          />
        </div>
        <div className="flex flex-col h-fit p-2 gap-2 border-2 border-dotted border-[#ffcd2b]">
          <PicPreview url={newSongData.songThumbnail} />
        </div>
      </div>
      <Devider title={"Song Artist Details"} />

      <div className="flex gap-6">
        <div className="flex flex-col gap-2 w-full max-w-sm">
          <label className="block text-gray-600 font-medium mb-1">
            Song Artist:
          </label>
          <div className="dropdown dropdown-top dropdown-start" tabIndex={4}>
            <input
              onChange={handleSearchArtist}
              value={searchArtist}
              type="text"
              name="songArtist"
              className="w-full px-4 py-2 border border-black/50 rounded-lg focus:border-none focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Search for artist..."
              required
            />
            <div tabIndex={4} className="dropdown-content bg-white shadow mb-2 w-full max-h-60 overflow-y-auto rounded-md p-2">
              {searchLoading ? (
                <div className="w-full h-full flex justify-center items-center">
                  <Loader />
                </div>
              ) : artists.length > 0 ? (
                artists.map((artist) => (
                  <SearchArtistModal
                    artist={artist}
                    key={artist._id}
                    handleAddArtist={handleAddArtist}
                  />
                ))
              ) : (
                <div className="space-y-2 px-4 py-2">
                  <button
                    onClick={() => {
                      setToggleCreateArtist(true);
                    }}
                  >
                    Add new artist
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full px-5">
          {newSongData.artists.length > 0 && (
            <>
              <h3>Current song's added artists:-</h3>
              {newSongData.artists.map((artist) => (
                <div
                  className="flex items-center justify-between"
                  key={artist._id}
                >
                  <div className="flex gap-4 items-center">
                    <img
                    onContextMenu={(e)=>e.preventDefault()}
                      src={artist.pic}
                      alt={artist.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <h3 className="text-md truncate">{artist.name}</h3>
                  </div>
                  <h3
                    className="text-sm text-red-400 cursor-pointer font-bold"
                    title="remove"
                    onClick={() => handleRemoveArtist(artist._id)}
                  >
                    ✕
                  </h3>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {toggleCreateArtist && (
        <>
          <AddArtist />
          <button
            onClick={() => setToggleCreateArtist(false)}
            className="my-2 w-full bg-gray-400 text-black py-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Cancel
          </button>
        </>
      )}

      <button
        disabled={loading}
        className="w-full my-6 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        onClick={handleUploadNewSong}
      >
        {loading ? "Uploading..." : "Add Song"}
      </button>
    </div>
  );
}
