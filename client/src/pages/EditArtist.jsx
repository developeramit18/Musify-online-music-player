import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import PicPreview from "../components/PicPreview";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
import ArtistPicUpload from "../components/ArtistPicUpload";

export default function EditArtist() {
  const { artistId } = useParams();
  const artistPicRef = useRef();
  const [artistData, setArtistData] = useState({});
  const [artistPic, setArtistPic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [artistPicUploadProgress, setArtstPicUploadProgress] = useState(null);
  const toastId = "toast-error";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setArtistData((prev) => ({ ...prev, [name]: value }));
  };

  const getArtistData = async () => {
    try {
      const response = await axios.get(`/api/artist/${artistId}`);
      if (response.status === 200) {
        setArtistData(response.data.artist);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const handleArtistPicUpload = async (folder) => {
    if (!artistPic) {
      if (!toast.isActive(toastId)) {
        toast.error("Select artist pic first!", { toastId });
      }
      return;
    }
    try {
      const storage = getStorage(app);
      const storageRef = ref(storage, `${folder}/${artistPic.name}`);
      const uploadTask = uploadBytesResumable(storageRef, artistPic);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setArtstPicUploadProgress(progress.toFixed(2));
        },
        (error) => {
          setArtstPicUploadProgress(null);
          setArtistPic(null);
          toast.error(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setArtstPicUploadProgress(null);
            toast.success("Artist pic uploaded");
            artistPicRef.current.value = "";
            setArtistData((prev) => ({ ...prev, pic: downloadURL }));
          });
        }
      );
    } catch (error) {
      if (!toast.isActive(toastId)) {
        toast.error(error.message, { toastId });
      }
    }
  };

  const handleAddArtist = async () => {
    if (artistPicUploadProgress) {
      toast.info("Artist pic is still uploading!!!");
      return;
    }
    if (artistData.name === "") {
      if (!toast.isActive(toastId)) {
        toast.error("Enter artist name", { toastId });
      }
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(
        `/api/artist/${artistId}`,
        artistData
      );
      if (response.status === 200) {
        toast.success("Artist updated successfully");
        setLoading(false);
        setArtistData(response.data);
      } else {
        toast.error(response.data.message);
        setLoading(false);
      }
    } catch (error) {
      if (!toast.isActive(toastId)) {
        toast.error(error.response.data.message, { toastId });
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    getArtistData();
  }, [artistId]);

  return (
    <div className="w-full h-full p-0 sm:p-2 flex flex-col">
      <h2 className="text-2xl font-bold text-center">Update Artist</h2>
      <div className="w-full flex flex-col-reverse lg:flex-row items-center mt-4 gap-6 bg-white p-4">
        <div className="flex-1 p-2 space-y-4">
          <div className="flex flex-col gap-2">
            <label className="block text-gray-600 font-medium mb-1">
              Artist Name:
            </label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              value={artistData.name}
              className="w-full px-4 py-2 border border-black/50 rounded-lg focus:border-none focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Artist name"
              required
            />
          </div>

          <ArtistPicUpload
            artistPicRef={artistPicRef}
            setArtistPic={setArtistPic}
            artistPicUploadProgress={artistPicUploadProgress}
            handleArtistPicUpload={handleArtistPicUpload}
          />
        </div>
        {console.log(artistData)}
        <div className="flex flex-col w-fit h-fit p-2 gap-2 border-2 border-dotted border-[#ffcd2b]">
          <PicPreview url={artistData.pic} />
          <h3 className="text-center font-semibold">Current artist pic*</h3>
        </div>
      </div>
      <button
        disabled={loading}
        onClick={handleAddArtist}
        className="my-2 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
      >
        {loading ? "Updating artist...." : "Update artist"}
      </button>
    </div>
  );
}
