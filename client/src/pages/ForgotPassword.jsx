import React, { useState } from "react";
import Logo from "../components/Logo";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const toastId = "error-toast";
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || email === '') {
      if (!toast.isActive(toastId)) {
        toast.error("Email is required", { toastId });
      }
      return;
    }

    try {
        setLoading(true)
      const response = await axios.post("/api/auth/forgot-password", {email});
      setLoading(false)
      if (response.status === 200) {
        toast.success(response.data.message || "Reset link sent to your email");
        sessionStorage.setItem("canAccessSuccess", "true");
        navigate('/forgot-password/success')
      } else {
        if (!toast.isActive(toastId)) {
          toast.error(response.data.message || "Something went wrong", { toastId });
        }
      }
    } catch (error) {
        setLoading(false)
      if (!toast.isActive(toastId)) {
        toast.error(error.response.data.message || "Error:Reset passworod link", { toastId });
      }
    }
  };
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="max-w-md lg:shadow-[0px_0px_4px_#555454] w-full flex flex-col items-center p-4 gap-4">
        <div className="flex items-center gap-2 mt-4">
          <Logo size={'large'} />
          <h1 className="text-2xl font-semibold">
            Musify<sup className="text-sm">®</sup>
          </h1>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold">Reset your password</h2>
        <p className="text-center font-medium">Enter your linked email address to your Musify account and we'll send you an email.</p>
        <form
          className="w-full flex flex-col gap-6 mt-5"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-2">
            <label className="font-medium">Email address</label>
            <input
              name="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              type="email"
              placeholder="Email address"
              className="border-2 border-black/40 rounded-md px-4 py-2"
            />
          </div>
          <button
            disabled={loading}
            className="w-full bg-[#ffcd2b] hover:bg-[#f1c40f] py-2 my-8 text-black uppercase text-md rounded-md font-bold"
          >
            {loading ? "Loading..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}
