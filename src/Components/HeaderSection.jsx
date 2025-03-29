import React, { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

const links = [];
const stats = [
  { name: "Service", value: "10 Mins" },
  { name: "Tracking", value: "Real-Time" },
  { name: "Services", value: "On-Demand" },
  { name: "Booking", value: "Instant" },
];

export default function HeaderSection() {
  const [location, setLocation] = useState("Kanpur");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredShops, setFilteredShops] = useState([]);

  const handleSearch = async () => {
    const fullQuery = `${searchQuery} in ${location}`;

    try {
      const response = await fetch("http://localhost:3001/services/filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: fullQuery }),
      });

      const data = await response.json();
      setFilteredShops(data);
    } catch (error) {
      console.error("Error fetching filtered services:", error);
    }
  };

  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 h-80% w-screen py-24 sm:py-32">
      <img
        alt=""
        src="https://ukcleaningsupplies.co.uk/wp-content/uploads/2023/05/blue-cleaning-supplies-1024x683.webp"
        className="absolute inset-0 -z-10 h-full w-full object-cover object-right md:object-center opacity-50 blur-xs"
      />

      <div className="mx-auto max-w-7xl lg:px-8">
        <div className="mx-auto text-center lg:mx-0">
          <h2 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
            Welcome to Fixly!
          </h2>
          <p className="mt-8 text-lg font-medium text-gray-300 sm:text-xl">
            Reliable home services at your doorstep—fast, efficient, and hassle-free.
          </p>
        </div>

        <div className="flex justify-center mt-8">
          <div className="flex items-center bg-white rounded-md shadow-md p-2 w-full max-w-2xl">
            <div className="flex items-center px-4">
              <FaMapMarkerAlt className="text-red-500 mr-2" />
              <select
                className="bg-transparent text-gray-700 font-medium focus:outline-none"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="Kanpur">Kanpur</option>
                <option value="Delhi">Delhi</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bangalore">Bangalore</option>
              </select>
            </div>

            <div className="border-l border-gray-300 h-6 mx-2"></div>

            <input
              type="text"
              placeholder="Search for services..."
              className="w-full px-2 py-1 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </div>

        {filteredShops.length > 0 && (
  <div className="mt-10 text-center text-white">
    <h3 className="text-xl font-semibold">Results:</h3>
    {filteredShops.map((shop, index) => (
      <div key={index} className="mt-2">
        {shop.serviceName} - Provided by: {shop.providerNames?.length > 0 ? shop.providerNames.join(", ") : "No providers available"}
      </div>
    ))}
  </div>
)}

      </div>
    </div>
  );
}
