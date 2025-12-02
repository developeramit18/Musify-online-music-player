import React, { useState } from "react";
import { AdminSidebar, Header } from "../components";
import { Outlet } from "react-router-dom";
import { HiMenu } from "react-icons/hi";

export default function AdminPanel() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Header />
      <div className="w-full flex flex-col lg:flex-row gap-4 p-2 dark:bg-gray-600">

        <button
          className="lg:hidden bg-gray-200 dark:bg-gray-500 p-2 rounded-md flex items-center"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <HiMenu size={24} />
        </button>


        <div
          className={`${
            sidebarOpen ? "block" : "hidden"
          } lg:block w-full lg:max-w-xs h-auto lg:h-[calc(100vh-100px)] flex p-2 bg-gray-100 dark:bg-gray-500 rounded-md`}
        >
          <AdminSidebar closeSidebar={() => setSidebarOpen(false)} />
        </div>

        <div className="flex-1 h-auto w-full lg:h-[calc(100vh-100px)] flex p-2 lg:p-4 pt-2 bg-gray-100 dark:bg-gray-600 rounded-md overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
}
