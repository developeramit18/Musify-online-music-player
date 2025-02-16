import React, { useState } from "react";
import Logo from "../components/Logo";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/slices/userSlice";

export default function ResetPassword() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toastId = "error-toast";
  const dispatch = useDispatch();

  const toggleNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };
  const toggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || newPassword === "") {
      if (!toast.isActive(toastId)) {
        toast.error("Password is required", { toastId });
      }
      return;
    }

    if(newPassword !== confirmPassword){
      if (!toast.isActive(toastId)) {
        toast.error("Password not match", { toastId });
      }
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`/api/auth/reset-password/${token}`, {
        newPassword,
      });
      setLoading(false);
      if (response.status === 200) {
        toast.success(response.data.message || "Password reset successfully!");
        dispatch(signInSuccess(response.data));
        sessionStorage.setItem("canAccessSuccess", "true");
navigate("/reset-password/success");
      } else {
        if (!toast.isActive(toastId)) {
          toast.error(response.data.message || "Something went wrong", {
            toastId,
          });
        }
      }
    } catch (error) {
      setLoading(false);
      if (!toast.isActive(toastId)) {
        toast.error(
          error.response.data.message || "Reset Password error!!!",
          { toastId }
        );
      }
    }
  };
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="max-w-md lg:shadow-[0px_0px_4px_#555454] w-full flex flex-col items-center p-4 py-8 gap-4">
        <div className="flex items-center gap-2">
          <Logo size={"large"} />
          <h1 className="text-2xl font-semibold">
            Musify<sup className="text-sm">®</sup>
          </h1>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold">Create new password</h2>
        <p className="text-center font-medium">
          Please enter your new password below for your Musify account
        </p>
        <form
          className="w-full flex flex-col gap-6 mt-5"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-2">
            <label className="font-medium">Password</label>
            <div className="inline-block relative w-full">
              <input
                name="password"
                value={newPassword}
                onChange={(e)=>setNewPassword(e.target.value)}
                type={showNewPassword ? "text" : "password"}
                maxLength={20}
                placeholder="Password"
                className="w-full border-2 border-black/40 rounded-md px-4 py-2 pr-9"
              />
              {showNewPassword ? (
                <VscEyeClosed
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xl cursor-pointer"
                  onClick={toggleNewPassword}
                />
              ) : (
                <VscEye
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xl cursor-pointer"
                  onClick={toggleNewPassword}
                />
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium">Confirm Password</label>
            <div className="inline-block relative w-full">
              <input
                name="password"
                value={confirmPassword}
                onChange={(e)=>setConfirmPassword(e.target.value)}
                type={showConfirmPassword ? "text" : "password"}
                maxLength={20}
                placeholder="Password"
                className="w-full border-2 border-black/40 rounded-md px-4 py-2 pr-9"
              />
              {showConfirmPassword ? (
                <VscEyeClosed
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xl cursor-pointer"
                  onClick={toggleConfirmPassword}
                />
              ) : (
                <VscEye
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xl cursor-pointer"
                  onClick={toggleConfirmPassword}
                />
              )}
            </div>
          </div>
          <button
            disabled={loading}
            className="w-full bg-[#ffcd2b] hover:bg-[#f1c40f] py-2 text-black uppercase text-md rounded-md font-bold"
          >
            {loading ? "Loading..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
