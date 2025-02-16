import React, { useRef, useState } from "react";
import PicPreview from "../components/PicPreview";
import { toast } from "react-toastify";
import { app } from "../firebase";
import axios from "axios";
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
import ArtistPicUpload from "../components/ArtistPicUpload";
export default function AddArtist() {
  const [artistData, setArtistData] = useState({
    name: "",
    pic: "https://firebasestorage.googleapis.com/v0/b/music-player-48afa.appspot.com/o/Artist%20pics%2Fuser.jpeg?alt=media&token=0d8aa4cf-a177-4421-850a-9750180a8878",
  });

  const artistPicRef = useRef();
  const [artistPic, setArtistPic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [artistPicUploadProgress, setArtstPicUploadProgress] = useState(null);
  const toastId = "toast-error";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setArtistData((prev) => ({ ...prev, [name]: value }));
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
      const response = await axios.post(
        "/api/artist/add-new-artist",
        artistData
      );
      if (response.status === 201) {
        toast.success(response.data.message);
        setLoading(false);
        setArtistData((prev) => ({
          ...prev,
          name: "",
          pic: "https://firebasestorage.googleapis.com/v0/b/instagram-296d0.appspot.com/o/user.jpeg?alt=media&token=944db7f2-56d9-4f6f-95a6-0216cfa649fb",
        }));
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
  return (
    <div className="w-full h-full p-4 flex flex-col">
      <h2 className="text-2xl font-bold text-center">Add a new Artist</h2>

      <div className="w-full flex flex-col-reverse lg:flex-row items-center mt-4 gap-6 bg-white p-4 rounded-lg shadow-md">
        <div className="lg:flex-1 w-full space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-gray-600 font-medium">Artist Name:</label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              value={artistData.name}
              className="w-full px-4 py-2 border border-black/50 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter Artist name"
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

        <div className="flex flex-col items-center justify-center w-full sm:w-72 md:w-64 h-fit p-3 gap-2 border-2 border-dotted border-[#ffcd2b] rounded-lg">
          <PicPreview url={artistData.pic} />
          <h3 className="text-center font-semibold">Current artist pic*</h3>
        </div>
      </div>

      <button
        disabled={loading}
        onClick={handleAddArtist}
        className="my-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 transition-all duration-200"
      >
        {loading ? "Adding new artist..." : "Add artist"}
      </button>
    </div>
  );
}
