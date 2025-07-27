// src/pages/HomePage.tsx

import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HeroEvent from '../components/HomeComponents/HeroEvent';
import EventTerbaru from '../components/HomeComponents/EventTerbaru';
import StatsSection from '../components/HomeComponents/StatsSection';
import ArtikelTerbaru from '../components/HomeComponents/ArtikelTerbaru';
import Ajakan from '../components/HomeComponents/Ajakan';

const sliderImages = [
  '/slider1.png',
  '/slider2.png',
  '/slider3.png',
  '/slider4.png',
];


const HomePage: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
      offset: 80,
    });
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true, // <-- HAPUS ATAU KOMENTARI BARIS INI
  };

  return (
    <>
      <div className="relative h-screen w-screen overflow-x-hidden overflow-y-hidden" data-aos="fade-up">
        <Slider {...settings} className="h-full w-full">
          {sliderImages.map((img, index) => (
            <div key={index} className="h-screen w-screen flex items-center justify-center overflow-hidden">
              <img src={img} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" style={{maxWidth: '100vw', maxHeight: '100vh'}} />
            </div>
          ))}
        </Slider>

        {/* Overlay Content */}
        <div className="absolute inset-0 bg-opacity-40 flex flex-col justify-center items-center text-center z-10">
          <h1 className="text-white text-5xl md:text-7xl font-bold drop-shadow-lg">
            Harmoni{' '}
            <span style={{ color: '#79B829' }}>Alam</span>
          </h1>
          <p className="text-white text-lg md:text-2xl mt-4 max-w-2xl drop-shadow-lg">
            Menghubungkan komunitas untuk aksi lingkungan
          </p>
        </div>
      </div>
      <div data-aos="fade-up" data-aos-delay="100">
        <HeroEvent />
      </div>
      <div data-aos="fade-up" data-aos-delay="200">
        <EventTerbaru />
      </div>
      <div data-aos="fade-up" data-aos-delay="300">
        <StatsSection/>
      </div>
      <div data-aos="fade-up" data-aos-delay="400">
        <ArtikelTerbaru />
      </div>
      <div data-aos="fade-up" data-aos-delay="500">
        <Ajakan />
      </div>
    </>
  );
};

export default HomePage;