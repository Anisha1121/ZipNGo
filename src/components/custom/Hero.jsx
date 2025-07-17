import React from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <div className='min-h-screen relative overflow-hidden'>
      <img 
        src="/bg.jpg" 
        alt="Background" 
        style={{
          position: 'absolute',
          top: '-40%',
          left: 0,
          width: '100%',
          height: '140%',
          objectFit: 'cover',
          zIndex: 1
        }}
        onError={(e) => console.log('Image failed to load:', e)}
        onLoad={() => console.log('Image loaded successfully')}
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
