import React, { useState } from "react";
import Logo from "../components/Logo";
import { Link, useNavigate } from "react-router-dom";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/slices/userSlice";

export default function Signin() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const { loading } = useSelector((store) => store.user);
  const toastId = "error-toast";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setData((data) => ({
      ...data,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.email || !data.password) {
      if (!toast.isActive(toastId)) {
        toast.error("All fields are required", { toastId });
      }
      return;
    }

    try {
      dispatch(signInStart());
      const response = await axios.post("/api/auth/signin", data);
      if (response.status === 200) {
        dispatch(signInSuccess(response.data.user));
        toast.success("Login success");
        navigate("/");
      } else {
        dispatch(signInFailure(response.data.message));
        if (!toast.isActive(toastId)) {
          toast.error(response.data.message, { toastId });
        }
      }
    } catch (error) {
      dispatch(signInFailure(error.response.data.message));
      if (!toast.isActive(toastId)) {
        toast.error(error.response.data.message, { toastId });
      }
    }
  };
  return (
    <div className="w-screen h-screen flex justify-center items-center p-4 sm:p-0" style={{background:"linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('musify-bg.jpg')", backgroundRepeat:'no-repeat', backgroundSize:'cover'}}>
      <div className="max-w-md dark:shadow-[0px_0px_4px_#a1a1a1] bg-white dark:bg-gray-700 rounded-md shadow-[0px_0px_4px_#555454] w-full flex flex-col items-center p-4 gap-4">
        <Link to={'/'} className="flex items-center gap-2">
          <Logo size={'large'} />
          <h1 className="text-2xl font-semibold text-black dark:text-white">
            Musify<sup className="text-sm">®</sup>
          </h1>
        </Link>
        <form
          className="w-full flex flex-col gap-6 mt-5"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-2">
            <label className="font-medium text-black dark:text-white">Email address</label>
            <input
              name="email"
              value={data.email}
              onChange={handleChange}
              type="email"
              placeholder="Email address"
              className="border-2 border-black/40 rounded-md px-4 py-2 dark:bg-white"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium text-black dark:text-white">Password</label>
            <div className="inline-block relative w-full">
              <input
                name="password"
                value={data.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                maxLength={20}
                placeholder="Password"
                className="w-full border-2 border-black/40 rounded-md px-4 py-2 pr-9 dark:bg-white"
              />
              {showPassword ? (
                <VscEyeClosed
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xl cursor-pointer"
                  onClick={togglePassword}
                />
              ) : (
                <VscEye
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xl cursor-pointer"
                  onClick={togglePassword}
                />
              )}
            </div>
          </div>

          <Link to={'/forgot-password'} className="underline font-medium text-black dark:text-white">Forgot your password?</Link>
          <button
            disabled={loading}
            className="w-full bg-[#ffcd2b] hover:bg-[#f1c40f] py-2 text-black uppercase text-md rounded-md font-bold"
          >
            {loading ? "Loading..." : "Sign in"}
          </button>

          <div className="w-full bg-slate-200 h-[2px]"></div>
          <h3 className="text-md font-semibold text-center dark:text-white">
            Don't have an account?
          </h3>
          <Link
            to={"/signup"}
            replace={true}
            className="w-full text-center text-black dark:text-white border border-black/40 dark:border-white/60 text-black/40 py-2 uppercase text-md rounded-md font-semibold"
          >
            Sign up for musify
          </Link>
        </form>
      </div>
    </div>
  );
}
