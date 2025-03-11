import React, { useState } from 'react'; 
import { FaMapMarkerAlt } from "react-icons/fa";

const locations = ["Kanpur", "Delhi", "Mumbai", "Bangalore"];

export default function HeaderSection() {
  const [location, setLocation] = useState("Kanpur");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredShops, setFilteredShops] = useState([]);

  const handleSearch = async () => {
    const fullQuery = `${searchQuery} in ${location}`;
    try {
      const response = await fetch('http://localhost:5000/filter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: fullQuery }),
      });
      const data = await response.json();
      setFilteredShops(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-24">
      <h2 className="text-5xl font-semibold text-white text-center">Welcome to Fixly!</h2>
      <p className="mt-8 text-lg text-gray-300 text-center">Reliable home services at your doorstep.</p>

      <div className="flex justify-center mt-8">
        <div className="flex items-center bg-white rounded-md shadow-md p-2 max-w-2xl w-full">
          <div className="flex items-center px-4">
            <FaMapMarkerAlt className="text-red-500 mr-2" />
            <select
              className="bg-transparent text-gray-700 font-medium focus:outline-none"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </div>

          <input
            type="text"
            placeholder="Search for services..."
            className="w-full px-2 py-1 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Search
          </button>
        </div>
      </div>

      {filteredShops.length > 0 && (
        <div className="mt-10 text-center text-white">
          <h3 className="text-xl font-semibold">Results:</h3>
          {filteredShops.map((shop, index) => (
            <div key={index} className="mt-2">
              {shop.name} - ⭐ {shop.rating}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
