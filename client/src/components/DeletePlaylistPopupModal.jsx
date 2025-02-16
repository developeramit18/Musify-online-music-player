import React, { useEffect, useState } from "react";
import axios from 'axios'
import { toast } from "react-toastify";
export default function DeletePlaylistPopupModal({showPopup, deletePlaylistId, handleHidePopup, getAllPlaylists}) {


  const [loading, setLoading] = useState(false)
  const toastId = 'toastId'

    const handleDeletePlaylist = async () =>{
      try {
        setLoading(true);
        const response = await axios.delete(`/api/playlist/${deletePlaylistId}`);
        setLoading(false);
        handleHidePopup();
        
        if (response.status === 200) {
          toast.success(response.data.message);
          getAllPlaylists();          
        }
      } catch (error) {
        setLoading(false);
        handleHidePopup();
        toast.error(error.response?.data?.message || "Something went wrong")
      }
    }

    useEffect(()=>{
        document.getElementById('my_modal_5').showModal()
    },[showPopup])
  return (
    <>
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Are you sure?</h3>
          <p className="py-4">
            You can't recover this playlist in future.
          </p>
          <div className="modal-action">
            <div className="flex gap-4">
              <button className="btn text-red-500" onClick={handleDeletePlaylist}>{loading ? "Please wait..." : 'Yes, I\'m sure'}</button>
              <button className="btn" onClick={handleHidePopup}>Close</button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
