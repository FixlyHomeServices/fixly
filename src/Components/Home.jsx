import React from 'react';
import Header from './Header';
import HeaderSection from './HeaderSection';
import Footer from './Footer'; 
import Hero from './Hero';
import FAQAccordion from './FAQs';
import Chatbot from './chatbot'; // ✅ Import Chatbot

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <HeaderSection />
      <Hero />
      <FAQAccordion />
      <Footer />
      <Chatbot /> {/* ✅ Add Chatbot Component */}
    </div>
  );
};

export default Home;
