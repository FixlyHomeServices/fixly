import React from "react";
import { useParams, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import Header from "./Header";  // Importing Header
import Footer from "./Footer";  // Importing Footer

const MoreDetails = () => {
  const { serviceId } = useParams();
  const location = useLocation();
  const service = location.state?.service;

  if (!service) {
    return <h2 className="text-center text-gray-600 mt-10 text-xl">Service not found.</h2>;
  }

  return (
    <>
      <Header /> {/* Display header */}
      <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 flex flex-col md:flex-row">
        {/* Left Section: Image */}
        <div className="md:w-1/2 flex justify-center">
          <img src={service.image} alt={service.title} className="w-full max-w-md rounded-md shadow-md" />
        </div>

        {/* Right Section: Details */}
        <div className="md:w-1/2 md:pl-8">
          <h1 className="text-3xl font-bold text-gray-900">{service.title}</h1>
          <p className="text-gray-700 text-lg mt-3">{service.description || "Premium service tailored for your needs."}</p>

          {/* Price Section */}
          <div className="mt-4">
            <span className="text-2xl font-bold text-green-600">{service.price}</span>
            <span className="text-gray-500 text-lg line-through ml-3">₹{parseInt(service.price.replace(/[₹,]/g, '')) + 500}</span>
            <span className="text-red-600 text-lg font-semibold ml-2">10% off</span>
          </div>

          {/* EMI Option */}
          <div className="mt-2 text-gray-700">
            <span className="font-medium">EMI starts at </span>
            <span className="text-green-700 font-bold">₹{(parseInt(service.price.replace(/[₹,]/g, '')) / 3).toFixed(2)}/month</span>
            <span className="text-gray-500 text-sm ml-2"> (3 months No Cost EMI)</span>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 mt-6">
            <button className="w-1/2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg shadow-md transition duration-300 font-semibold">
              🔥 Book Now
            </button>
            <button className="w-1/2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md transition duration-300 font-semibold">
              💳 Pay with EMI
            </button>
          </div>

          {/* Back to Services */}
          <div className="mt-6">
            <Link to="/services" className="text-blue-500 hover:underline text-lg">← Back to Services</Link>
          </div>
        </div>
      </div>
      <Footer /> {/* Display footer */}
    </>
  );
};

export default MoreDetails;
