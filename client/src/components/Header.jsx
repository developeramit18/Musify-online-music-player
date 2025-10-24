import React, { useEffect, useState } from "react";
import Logo from "./Logo";
import { Link, replace, useNavigate } from "react-router-dom";
import { TiHome } from "react-icons/ti";
import { FiSearch } from "react-icons/fi";
import { FaBars } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineDashboard } from "react-icons/md";
import { TbLogout2 } from "react-icons/tb";
import axios from "axios";
import { toast } from "react-toastify";
import { logout } from "../redux/slices/userSlice";
import Loader from "./Loader";
import { addSongs } from "../redux/slices/songSlice";
import { FaTimes } from "react-icons/fa";
import SearchModal from "./SearchModal";

export default function Header() {
  const [searchedData, setSearchedData] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [search, setSearch] = useState("");
  const [showSearchData, setShowSearchData] = useState(false);
  const navigate = useNavigate();
  const userState = useSelector((state) => state.user);
  const toastId = "error-toast";
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const response = await axios.post("/api/auth/logout");
      if (response.status === 200) {
        dispatch(logout());
        dispatch(addSongs([]));
      }
    } catch (error) {
      if (!toast.isActive(toastId)) {
        toast.error(error.response.data.message, { toastId });
      }
    }
  };

  const handleSearch = async () => {
    try {
      if (search !== "") {
        setSearchLoading(true);
        setShowSearchData(true);
        const response = await axios.get(
          `/api/song/search?searchTerm=${search}`
        );
        console.log(response)
        if (response.status === 200) {
          setSearchedData(response.data);
        }
        setSearchLoading(false);
      }
    } catch (error) {
      setSearchLoading(false);
      setShowSearchData(false);
      toast.error(error.response.data.message);
    }
  };

  const handlePlaySong = (song) => {
    if (userState.isLoggedIn) {
      dispatch(addSongs([song]));
      setSearchedData([]);
      setSearch("");
    } else {
      navigate("/signin");
    }
  };

  useEffect(() => {
    if (search !== "") {
      handleSearch();
    } else {
      setSearchedData([]);
      setShowSearchData(false);
    }
  }, [search]);

  return (
    <div className="w-screen flex justify-between items-center p-5 ">
      <Link to={"/"}>
        <Logo size={"extraLarge"} />
      </Link>
      <div className="flex items-center justify-center gap-4 w-full lg:max-w-md">
        <div
          onClick={() => navigate("/")}
          className="w-9 h-9 flex justify-center items-center rounded-full bg-[#464646] hover:bg-[#444444] cursor-pointer"
        >
          <TiHome className="text-white/80 hover:text-white text-xl" />
        </div>
        <div
          className={`flex items-center relative gap-2 bg-[#464646] hover:bg-[#444444] p-2 rounded-full cursor-pointer group lg:flex-1`}
        >
          <FiSearch
            className={`text-xl font-bold text-white/80 group-hover:text-white transition-all duration-200`}
            title="search"
            onClick={() => setShowSearchModal(!showSearchModal)}
          />
          <input
            type="text"
            value={search}
            className={`hidden md:flex flex-1 dark:bg-white bg-transparent text-white placeholder:text-white/70 outline-none focus:outline-none`}
            placeholder="What do you want to play?"
            onChange={(e) => setSearch(e.target.value)}
          />
          {showSearchData &&
            (searchLoading ? (
              <div className="absolute hidden md:inline-block z-10 top-14 left-0 w-full bg-[#464646] text-white p-2 rounded-b-lg">
                <Loader />
              </div>
            ) : showSearchData && searchedData.length > 0 ? (
              <div className="absolute hidden md:inline-block z-10 top-14 left-0 w-full max-h-[300px] overflow-y-auto bg-[#464646] text-white p-2 rounded-b-lg">
                {searchedData.map((song) => (
                  <p
                    key={song._id}
                    className="truncate py-2 px-1 hover:bg-gray-200 hover:text-black transition-all duration-200"
                    onClick={() => handlePlaySong(song)}
                  >
                    {song.title}
                  </p>
                ))}
              </div>
            ) : (
              <div className="absolute z-10 hidden md:inline-block  top-14 left-0 w-full bg-[#464646] text-white p-2 rounded-b-lg">
                <p>No data found :)</p>
              </div>
            ))}
        </div>
      </div>

      {userState.isLoggedIn ? (
        <div className="hidden lg:flex items-center gap-5">
          {userState?.user?.isAdmin && (
            <div
              className="flex gap-2 items-center cursor-pointer shadow-lg bg-[#ffcd2b] text-black px-3 py-2"
              onClick={() => navigate("/admin")}
            >
              Dashboard <MdOutlineDashboard />{" "}
            </div>
          )}
          <div
            className="flex gap-2 items-center cursor-pointer shadow-lg text-red-600 font-semibold bg-gray-100 px-3 py-2"
            onClick={handleLogout}
          >
            Logout <TbLogout2 />{" "}
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex item-center gap-3">
          <Link
            to={"/signup"}
            replace={true}
            className="rounded-full px-4 py-2  font-semibold hover:scale-105"
          >
            Sign up
          </Link>
          <Link
            to={"/signin"}
            replace={true}
            className="rounded-full px-4 py-2 bg-[#ffcd2b] text-white font-semibold hover:scale-105"
          >
            Log in
          </Link>
        </div>
      )}

      <div
        className="lg:hidden cursor-pointer text-black"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? (
          <FaTimes className="text-2xl md:text-3xl" />
        ) : (
          <FaBars className="text-2xl md:text-3xl" />
        )}
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setMenuOpen(false)}
        >
          <div className="absolute top-0 right-0 w-2/3 h-full bg-white shadow-lg p-5 flex flex-col gap-4">
            {userState.isLoggedIn ? (
              <>
                {userState?.user?.isAdmin && (
                  <div
                    className="flex items-center gap-2 cursor-pointer shadow-lg bg-[#ffcd2b] text-black px-3 py-2"
                    onClick={() => {
                      navigate("/admin");
                      setMenuOpen(false);
                    }}
                  >
                    Dashboard <MdOutlineDashboard />
                  </div>
                )}
                <Link to={'/liked-songs'}
                  className="flex items-center gap-2 cursor-pointer shadow-lg text-green-500 font-semibold bg-gray-100 px-3 py-2"
                  onClick={() => {
                    setMenuOpen(false);
                  }}
                >
                  Liked Songs
                </Link>
                <div
                  className="flex items-center gap-2 cursor-pointer shadow-lg text-red-600 font-semibold bg-gray-100 px-3 py-2"
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                >
                  Logout <TbLogout2 />
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="block px-4 py-2 font-semibold"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign up
                </Link>
                <Link
                  to="/signin"
                  className="block px-4 py-2 bg-[#ffcd2b] text-white font-semibold"
                  onClick={() => setMenuOpen(false)}
                >
                  Log in
                </Link>
              </>
            )}
          </div>
        </div>
      )}
      {showSearchModal && (
        <SearchModal
          showSearchModal={showSearchModal}
          setShowSearchModal={setShowSearchModal}
          showSearchData={showSearchData}
          search={search}
          setSearch={setSearch}
          searchLoading={searchLoading}
          searchedData={searchedData}
        />
      )}
    </div>
  );
}
