import React from 'react';
import HeroSection from '../../components/home/HeroSection';
import FeaturedProperties from '../../components/home/FeaturedProperties';
import BuyRentCategories from '../../components/home/BuyRentCategories';
import HowItWorks from '../../components/home/HowItWorks';
import BuildYourHome from '../../components/home/BuildYourHome';
import FeaturedContractors from '../../components/home/FeaturedContractors';
import WhyChooseUs from '../../components/home/WhyChooseUs';

const HomePage = () => (
  <>
    <HeroSection />
    <FeaturedProperties />
    <BuyRentCategories />
    <HowItWorks />
    <BuildYourHome />
    <FeaturedContractors />
    <WhyChooseUs />
  </>
);

export default HomePage;
