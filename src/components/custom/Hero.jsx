import React from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom';
function Hero() {
  return (
    <div className='flex flex-col items-center mx-56 gap-9' >
      <h1 className='text-[50px] font-extrabold text-center mt-16 '>
      
      <span className='text-[#fa2590]'>Discover Your Next Adventure with us: </span>Personalized Itinerary ready at your fingertips!</h1>
      <p className='text-3xl text-gray-600 text-center'>Unleash the explorer in you with your personal trip planner and travel curator, creating custom itineraries tailored to your preferences.</p>
      
      
      
      <Link to="/create-trip">
        <Button className="px-6 py-3 text-xl rounded-sm shadow cursor-pointer ">Get started for free</Button>
      </Link>
    </div>
  )
}

export default Hero
