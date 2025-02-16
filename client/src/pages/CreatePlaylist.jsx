import React, { useRef, useState } from "react";
import PicPreview from "../components/PicPreview";
import { toast } from "react-toastify";
import { app } from '../firebase';
import axios from 'axios'
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
import PlaylistCoverPic from "../components/PlaylistCoverPic";
import SetSelectedSongs from "../components/SetSelectedSong";
export default function AddArtist() {
  const [playlistData, setPlaylistData] = useState({
    name: "",
    thumbnail: "https://firebasestorage.googleapis.com/v0/b/music-player-48afa.appspot.com/o/playlist-cover%2Fplaylist_cover.png?alt=media&token=d24f23ae-7a34-4d18-9c35-659a2aa17d7e",
    songs:[]
  });

  const playlistPicRef = useRef();
  const [playlistPic, setPlaylistPic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [playlistPicUploadProgress, setPlaylistPicUploadProgress] = useState(null);
  const toastId = "toast-error";
  const [filteredSongs, setFilteredSongs] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlaylistData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaylistPicUpload = async (folder) => {
    if (!playlistPic) {
      if (!toast.isActive(toastId)) {
        toast.error("Select playlist pic first!", { toastId });
      }
      return;
    }
    try {
      const storage = getStorage(app);
      const storageRef = ref(storage, `${folder}/${playlistPic.name}`);
      const uploadTask = uploadBytesResumable(storageRef, playlistPic);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setPlaylistPicUploadProgress(progress.toFixed(2));
        },
        (error) => {
          setPlaylistPicUploadProgress(null);
          setPlaylistPic(null);
          toast.error(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setPlaylistPicUploadProgress(null);
            toast.success("Playlist pic uploaded");
            playlistPicRef.current.value = "";
            setPlaylistData((prev) => ({ ...prev, thumbnail: downloadURL }));
          });
        }
      );
    } catch (error) {
      if (!toast.isActive(toastId)) {
        toast.error(error.message, { toastId });
      }
    }
  };
  
  const handleSelectSong = (song) => {
    if (playlistData.songs.includes(song)) {
      setPlaylistData(prev => ({...prev, songs: playlistData.songs.filter((s) => s !== song)}));
    } else {
      setPlaylistData(prev => ({...prev, songs: [...playlistData.songs, song]}));
    }
  };

  const handleSelectAll = () => {
    if (playlistData.songs.length === filteredSongs.length) {
      setPlaylistData(prev => ({...prev, songs: []}));
    } else {
      setPlaylistData(prev => ({...prev, songs: filteredSongs.map((song) => song._id)}));
    }
  };
  
  const handleAddPlaylist = async() =>{
    if(playlistPicUploadProgress) {
      toast.info('Playlist pic still uploading!!!')
      return
    }
    if(playlistData.name === ""){
      if(!toast.isActive(toastId)){
        toast.error("Enter playlist name", {toastId})
      }
      return
    }
    if(playlistData.songs.length === 0){
      if(!toast.isActive(toastId)){
        toast.error("Select at least one song for this playlist", {toastId})
      }
      return
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/playlist/create', playlistData);
      if(response.status === 201){
        toast.success(response.data.message);
        setLoading(false);
        setPlaylistData(prev => ({
          ...prev,
          name:'',
          thumbnail:'https://firebasestorage.googleapis.com/v0/b/music-player-48afa.appspot.com/o/playlist-cover%2Fplaylist_cover.png?alt=media&token=d24f23ae-7a34-4d18-9c35-659a2aa17d7e',
          songs:[]
        }))
      }else{
        toast.error(response.data.message);
        setLoading(false);
      }
    } catch (error) {
      if(!toast.isActive(toastId)){
        toast.error(error.response.data.message, {toastId})
      }
      setLoading(false);
    }
  }
  return (
    <div className="w-full h-full p-0 sm:p-2 flex flex-col">
      <h2 className="text-2xl font-bold text-center">Create Playlist</h2>
      <div className="w-full flex flex-col-reverse lg:flex-row items-center mt-4 gap-6 bg-white p-4">
        <div className="lg:flex-1 w-full space-y-4">
          <div className="flex flex-col gap-2">
            <label className="block text-gray-600 font-medium mb-1">
              Playlist Name:
            </label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              value={playlistData.name}
              className="w-full px-4 py-2 border border-black/50 rounded-lg focus:border-none focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter Playlist name"
              required
            />
          </div>

          {/* Playlist File Upload */}
          <PlaylistCoverPic
            playlistPicRef={playlistPicRef}
            setPlaylistPic={setPlaylistPic}
            playlistPicUploadProgress={playlistPicUploadProgress}
            handlePlaylistPicUpload={handlePlaylistPicUpload}
          />
        </div>
        <div className="flex flex-col h-fit p-2 gap-2 border-2 border-dotted border-[#ffcd2b]">
          <PicPreview url={playlistData.thumbnail} />
          <h3 className="text-center font-semibold">Current Playlist cover*</h3>
        </div>
      </div>
      <SetSelectedSongs handleSelectSong={handleSelectSong} handleSelectAll={handleSelectAll} filteredSongs={filteredSongs} setFilteredSongs={setFilteredSongs} selectedSongs={playlistData.songs}  />
      <button disabled={loading} onClick={handleAddPlaylist} className="my-2 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300">
        {
          loading ? 'Creating new Playlist....' : 'Create Playlist'
        }
      </button>
    </div>
  );
}
