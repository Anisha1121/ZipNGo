import React from 'react';
import { useState, useEffect } from 'react';
import { fetchPlaceDetails } from '@/service/GlobalApi';
import { PHOTO_REF_URL } from '@/service/GlobalApi';
import { Link } from 'react-router-dom';
function UserTripCardItem({ trip }) {

const [photoUrl, setPhotoUrl]=useState();
const GetPlacePhoto = React.useCallback(async () => {
  try {
    const data = {
      placeName: trip?.userSelection?.location
    };

    const resp = await fetchPlaceDetails(data);
    const photos = resp?.data?.places?.[0]?.photos;
    const photoName = photos?.[3]?.name || photos?.[0]?.name;

    if (!photoName) {
      console.warn("No photo found for", trip?.userSelection?.location);
      return;
    }

    const url = `https://places.googleapis.com/v1/${photoName}/media?key=${import.meta.env.VITE_GOOGLE_PLACES_API}&maxWidthPx=400`;
        setPhotoUrl(url);
  } catch (error) {
    console.error('Failed to fetch place details:', error?.response?.data || error.message);
  }
}, [trip]);


  useEffect(() => {
    trip && GetPlacePhoto();
  }, [trip, GetPlacePhoto]);

  if (!trip) return null;
  
  console.log("Trip:", trip);
  return (
    <Link to= {'/view-trip/'+trip?.id}>
    <div className='hover:scale-105 transition-all'>
      <img src={photoUrl?photoUrl: "/placeholder.jpg"} className="object-cover rounded-md w-full h-40" />
      <div className="mt-2">
        <h2 className="font-semibold text-lg">
          {trip?.userSelection?.location || "Unknown Destination"}
        </h2>
        <h2 className='text-sm text-gray-500'>
          📅{trip?.userSelection?.days} days trip with 👥{trip?.userSelection?.travelers} people with 💰{trip?.userSelection?.budget} budget
        </h2>
      </div>
    </div>
    </Link>
  );
}


export default UserTripCardItem;
