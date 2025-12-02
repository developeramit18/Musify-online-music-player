import React from "react";
import { MdDashboard } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { IoMusicalNotes } from "react-icons/io5";
import { TbMusicPlus } from "react-icons/tb";
import { BiSolidPlaylist } from "react-icons/bi";
import { CgPlayListAdd } from "react-icons/cg";
import { CiLogout } from "react-icons/ci";
import { Link } from "react-router-dom";
import { MdOutlineManageAccounts } from "react-icons/md";
import { RiAdminFill } from "react-icons/ri";
import { BiSolidUserCircle } from "react-icons/bi";
import { ImUserPlus } from "react-icons/im";
import axios from 'axios'
import { logout } from "../redux/slices/userSlice";
import { toast } from "react-toastify";
import { addSongs } from "../redux/slices/songSlice";

export default function AdminSidebar({ closeSidebar }) {
  const userState = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const dashLinks = [
    {
      id: 1,
      name: "Dashboard",
      link: "/admin",
      icon: <MdDashboard className="text-2xl" />,
    },
    {
      id: 2,
      name: "Songs",
      link: "/admin/songs",
      icon: <IoMusicalNotes className="text-2xl" />,
    },
    {
      id: 3,
      name: "Add Song",
      link: "/admin/add-song",
      icon: <TbMusicPlus className="text-2xl" />,
    },
    {
      id: 4,
      name: "Playlists",
      link: "/admin/playlists",
      icon: <BiSolidPlaylist className="text-2xl" />,
    },
    {
      id: 5,
      name: "Create Playlist",
      link: "/admin/create-playlist",
      icon: <CgPlayListAdd className="text-2xl" />,
    },
    {
      id:6,
      name:"Artists",
      link:'/admin/artists',
      icon:< BiSolidUserCircle className="text-2xl" />
    },
    {
      id:7,
      name:'Add artist',
      link:'/admin/add-artist',
      icon:<ImUserPlus className="text-2xl"/>
    },
    {
      id: 8,
      name: "User Management",
      link: "/admin/users",
      icon: <MdOutlineManageAccounts className="text-2xl" />,
    },
  ];

  const handleLogout = async() =>{
    try {
      const response = await axios.post('/api/auth/logout');
      if(response.status === 200){
        dispatch(logout());
        dispatch(addSongs([]));
      }
    } catch (error) {     
        toast.error(error.response.data.message, { toastId })
    }
  }

  return (
    <div className="w-full h-full p-0 lg:p-4 flex flex-col justify-between gap-2 lg:gap-5 dark:text-white">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <RiAdminFill className="text-3xl" />
          <div className="flex flex-col">
            <h3 className="font-bold">Admin Dashboard</h3>
            <p className="text-gray-500 dark:text-white/60">Welcome {userState?.user?.name}</p>
          </div>
        </div>
        <div className="w-full flex flex-col text-md gap-1 mt-2 lg:mt-5 font-semibold">
          {dashLinks.map((link) => (
            <Link
              to={link.link}
              className="w-full flex items-center gap-4 p-2 hover:bg-gray-200 rounded-md"
              key={link.id}
              title={link.name}
              onClick={closeSidebar}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </div>
      </div>
      <div
        className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-200 rounded-md p-2 cursor-pointer"
        title="Logout"
        onClick={handleLogout}
      >
        <CiLogout className="text-2xl" />
        <h3 className="font-semibold" >Logout</h3>
      </div>
    </div>
  );
}
