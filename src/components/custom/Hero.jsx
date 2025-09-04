import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  Camera, 
  Heart,
  Plane
} from 'lucide-react';

function Hero() {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className='min-h-screen relative overflow-hidden'>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-blue-400/30 to-cyan-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-purple-400/30 to-pink-600/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-gradient-to-br from-yellow-400/30 to-orange-600/30 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Floating Icons */}
        <div className="absolute top-1/4 left-1/4 animate-bounce delay-300">
          <Camera className="w-8 h-8 text-white/30" />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-bounce delay-700">
          <Plane className="w-10 h-10 text-white/40" />
        </div>
        <div className="absolute bottom-1/3 left-1/6 animate-bounce delay-1000">
          <Heart className="w-6 h-6 text-white/35" />
        </div>
        <div className="absolute top-1/2 right-1/6 animate-bounce delay-200">
          <MapPin className="w-7 h-7 text-white/30" />
        </div>
      </div>

      {/* Loading placeholder with enhanced gradient background */}
      {!imageLoaded && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-800 to-indigo-900 animate-pulse"
          style={{ zIndex: 1 }}
        />
      )}
      
      {/* Main Background Image */}
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
          zIndex: 2,
          opacity: imageLoaded ? 1 : 0,
          transition: 'opacity 1s ease-in-out'
        }}
        onError={(e) => {
          console.log('Image failed to load:', e);
          setImageLoaded(true);
        }}
        onLoad={() => {
          console.log('Image loaded successfully');
          setImageLoaded(true);
        }}
      />

     

      {/* Main Content */}
      <div style={{ position: 'relative', zIndex: 4 }} className='flex flex-col items-center justify-center min-h-screen px-4 sm:px-8 lg:px-16 xl:px-32'>
        


        {/* Main Heading with Enhanced Typography */}
        <div className="text-center mb-8 animate-in slide-in-from-bottom duration-1000 delay-200">
          <h1 className='text-3xl sm:text-4xl lg:text-5xl xl:text-5xl font-extrabold text-center leading-tight max-w-6xl mx-auto'>
            <span className='text-pink-500'>
              Discover Your Next Adventure with us:
            </span>
            
            <br />
            <span className='text-white drop-shadow-2xl'>
              Personalized Itinerary ready at your fingertips!
            </span>
            
          </h1>
        </div>

        {/* Enhanced Subtitle */}
        <div className="text-center mb-12 animate-in slide-in-from-bottom duration-1000 delay-400">
          <p className='text-xl sm:text-2xl lg:text-3xl text-white/90 text-center drop-shadow-xl max-w-4xl mx-auto leading-relaxed font-medium'>
            Unleash the explorer in you with your personal trip planner and travel curator, 
            <span className="text-cyan-300 font-semibold"> creating custom itineraries </span>
            tailored to your preferences.
          </p>
        </div>



        {/* Enhanced CTA Button */}
        <div className="animate-in slide-in-from-bottom duration-1000 delay-800">
          <Link to="/create-trip">
            <Button className="group relative bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white cursor-pointer font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 text-lg border-0 overflow-hidden">
              {/* Button Background Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Button Content */}
              <div className="relative flex items-center gap-3">
                <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                <span>Get started for free</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
              
              {/* Shine Effect */}
              <div className="absolute inset-0 -top-full group-hover:top-full bg-gradient-to-b from-transparent via-white/20 to-transparent transition-all duration-500 transform skew-y-12"></div>
            </Button>
          </Link>
        </div>



          </div>
        </div>
     
  )
}

export default Hero
