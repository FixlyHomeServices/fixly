// import React, { useState } from 'react';
// import { FaMapMarkerAlt } from "react-icons/fa";
// const links = [
    
// ]
// const stats = [
//   { name: 'Service', value: '10 Mins' },
//   { name: 'Tracking', value: 'Real-Time' },
//   { name: 'Services', value: 'On-Demand' },
//   { name: 'Booking', value: 'Instant' },
// ]

// export default function HeaderSection() {
//   const [location, setLocation] = useState("Kanpur");
//   const [searchQuery, setSearchQuery] = useState("");

//   return (
//     <div className="relative isolate overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 h-80% w-screen py-24 sm:py-32">
//       <img
//         alt=""
//         src="https://ukcleaningsupplies.co.uk/wp-content/uploads/2023/05/blue-cleaning-supplies-1024x683.webp"
//         className="absolute inset-0 -z-10 h-full w-full object-cover object-right md:object-center opacity-50 blur-xs"
//       />
//       {/* <img
//         alt=""
//         src="https://ukcleaningsupplies.co.uk/wp-content/uploads/2023/05/blue-cleaning-supplies-1024x683.webp"
//         className="absolute inset-0 -z-10 h-full w-full object-cover object-right md:object-center opacity-50 blur-xs"
//       /> */}
//       <div
//         aria-hidden="true"
//         className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
//       >
//         <div
//           style={{
//             clipPath:
//               'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
//           }}
//           className="aspect-1097/845 w-[68.5625rem] bg-gradient-to-tr from-[#3b82f6] to-[#60a5fa] opacity-10"
//         />
//       </div>
//       <div
//         aria-hidden="true"
//         className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu"
//       >
//         <div
//           style={{
//             clipPath:
//               'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
//           }}
//           className="aspect-1097/845 w-[68.5625rem] bg-gradient-to-tr from-[#3b82f6] to-[#60a5fa] opacity-20"
//         />
//       </div>
//       <div className="mx-auto max-w-7xl lg:px-8">
//         <div className="mx-auto text-center lg:mx-0">
//           <h2 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">Welcome to Fixly!</h2>
//           <p className="mt-8 text-lg font-medium text-gray-300 sm:text-xl">
//           Reliable home services at your doorstep—fast, efficient, and hassle-free.
//           </p>
//         </div>
//         <div className="flex -mb-15 justify-center mt-8">
//           <div className="flex items-center bg-white rounded-md shadow-md p-2 w-full max-w-2xl">
//             {/* Location Selector */}
//             <div className="flex items-center px-4">
//               <FaMapMarkerAlt className="text-red-500 mr-2" />
//               <select
//                 className="bg-transparent text-gray-700 font-medium focus:outline-none"
//                 value={location}
//                 onChange={(e) => setLocation(e.target.value)}
//               >
//                 <option value="Kanpur">Kanpur</option>
//                 <option value="Delhi">Delhi</option>
//                 <option value="Mumbai">Mumbai</option>
//                 <option value="Bangalore">Bangalore</option>
//               </select>
//             </div>

//             {/* Divider */}
//             <div className="border-l border-gray-300 h-6 mx-2"></div>

//             {/* Search Input */}
//             <input
//               type="text"
//               placeholder="Search for services..."
//               className="w-full px-2 py-1 focus:outline-none"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />

//             {/* Search Button */}
//             <button
//               onClick={() => console.log(`Searching for: ${searchQuery} in ${location}`)}
//               className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
//             >
//               Search
//             </button>
//           </div>
//         </div>
//         <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
//           <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base font-semibold text-white sm:grid-cols-2 md:flex lg:gap-x-10">
//             {links.map((link) => (
//               <a key={link.name} href={link.href}>
//                 {link.name} <span aria-hidden="true">&rarr;</span>
//               </a>
//             ))}
//           </div>
//           <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
//             {stats.map((stat) => (
//               <div key={stat.name} className="flex flex-col-reverse gap-1">
//                 <dt className="text-base text-gray-300">{stat.name}</dt>
//                 <dd className="text-4xl font-semibold tracking-tight text-white">{stat.value}</dd>
//               </div>
//             ))}
//           </dl>
//         </div>
//       </div>
//     </div>
//   )
// }

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
  const [filteredShops, setFilteredShops] = useState([]); // Track filtered results

  const handleSearch = async () => {
    const fullQuery = `${searchQuery} in ${location}`; // Construct search query

    try {
      const response = await fetch("http://localhost:3001/services/filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: fullQuery }),
      });

      const data = await response.json(); // Parse the JSON response
      setFilteredShops(data); // Update filteredShops state with results
    } catch (error) {
      console.error("Error fetching filtered services:", error); // Handle API error
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
                {shop.name} - ⭐ {shop.rating}
              </div>
            ))}
          </div>
        )}

        <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base font-semibold text-white sm:grid-cols-2 md:flex lg:gap-x-10">
            {links.map((link) => (
              <a key={link.name} href={link.href}>
                {link.name} <span aria-hidden="true">&rarr;</span>
              </a>
            ))}
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.name} className="flex flex-col-reverse gap-1">
                <dt className="text-base text-gray-300">{stat.name}</dt>
                <dd className="text-4xl font-semibold tracking-tight text-white">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
