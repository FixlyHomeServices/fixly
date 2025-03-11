import React from 'react';
import Header from './Header';
import HeaderSection from './HeaderSection';
import Footer from './Footer'; 
import Hero from './Hero';
import FAQAccordion from './FAQs';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <HeaderSection />
      {/* <div className="flex-grow"></div> */}
      <Hero></Hero>
      <FAQAccordion />
      <Footer />
    </div>
  );
};

export default Home;
