import React from "react";
import { Link } from "react-router-dom";

const services = [
  { id: 1, title: "Salon For Women", image: "/images/Women.jpeg", price: "₹999" },
  { id: 2, title: "Hair, Skin & Nails", image: "/images/nailHair.jpeg", price: "₹1199" },
  { id: 3, title: "Women's Therapies", image: "/images/womenTherapy.jpeg", price: "₹799" },
  { id: 4, title: "Salon For Men", image: "/images/salonForMen.jpeg", price: "₹899" },
  { id: 5, title: "Men's Therapies", image: "/images/mensTherapy.jpeg", price: "₹999" },
];

const featuredServices = [
  { id: 6, title: "Salon Prime", image: "/images/salon.webp", price: "₹699" },
  { id: 7, title: "Salon for Men", image: "/images/SalonMen.webp", price: "₹899" },
  { id: 8, title: "Spa for Women", image: "/images/SpaWomen.webp", price: "₹1199" },
  { id: 9, title: "Massage for Men", image: "/images/MassageForMen.webp", price: "₹499" },
];

const homeServices = [
  { id: 10, title: "Appliance Repair", image: "/images/Appliance.webp", price: "₹499" },
  { id: 11, title: "Home Painting", image: "/images/Sale.webp", price: "₹1999" },
  { id: 12, title: "Cleaning & Pest", image: "/images/cleaning.webp", price: "₹999" },
  { id: 13, title: "Disinfection", image: "/images/disinfectant.webp", price: "₹799" },
  { id: 14, title: "Home Repairs", image: "/images/HomeRepairs.webp", price: "₹1299" },
];

const Services = () => {
  return (
    <div className="p-6 mb-34 mt-0">
      {/* Banner Section */}
      <div className="relative bg-cover bg-center h-72 flex flex-col items-center justify-center text-white" style={{ backgroundImage: "url('/path-to-banner-image.jpg')" }}>
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <div className="flex border rounded bg-white text-black w-full md:w-150 h-14 p-2 items-center">
            <span className="px-2 text-3xl">🔍</span>
            <input type="text-md" placeholder="Search for services" className="w-full outline-none" />
          </div>
        </div>
      </div>

      {/* Top Services */}
      <h2 className="text-center text-2xl font-bold mt-8 mb-4">Top Services</h2>
      <div className="flex justify-center space-x-6 bg-white p-4 rounded-lg shadow-lg mt--2 mb-10">
        {services.map((service) => (
          <Link to={`/moredetails/${service.id}`} key={service.id} state={{ service }}>
            <div className="flex flex-col items-center ml-1 transition transform hover:scale-105 hover:shadow-lg hover:bg-gray-100 rounded-lg p-4 cursor-pointer">
              <img src={service.image} alt={service.title} className="w-full rounded-md" />
              <p className="text-lg font-semibold mt-2">{service.title}</p>
              <p className="text-xl font-bold text-gray-600 mt-1">Price: {service.price}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Featured Services */}
      <h2 className="text-center text-2xl font-bold mt-8 mb-4">Salon, Spa, and Massage Services</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-center mb-10">
        {featuredServices.map((service) => (
          <Link to={`/moredetails/${service.id}`} key={service.id} state={{ service }}>
            <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md transition transform hover:scale-105 hover:shadow-lg hover:bg-gray-100 cursor-pointer">
              <img src={service.image} alt={service.title} className="w-full rounded-md" />
              <p className="text-lg font-semibold mt-2">{service.title}</p>
              <p className="text-xl font-bold text-gray-600 mt-1">Price: {service.price}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Home Services */}
      <h2 className="text-center text-2xl font-bold mt-8 mb-4">Home Services</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 justify-center mb-15">
        {homeServices.map((service) => (
          <Link to={`/moredetails/${service.id}`} key={service.id} state={{ service }}>
            <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md transition transform hover:scale-105 hover:shadow-lg hover:bg-gray-100 cursor-pointer">
              <img src={service.image} alt={service.title} className="w-half rounded-md" />
              <p className="text-lg font-semibold mt-2">{service.title}</p>
              <p className="text-xl font-bold text-gray-600 mt-1">Price: {service.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Services;
