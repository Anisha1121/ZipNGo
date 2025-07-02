import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPlaceDetails } from '@/service/GlobalApi';

function HotelCardItem({ hotel }) {
  const [photoUrl, setPhotoUrl] = useState(hotel?.hotelImageUrl || '/placeholder.jpg'); // fallback

  const getPlacePhoto = useCallback(async () => {
    try {
      if (!hotel?.hotelName) return;

      const resp = await fetchPlaceDetails({
        placeName: `${hotel.hotelName}, ${hotel.hotelAddress}`,
      });

      const photoName = resp?.data?.places?.[0]?.photos?.[0]?.name;
      if (photoName) {
        const url = `https://places.googleapis.com/v1/${photoName}/media?key=${import.meta.env.VITE_GOOGLE_PLACES_API}&maxWidthPx=400`;
        setPhotoUrl(url);
      } else {
        console.warn('No Google photo found for:', hotel.hotelName);
      }
    } catch (err) {
      console.error('Google Places API failed:', err?.response?.data || err.message);
    }
  }, [hotel]);

  useEffect(() => {
    getPlacePhoto();
  }, [getPlacePhoto]);

  if (!hotel) {
    console.warn('HotelCardItem received undefined hotel');
    return null;
  }

  return (
    <Link
      to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${hotel.HotelName}, ${hotel.HotelAddress}`
      )}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="rounded-xl shadow-md overflow-hidden hover:scale-105 transition-all cursor-pointer">
        <img
          src={photoUrl}
          alt={hotel.HotelName}
          className="h-[200px] w-full object-cover"
        />

        <div className="p-3">
          <h2 className="font-medium">{hotel.hotelName}</h2>
          <h2 className="text-xs text-gray-500 my-1">📍 {hotel.hotelAddress}</h2>
          <h2 className="text-xs text-gray-500 my-1">💵 ₹{hotel.pricePerNight}</h2>
          <h2 className="text-xs text-gray-500 font-bold">⭐ {hotel.rating}</h2>
        </div>
      </div>
    </Link>
  );
}

export default HotelCardItem;
