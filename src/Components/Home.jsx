import React from 'react';
import HeaderSection from './HeaderSection';
import Footer from './Footer'; 
import Hero from './Hero';
import FAQAccordion from './FAQs';
import UserHeader from './Userheader';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <UserHeader />
      <HeaderSection />
      {/* <div className="flex-grow"></div> */}
      <Hero></Hero>
      <FAQAccordion />
      <Footer />
    </div>
  );
};

export default Home;
