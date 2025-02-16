import React, { useEffect, useRef, useState } from 'react'
import AddArtist from './AddArtist';
import { useParams } from 'react-router-dom';
import axios from 'axios'
import {toast} from 'react-toastify'
import { Loader } from '../components';
import PicPreview from '../components/PicPreview';
import Devider from '../components/Devider';
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
import { app } from "../firebase";
import SongFileUpload from '../components/SongFileUpload';
import SearchArtistModal from '../components/SearchArtistModal';
import SongThumbUpload from '../components/SongThumbUpload';

export default function EditSong() {
    const {songId} = useParams();
    const [loading, setLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [songThumbnail, setSongThumbnail] = useState(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [toggleCreateArtist, setToggleCreateArtist] = useState(false);
    const [songFile, setSongFile] = useState(null);
    const [searchArtist, setSearchArtist] = useState('');
    const [artists, setArtists] = useState([]);
    const songFileRef = useRef();
    const songThumbnailRef = useRef();
    const toastId = 'toast-id';
    const [uploadedSongName, setUploadedSongName] = useState(null);
    const [songFileUploadProgress, setSongFileUploadProgress] = useState(null);
    const [songThumbnailUploadProgress, setSongThumbnailUploadProgress] = useState(null);
    const [songData, setSongData] = useState({
        songTitle: "",
        songUrl: null,
        songThumbnail:
          "null",
        artists: [],
      });

    
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
                setUploadedSongName(songFile.name);
                songFileRef.current.value = "";
                setSongData((prev) => ({
                  ...prev,
                  songUrl: downloadURL,
                }));
                setSongFile(null)
              });
            }
          );
        } catch (error) {
          toast.error("Error uploading song:", error.message);
          setSongFileUploadProgress(null);
          setSongFile(null);
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
                  setSongData((prev) => ({
                    ...prev,
                    songThumbnail: downloadURL,
                  }));
                  setSongThumbnail(null)
                });
              }
            );
          } catch (error) {
            toast.error("Error uploading thumbnail:", error.message);
            setSongFileUploadProgress(null);
            setSongThumbnail(null)
          }
        };


      const handleSearchArtist = async (e) => {
        e.preventDefault();
        const { value } = e.target;
        setSearchArtist(value);
        if (value == "") return setArtists([]);
        try {
          setSearchLoading(true);
          const response = await axios.get(`/api/artist?name=${value}`);
          if (response.status === 200) {
            setSearchLoading(false);
            setArtists(response.data.artists);
          }
        } catch (error) {
          setSearchLoading(false);
          toast.error(error.response.data.message);
        }
      };

      const handleAddArtist = (artist) => {
        setSongData((prev) => ({
          ...prev,
          artists: prev.artists.some((a) => a._id === artist._id)
            ? prev.artists
            : [...prev.artists, artist],
        }));
      };

      const handleRemoveArtist = (artistId) => {
        setSongData((prev) => ({
          ...prev,
          artists: prev.artists.filter((artist) => artist._id !== artistId), 
        }));
      };

      const handleUpdateSong = async (e) => {
        if (songFileUploadProgress) {
          toast.info("song is uploading...");
          return;
        }
        if (songThumbnailUploadProgress) {
          toast.info("song thumbnail is uploading...");
          return;
        }
        if (!songData.songTitle || songData.songTitle === "") {
          if (!toast.isActive(toastId))
            toast.error("Song title is required", { toastId });
          return;
        }
        if (!songData.songUrl || songData.songUrl === "") {
          if (!toast.isActive(toastId))
            toast.error("Song file is required", { toastId });
          return;
        }
        if (!songData.artists || songData.artists.length <= 0) {
          if (!toast.isActive(toastId))
            toast.error("Song's artist is required", { toastId });
          return;
        }
    
        try {
          setUpdateLoading(true);
          const response = await axios.put(`/api/song/update/${songId}`, songData);
          setUpdateLoading(false);
          if (response.status === 200) {
            toast.success("Song updated successfully");
            setSearchArtist("");
            setUploadedSongName(null);
          } else {
            setLoading(false);
            if (!toast.isActive(toastId)) {
              toast.error(response.data.message, { toastId });
            }
          }
        } catch (error) {
          setUpdateLoading(false);
          if (!toast.isActive(toastId)) {
            toast.error(error.response.data.message, { toastId });
          }
        }
      };

    const fetchSongData = async() =>{
        setLoading(true);
        try {
            const response = await axios.get(`/api/song/${songId}`);
            setLoading(false);
            if(response.status === 200){
                setSongData(prev => ({
                    ...prev,
                    songTitle: response.data.song.title,
                    songUrl: response.data.song.url,
                    songThumbnail: response.data.song.thumbnail,
                }));
                setSongData(prev => ({
                    ...prev,
                    artists: response.data.song.artist.map(artist=>({
                        _id: artist._id,
                        name: artist.name,
                        pic: artist.pic
                    }))
                }))
            }

        } catch (error) {
            setLoading(false);
            toast.error(error.response.data.message)
        }
    }

    useEffect(()=>{
        fetchSongData()
    },[songId])
    
  return (
    loading ? <Loader /> : (
        <div className="w-full h-full p-0 sm:p-2 flex flex-col">
        <h2 className="text-2xl font-bold text-center">Update Song</h2>
        <Devider title={"Song Details"} />
        <div className="w-full flex flex-col-reverse lg:flex-row items-center mt-4 gap-6 bg-white p-4">
          <div className="lg:flex-1 w-full space-y-4">
            <div className="flex flex-col gap-2">
              <label className="block text-gray-600 font-medium mb-1">
                Song title:
              </label>
              <input
                type="text"
                name="songTitle"
                onChange={(e) => {
                  setSongData((prev) => ({
                    ...prev,
                    songTitle: e.target.value,
                  }));
                }}
                value={songData.songTitle}
                className="w-full px-4 py-2 border border-black/50 rounded-lg focus:border-none focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Enter song title..."
                required
              />
            </div>

            <SongFileUpload
              songFileRef={songFileRef}
              setSongFile={setSongFile}
              songFileUploadProgress={songFileUploadProgress}
              handleSongUpload={handleSongUpload}
            />
  
            <SongThumbUpload
              setSongThumbnail={setSongThumbnail}
              songThumbnailRef={songThumbnailRef}
              songThumbnailUploadProgress={songThumbnailUploadProgress}
              handleSongThumbnailUpload={handleSongThumbnailUpload}
            />
          </div>
          <div className="flex flex-col w-fit h-fit p-2 gap-2 border-2 border-[#ffcd2b] overflow-hidden">
            <div className="w-full h-full grid place-items-center">
            <PicPreview url={songData.songThumbnail} />
            </div>
            <hr />
            <h3 className="text-sm font-semibold text-center overflow-hidden whitespace-nowrap">
              <span className="block w-full text-ellipsis overflow-hidden">
                Uploaded song: {uploadedSongName ? uploadedSongName : "N/A"}
              </span>
            </h3>
          </div>
        </div>
        <Devider title={"Song Artist Details"} />
  
        <div className="flex gap-6 flex-col md:flex-row">
          <div className="flex flex-col gap-2 w-full md:max-w-sm">
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
              <div
                tabIndex={4}
                className="dropdown-content bg-white shadow mb-2 w-full max-h-60 overflow-y-auto rounded-md p-2"
              >
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
            {songData.artists.length > 0 && (
              <>
                <h3>Current song's added artists:-</h3>
                {songData.artists.map((artist) => (
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
          onClick={handleUpdateSong}
        >
          {updateLoading ? "Updating..." : "Update Song"}
        </button>
      </div>
    )
  )
}
