import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

function Hero() {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className='min-h-screen relative overflow-hidden'>
      {/* Loading placeholder with gradient background */}
      {!imageLoaded && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"
          style={{ zIndex: 0 }}
        />
      )}
      
      <img 
        src="/bg.jpg" 
        alt="Background" 
        loading="eager"
        style={{
          position: 'absolute',
          top: '-40%',
          left: 0,
          width: '100%',
          height: '140%',
          objectFit: 'cover',
          zIndex: 1,
          opacity: imageLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out'
        }}
        onError={(e) => {
          console.log('Image failed to load:', e);
          setImageLoaded(true); // Show content even if image fails
        }}
        onLoad={() => {
          console.log('Image loaded successfully');
          setImageLoaded(true);
        }}
      />
      <div style={{ position: 'relative', zIndex: 3 }} className='flex flex-col items-center mx-56 gap-9 min-h-screen justify-center'>
      <h1 className='text-[50px] font-extrabold text-center mt-16 text-white drop-shadow-lg'>
        <span className='text-[#fa2590]'>Discover Your Next Adventure with us: </span>Personalized Itinerary ready at your fingertips!
      </h1>
      <p className='text-3xl text-white text-center drop-shadow-lg'>Unleash the explorer in you with your personal trip planner and travel curator, creating custom itineraries tailored to your preferences.</p>
      <Link to="/create-trip">
        <Button className="px-6 py-3 rounded-sm shadow cursor-pointer ">Get started for free</Button>
      </Link>
      </div>
    </div>
  )
}

export default Hero
