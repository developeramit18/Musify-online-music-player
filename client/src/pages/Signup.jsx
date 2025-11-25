import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/slices/userSlice";
import axios from "axios";
import { Logo } from "../components";

export default function Signup() {
  const [showPassword, setShowPassword] = React.useState(false);
  const toastId = "error-toast";
  const dispatch = useDispatch();
  const { loading } = useSelector((store) => store.user);
  const navigate = useNavigate();

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setSignupData((signupData) => ({
      ...signupData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !signupData.name ||
      !signupData.email ||
      !signupData.password ||
      signupData.email === "" ||
      signupData.password === "" ||
      signupData.name === ""
    ) {
      if (!toast.isActive(toastId)) {
        toast.error("All fields are required", { toastId });
      }
      return;
    }

    try {
      dispatch(signInStart());
      const response = await axios.post("/api/auth/signup", signupData, {
        withCredentials: true,
      });

      if (response.status === 201) {
        dispatch(signInSuccess(response.data.user));
        toast.success("signup success");
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
    <div
      className="w-screen h-screen flex justify-center items-center"
      style={{
        background:
          "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('musify-bg.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="max-w-md dark:shadow-[0px_0px_4px_#a1a1a1] bg-white rounded-md shadow-[0px_0px_4px_#555454] w-full flex flex-col items-center p-4 gap-4">
        <Link to={"/"}>
          <Logo size={"extraLarge"} />
        </Link>
        <h1 className="font-bold text-xl md:text-3xl -mt-2 text-center">
          Sign up to start listening
        </h1>
        <form
          className="w-full flex flex-col gap-6 mt-5"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-2">
            <label className="font-medium">Name</label>
            <input
              name="name"
              onChange={handleChange}
              type="text"
              placeholder="name"
              className="border-2 border-black/40 rounded-md px-4 py-2"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium">Email address</label>
            <input
              name="email"
              onChange={handleChange}
              type="email"
              placeholder="name@domain.com"
              className="border-2 border-black/40 rounded-md px-4 py-2"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium">Create a strong password</label>
            <div className="relative">
              <input
                name="password"
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full border-2 border-black/40 rounded-md px-4 py-2 pr-8"
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

          <button
            disabled={loading}
            className="w-full bg-[#ffcd2b] hover:bg-[#f1c40f] py-2 text-black uppercase text-md rounded-md font-bold"
          >
            {loading ? "Loading..." : "Sign up"}
          </button>
          {/* A devider */}
          <div className="w-full bg-slate-200 h-[2px]"></div>

          <div className="flex items-center justify-center text-md gap-1">
            <p className="text-black/90 font-medium dark:text-white/90">
              Already have an account?
            </p>
            <Link
              className="underline text-black dark:text-white font-bold"
              to={"/signin"}
              replace={true}
            >
              Log in here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
