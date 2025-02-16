import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PaginationBar from "../components/PaginationBar";
import DeleteUserPopupModal from "../components/DeleteUserPopupModal";
import ChangeRoleModal from "../components/ChangeRoleModal";
import { FiSearch } from "react-icons/fi";

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userRoleId, setUserRoleId] = useState(null);
  const [totalUser, setTotalUser] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const toastId = "toastId";
  const usersPerPages = 8;

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users); 
    } else {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
      setCurrentPage(1); 
    }
  }, [searchTerm, users]);

  const getAllUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/dashboard/users`);
      setLoading(false);

      if (response.status === 200) {
        setUsers(response.data.users);
        setTotalUser(response.data.totalUsers);
      }
    } catch (error) {
      setLoading(false);
      if (!toast.isActive(toastId)) {
        toast.error(error.response?.data?.message || "Something went wrong", {
          toastId,
        });
      }
    }
  };

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPages,
    currentPage * usersPerPages
  );

  const handleShowPopup = (userId) => {
    setShowPopup(true);
    setDeleteUserId(userId);
  };

  const handleHidePopup = () => {
    setShowPopup(false);
    setDeleteUserId(null);
  };

  const handleShowRoleModal = (userId, role) => {
    setShowRoleModal(true);
    setUserRoleId(userId);
    setUserRole(role);
  };

  const handleHideRoleModal = () => {
    setShowRoleModal(false);
    setUserRoleId(null);
    setUserRole(null);
  };

  const handleUpdateUserRole = async () => {
    try {
      const response = await axios.put(
        `/api/dashboard/user/update-role/${userRoleId}`,
        { role: userRole }
      );
      if (response.status === 200) {
        toast.success(
          response.data.message || "User role updated successfully"
        );
        handleHideRoleModal();
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userRoleId
              ? { ...user, isAdmin: userRole === "Admin" ? true : false }
              : user
          )
        );
      }
    } catch (error) {
      toast.error(
        error.response.data.message || "Error in updating user role!!!"
      );
      handleHideRoleModal();
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-GB");
  };

  const handlePageClick = (selected) => {
    setCurrentPage(selected);
  };

  return (
    <div className="w-full h-full">
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between p-2 pb-4">
        <h2 className="text-2xl font-semibold">Total Users: {totalUser}</h2>
        <div className="flex items-center relative gap-2 bg-gray-300 p-2 rounded-full cursor-pointer group">
          <FiSearch
            className={`text-xl font-bold text-black/70 transition-all duration-200`}
            title="search"
          />
          <input
            type="text"
            className={`flex flex-1 bg-transparent text-black placeholder:text-black/70 outline-none focus:outline-none`}
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white min-h-[calc(100vh-170px)]">
            <table className="min-w-full rounded-lg border border-gray-300">
              <thead>
                <tr className="bg-gray-200 border-b-2 border-gray-300">
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium hidden sm:table-cell">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium hidden md:table-cell">
                    Signup Date
                  </th>
                  <th className="px-4 py-3 text-center text-gray-600 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {!loading && paginatedUsers.length <= 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No User found!!!
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((user, index) => (
                    <tr
                      key={index + 1}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">{user.name}</td>

                      <td className="px-4 py-3 text-gray-700 font-bold max-w-[200px] truncate">
                        {user.email}
                      </td>

                      <td className="px-4 py-3 text-gray-700 hidden sm:table-cell">
                        {user.isAdmin ? "Admin" : "User"}
                      </td>

                      <td className="px-4 py-3 text-gray-700 hidden md:table-cell">
                        {formatDate(user.createdAt)}
                      </td>

                      <td className="px-4 py-3 text-center flex items-center justify-center space-x-2">
                        <button
                          onClick={(e) => {
                            handleShowRoleModal(
                              user._id,
                              `${user.isAdmin ? "Admin" : "User"}`
                            );
                          }}
                          className="text-blue-500 hover:text-blue-700 mr-2"
                        >
                          Edit Role
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleShowPopup(user._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <PaginationBar
              totalPages={Math.ceil(filteredUsers.length / usersPerPages)}
              handlePageClick={handlePageClick}
            />
            {showPopup && (
              <DeleteUserPopupModal
                showPopup={showPopup}
                deleteUserId={deleteUserId}
                setUsers={setUsers}
                handleHidePopup={handleHidePopup}
                setTotalUser={setTotalUser}
              />
            )}

{
              showRoleModal && 
              <ChangeRoleModal
                showRoleModal={showRoleModal}
                setShowRoleModal={setShowRoleModal}
                handleHideRoleModal={handleHideRoleModal}
                userRole={userRole}
                setUserRole={setUserRole}
                handleUpdateUserRole={handleUpdateUserRole}
              />
            }
          </div>
        </>
      )}
    </div>
  );
}
