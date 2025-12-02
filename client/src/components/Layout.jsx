import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { useSelector } from "react-redux";
export default function Layout() {
  const { songs } = useSelector((state) => state.songs);
  const userState = useSelector((state) => state.user);
  return (
    <>
      <Header />
      <div className={`flex gap-2 p-2 dark:bg-gray-600 bg-white px-3 ${songs.length > 0 || !userState.isLoggedIn ? 'h-[calc(100vh-190px)]' : 'h-[calc(100vh-120px)]'}   ${songs.length > 0 || !userState.isLoggedIn ? 'md:h-[calc(100vh-140px)]' : 'md:h-[calc(100vh-90px)]'}`}>
        <div className="h-full hidden lg:inline-block max-w-xs w-full rounded-md overflow-hidden">
          <Sidebar />
        </div>
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
