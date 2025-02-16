import React from "react";
import { useNavigate } from "react-router-dom";

export default function SidebarLogin() {
  const navigate = useNavigate();
  return (
    <div className="bg-slate-200 p-4 w-full rounded-lg text-black mt-3">
      <h2 className="text-lg font-semibold">Ready to get started?</h2>
      <p className="text-sm text-gray-700 mt-1">Sign up today to unlock a world of music, playlists, and more!</p>
      <button onClick={()=>navigate('/signup')} className="mt-4 px-4 py-2 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-all duration-200">
        Sign Up Now
      </button>
    </div>
  );
}
