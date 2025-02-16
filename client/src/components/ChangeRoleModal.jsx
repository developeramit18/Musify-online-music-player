import React from 'react'

export default function ChangeRoleModal({handleHideRoleModal, showRoleModal, userRole, setUserRole, handleUpdateUserRole}) {
  return (
    <div
    className={`fixed inset-0 flex items-center justify-center z-[1000] bg-black bg-opacity-50 transition-opacity ${
      showRoleModal ? "visible opacity-100" : "invisible opacity-0"
    }`}
    onClick={handleHideRoleModal}
  >
    <div
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 bg-white w-full max-w-sm mx-auto p-4 rounded-b-lg shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
        onClick={handleHideRoleModal}
      >
        ✕
      </button>

      <div className="flex justify-center border-b pb-3">
        <h2 className="text-lg font-semibold">Update User role</h2>
      </div>

      <div className="flex items-center gap-2 justify-center my-3">
      <label htmlFor="role-select" className="text-gray-700 font-medium">
            Select Role:
          </label>
          <select
            id="role-select"
            value={userRole} 
            onChange={(e) => setUserRole(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          >
            <option value="Admin" className="text-gray-800 font-semibold">Admin</option>
            <option value="User" className="text-gray-800 font-semibold">User</option>
          </select>
      </div>
      <button className='w-full py-2 bg-[#ffcd2b] font-semibold my-3' onClick={handleUpdateUserRole}>Update Role</button>
    </div>
  </div>
  )
}
