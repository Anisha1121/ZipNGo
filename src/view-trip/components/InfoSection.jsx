import { Button } from '@/components/ui/button'
import { fetchPlaceDetails } from '@/service/GlobalApi'
import React, { useEffect } from 'react'
import { IoIosSend } from "react-icons/io"
import { useState } from 'react'



const PHOTO_REF_URL='https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=1000&key='+import.meta.env.VITE_GOOGLE_PLACES_API
function InfoSection({ trip }) {
const [photoUrl, setPhotoUrl]=useState();
  const GetPlacePhoto = React.useCallback(async () => {
    try {
      const data = {
        placeName: trip?.userSelection?.location
      };

      const resp = await fetchPlaceDetails(data);
      console.log(resp.data.places[0].photos[3].name);

      const PhotoUrl=PHOTO_REF_URL.replace('{NAME}',resp.data.places[0].photos[3].name);
      setPhotoUrl(PhotoUrl)
    } catch (error) {
      console.error('Failed to fetch place details:', error?.response?.data || error.message);
    }
  }, [trip]);

  useEffect(() => {
    trip && GetPlacePhoto();
  }, [trip, GetPlacePhoto]);

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
        <Button><IoIosSend /></Button>
      </div>
    </div>
  )
}

export default InfoSection
