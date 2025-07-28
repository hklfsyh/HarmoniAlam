// src/pages/HomePage.tsx

import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom';
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


// Custom Arrow component (outside HomePage)
type ArrowProps = { style?: React.CSSProperties; onClick?: () => void; direction: 'left' | 'right'; };
const CustomArrow: React.FC<ArrowProps> = ({ style, onClick, direction }) => (
  <button
    className={`absolute top-1/2 z-20 transform -translate-y-1/2 bg-white/70 hover:bg-[#79B829] text-[#1A3A53] hover:text-white shadow-lg rounded-full p-3 transition-all ${direction === 'left' ? 'left-4' : 'right-4'}`}
    style={{ ...style, display: 'block' }}
    onClick={onClick}
    aria-label={direction === 'left' ? 'Sebelumnya' : 'Selanjutnya'}
  >
    {direction === 'left' ? (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
    ) : (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
    )}
  </button>
);

// Custom Dots component (outside HomePage)
function CustomDots(dots: React.ReactNode[]) {
  return (
    <div className="flex justify-center gap-3 mt-4">
      {React.Children.map(dots, (child) => {
        if (!React.isValidElement(child)) return null;
        // Skip React.Fragment, which can be passed by react-slick and may have className
        if (child.type === React.Fragment) return null;
        const key = child.key ?? undefined;
        const props = child.props as { className?: string; onClick?: () => void };
        return (
          <button
            key={key}
            className={`w-4 h-4 rounded-full border-2 border-[#79B829] transition-all ${props.className?.includes('slick-active') ? 'bg-[#79B829]' : 'bg-white'}`}
            onClick={props.onClick}
            aria-label={`Go to slide`}
          />
        );
      })}
    </div>
  );
}

function appendCustomDots(dots: React.ReactNode[]) {
  return <>{CustomDots(dots)}</>;
}

const HomePage: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
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
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    beforeChange: (_: number, next: number) => setActiveSlide(next),
    nextArrow: <CustomArrow direction="right" />,
    prevArrow: <CustomArrow direction="left" />,
    appendDots: appendCustomDots,
  };

  return (
    <>
      <div className="relative h-screen w-screen overflow-x-hidden overflow-y-hidden" data-aos="fade-up">
        <Slider {...settings} className="h-full w-full">
          {sliderImages.map((img, index) => (
            <div key={`slide-${img}`} className="h-screen w-screen flex items-center justify-center overflow-hidden relative group">
              <img
                src={img}
                alt={`Slide ${index + 1}`}
                className={`w-full h-full object-cover transition-transform duration-1000 ${activeSlide === index ? 'scale-105' : 'scale-100'}`}
                style={{ maxWidth: '100vw', maxHeight: '100vh' }}
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-10" />
              {/* Animated Text Overlay */}
              {activeSlide === index && (
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-20 animate-fadeIn">
                  <h1 className="text-white text-5xl md:text-7xl font-bold drop-shadow-lg animate-slideDown">
                    Harmoni{' '}
                    <span style={{ color: '#79B829' }}>Alam</span>
                  </h1>
                  <p className="text-white text-lg md:text-2xl mt-4 max-w-2xl drop-shadow-lg animate-fadeIn">
                    Menghubungkan komunitas untuk aksi lingkungan
                  </p>
                  <Link to="/event" className="mt-8 px-8 py-3 bg-[#79B829] text-white rounded-full font-semibold text-lg shadow-lg hover:bg-[#5e8e1e] transition-all animate-fadeInUp">Lihat Event</Link>
                </div>
              )}
            </div>
          ))}
        </Slider>
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
      {/* Animations for overlay text */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 1.2s both; }
        .animate-fadeInUp { animation: fadeInUp 1.2s both; }
        .animate-slideDown { animation: slideDown 1.2s both; }
      `}</style>
    </>
  );
};

export default HomePage;