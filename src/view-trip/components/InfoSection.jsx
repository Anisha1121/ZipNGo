import { Button } from '@/components/ui/button'
import { fetchPlaceDetails } from '@/service/GlobalApi'
import React, { useEffect } from 'react'
import { IoIosSend } from "react-icons/io"
import { useState } from 'react'



const PHOTO_REF_URL='https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=1000&key='+import.meta.env.VITE_GOOGLE_PLACES_API
function InfoSection({ trip }) {
  const [photoUrl, setPhotoUrl] = useState();
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const GetPlacePhoto = React.useCallback(async () => {
    try {
      const data = {
        placeName: trip?.userSelection?.location
      };

      const resp = await fetchPlaceDetails(data);
      console.log(resp.data.places[0].photos[7].name);

      const PhotoUrl=PHOTO_REF_URL.replace('{NAME}',resp.data.places[0].photos[3].name);
      setPhotoUrl(PhotoUrl)
    } catch (error) {
      console.error('Failed to fetch place details:', error?.response?.data || error.message);
    }
  }, [trip]);

  useEffect(() => {
    trip && GetPlacePhoto();
  }, [trip, GetPlacePhoto]);

  const handleShare = () => {
    const tripUrl = window.location.href;
    const shareData = {
      title: 'Check out my trip!',
      text: `Trip to ${trip?.userSelection?.location} for ${trip?.userSelection?.days} days with ${trip?.userSelection?.travelers} travelers and a budget of ${trip?.userSelection?.budget}.`,
      url: tripUrl
    };
    if (navigator.share) {
      navigator.share(shareData).catch((err) => {
        console.error('Share failed:', err);
      });
    } else {
      navigator.clipboard.writeText(tripUrl);
      alert('Trip link copied to clipboard!');
    }
  };


  // Mock video generation function
  const handleGenerateVideo = async () => {
    setVideoLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      // Use a sample video URL (royalty-free stock video)
      setVideoUrl('https://www.w3schools.com/html/mov_bbb.mp4');
      setVideoLoading(false);
    }, 2500);
  };

  if (!trip) return null;

  return (
    <div>
      <img src={photoUrl} className='h-[340px] w-full object-cover rounded-xl' />
      <div className='flex justify-between items-center'>
        <div className='my-5 flex flex-col gap-2'>
          <h2 className='font-bold text-3xl'>
            {trip?.userSelection?.location}
          </h2>
          <div className='flex gap-5'>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>
              📅 {trip?.userSelection?.days} Days
            </h2>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>
              💰 {trip?.userSelection?.budget} Budget
            </h2>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>
              🥂 No. of Travellers: {trip?.userSelection?.travelers}
            </h2>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <Button onClick={handleShare}><IoIosSend /></Button>
          <Button onClick={handleGenerateVideo} disabled={videoLoading} className="mt-2 bg-gradient-to-r from-blue-500 to-teal-400 text-white">
            {videoLoading ? 'Generating Video...' : 'Generate Trip Video'}
          </Button>
        </div>
      </div>
      {videoUrl && (
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-2">Your Trip Video</h3>
          <video controls width="100%" src={videoUrl} className="rounded-xl shadow-lg" />
        </div>
      )}
    </div>
  )
}

export default InfoSection
