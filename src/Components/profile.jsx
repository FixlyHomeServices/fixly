import React, { useContext } from "react";
import { UserDataContext } from "../context/usercontext";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import UserHeader from "./Userheader";

export default function Profile() {
  const { user } = useContext(UserDataContext);

  return (
    
    <div className="flex h-screen bg-gray-100">
        {/* Side Bar */}
        <aside className="w-1/5 bg-white p-6 border-r border-gray-300">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Account</h2>
          <nav>
            <ul className="space-y-2">
            
            <li className="flex text-left space-x-3 p-3 rounded-lg bg-white text-gray-900 hover:bg-gray-200">
            <Link to="/home" className="w-full h-full">
                <span>Home</span>
            </Link>
            </li>
            <li className="flex items-center space-x-3 p-3 rounded-lg bg-white text-gray-900 hover:bg-gray-200">
              <FaUserCircle className="text-xl" />
              <span>Profile</span>
            </li>
            <li className="flex items-center space-x-3 p-3 rounded-lg bg-white text-gray-900 hover:bg-gray-200">
              <span>💼</span>
              <span>Add Services</span>
            </li>
            <li className="flex items-center space-x-3 p-3 rounded-lg bg-white text-gray-900 hover:bg-gray-200">
            <Link to="/logout" className="w-full h-full">
                <span>Logout</span>
            </Link>
            </li>
            </ul>
          </nav>
        </aside>

        {/* Profile Details */}
      <main className="w-4/5 bg-white p-8">
        <h2 className="text-2xl text-left font-bold text-gray-900">Profile details</h2>

        {/* Profile Section */}
            <div className="flex items-center justify-between mt-6 border-b pb-4">
              <div className="flex items-center space-x-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{user?.fullName || "User Name"}</h3>
                </div>
              </div>
              <div className="flex items-center justify-center w-12 h-12 mx-auto">
                <img
                  src={user?.profilePicture || logo}
                  alt="Profile"
                  className="w-12 h-12 rounded-full"
                />
              </div>
              <Link to="/edit-profile" className="text-blue-600 hover:underline">
                Edit profile
              </Link>
            </div>

            {/* Email Section */}
        <div className="grid grid-cols-3 gap-6 border-b pb-4 mt-6">
            <h3 className="text-lg text-left font-medium text-gray-900 col-span-1">Email addresses</h3>
            <div className="col-span-2">
            <div className="flex items-center">
              <p className="text-gray-600">{user?.email || "example@domain.com"} <span className="bg-gray-300 text-xs px-2 py-1 rounded">Primary</span></p>
              </div>
              <div className="flex items-center">
              <button className="text-blue-600 mt-2 hover:underline">+ Add email address</button>
            </div>
            </div>
          </div>

        {/* Phone Number Section */}
        <div className="grid grid-cols-3 gap-4 border-b pb-4 mt-6">
            <h3 className="text-lg text-left font-medium text-gray-900 col-span-1">Phone number</h3>
            <div className="col-span-2">
                <div className="flex items-center">
                    <p className="text-gray-600">{user?.phone || "+1 (555) 123-4567"} <span className="bg-gray-300 text-xs px-2 py-1 rounded">Primary</span></p>
                    
                </div>
                <div className="flex items-center">
                <button className="text-blue-600 mt-2 hover:underline">+ Add phone number</button>
            </div>
            </div>
          </div>

         {/* Connected Accounts Section */}
         <div className="grid grid-cols-3 gap-4 mt-6">
            <h3 className="text-lg text-left font-medium text-gray-900 col-span-1">Role</h3>
            <div className="col-span-2">
              <div className="flex items-center">
                <p className="text-gray-600">{user?.role || "Customer"} <span className="bg-gray-300 text-xs px-2 py-1 rounded">Primary</span></p>
                </div>
            </div>
          </div>

        
      </main>
    </div>
  );
}
