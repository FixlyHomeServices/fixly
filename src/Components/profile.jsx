import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaUserCircle,
  FaHome,
  FaSignOutAlt,
  FaEdit,
  FaPlus,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { setAuthUser } from "../redux/authSlice";
import logo from "../assets/logo.png";
import { ListBulletIcon } from "@heroicons/react/24/outline";

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:3001/auth/logout", {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setAuthUser(null));
        navigate("/login");
        alert("Logout successful!");
      }
    } catch (error) {
      console.error(error);
      alert("Logout Unsuccessful! Try Again");
    }
  };

  // Menu items for sidebar
  const sidebarMenuItems = [
    {
      icon: <FaHome className="text-xl" />,
      label: "Home",
      to: "/",
    },
    {
      icon: <ListBulletIcon className="h-8 w-8" />,
      label: "Dashboard",
      to: "/dashboard",
    },
    {
      icon: <FaUserCircle className="text-xl" />,
      label: "Profile",
      to: "/profile",
      active: true,
    },
    {
      icon: <span className="text-xl">💼</span>,
      label: "Add Services",
      to: "/addservices",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Side Bar */}
      <aside className="w-64 bg-white shadow-md border-r border-gray-200">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
            <h2 className="text-2xl font-bold text-gray-800">Account</h2>
          </div>
          <nav>
            <ul className="space-y-2">
              {sidebarMenuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.to}
                    className={`
                      flex items-center space-x-3 p-3 rounded-lg transition-colors
                      ${
                        item.active
                          ? "bg-blue-50 text-blue-600 font-semibold"
                          : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      }
                    `}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={logoutHandler}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <FaSignOutAlt className="text-xl" />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Profile Details */}
      <main className="flex-1 bg-gray-50 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <div className="flex items-center justify-between mb-8 border-b pb-6">
            <h2 className="text-3xl font-bold text-gray-900">
              Profile Details
            </h2>
            <Link
              to="/edit-profile"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <FaEdit />
              <span>Edit Profile</span>
            </Link>
          </div>

          {/* Personal Info Section */}
          <div className="grid md:grid-cols-3 gap-6 border-b pb-6 mb-6">
            <div className="md:col-span-1 flex items-center space-x-4">
              <img
                src={user?.profilePicture || logo}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-4 border-blue-100 shadow-md"
              />
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {user?.fullName || "User Name"}
                </h3>
                <p className="text-gray-500">
                  {user?.roles?.[0] || "Customer"}
                </p>
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              {/* Contact Details */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Email Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                      <FaEnvelope className="text-blue-500" /> Email Address
                    </h4>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      Primary
                    </span>
                  </div>
                  <p className="text-gray-800 font-semibold">
                    {user?.email || "example@domain.com"}
                  </p>
                  <button className="mt-2 text-blue-600 hover:text-blue-800 flex items-center space-x-2 text-sm">
                    <FaPlus />
                    <span>Add email</span>
                  </button>
                </div>

                {/* Phone Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                      <FaPhone className="text-green-500" /> Phone Number
                    </h4>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      Primary
                    </span>
                  </div>
                  <p className="text-gray-800 font-semibold">
                    {user?.mobile || "+1 (555) 123-4567"}
                  </p>
                  <button className="mt-2 text-blue-600 hover:text-blue-800 flex items-center space-x-2 text-sm">
                    <FaPlus />
                    <span>Add phone</span>
                  </button>
                </div>
              </div>

              {/* Membership & Role */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Role
                    </h4>
                    <p className="text-gray-800 font-semibold">
                      {user?.roles?.[0] || "Customer"}
                    </p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
