import React, { useEffect, useState } from "react";
import axios from 'axios'
import { toast } from "react-toastify";
export default function DeleteUserPopupModal({showPopup, deleteUserId, handleHidePopup, setUsers, setTotalUser}) {

  const [loading, setLoading] = useState(false)
  const toastId = 'toastId'

    const handleDeleteUser = async () =>{
      try {
        setLoading(true);
        const response = await axios.delete(`/api/dashboard/users/${deleteUserId}`);
        setLoading(false);
        handleHidePopup();
        
        if (response.status === 200) {
          toast.success(response.data.msg);
          setTotalUser(prev => prev-1);
          setUsers((prevUsers) =>
            prevUsers.filter((user) =>
              user._id !== deleteUserId
            )
          );       
        }
      } catch (error) {
        setLoading(false);
        handleHidePopup();
        if (!toast.isActive(toastId)) {
          toast.error(error.response?.data?.message || "Something went wrong", {
            toastId,
          });
        }
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
            Suspend user !!!
          </p>
          <div className="modal-action">
            <div className="flex gap-4">
              <button className="btn text-red-500" onClick={handleDeleteUser}>{loading ? "Please wait..." : 'Yes, I\'m sure'}</button>
              <button className="btn" onClick={handleHidePopup}>Close</button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
