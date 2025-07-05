import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPlaceDetails } from '@/service/GlobalApi';

function HotelCardItem({ hotel }) {
  const [photoUrl, setPhotoUrl] = useState(hotel?.hotelImageUrl || '/placeholder.jpg');

  const getPlacePhoto = useCallback(async () => {
    try {
      if (!hotel?.hotelName || !hotel?.hotelAddress) return;

      const resp = await fetchPlaceDetails({
        placeName: `${hotel.hotelName}, ${hotel.hotelAddress}`,
      });

      const photoName = resp?.data?.places?.[0]?.photos?.[0]?.name;
      if (photoName) {
        const url = `https://places.googleapis.com/v1/${photoName}/media?key=${import.meta.env.VITE_GOOGLE_PLACES_API}&maxWidthPx=400`;
        setPhotoUrl(url);
      }
    } catch (err) {
      console.error('Google Places API failed:', err?.response?.data || err.message);
    }
  }, [hotel]);

  useEffect(() => {
    getPlacePhoto();
  }, [getPlacePhoto]);

  if (!hotel || !hotel.hotelName || !hotel.hotelAddress) {
    console.warn('Skipping invalid hotel:', hotel);
    return null;
  }

  return (
    <Link
      to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${hotel.hotelName}, ${hotel.hotelAddress}`
      )}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="rounded-xl shadow-md overflow-hidden hover:scale-105 transition-all cursor-pointer bg-white">
        <img
          src={photoUrl}
          alt={hotel.hotelName || 'Hotel'}
          className="h-[200px] w-full object-cover"
          onError={(e) => (e.target.src = '/placeholder.jpg')}
        />
        <div className="p-3">
          <h2 className="font-medium text-md">{hotel.hotelName}</h2>
          <p className="text-xs text-gray-500 mt-1">📍 {hotel.hotelAddress}</p>
          {hotel?.pricePerNight && (
            <p className="text-xs text-gray-600">💵 ₹{hotel.pricePerNight}</p>
          )}
          {hotel?.rating && (
            <p className="text-xs text-yellow-600 font-semibold">⭐ {hotel.rating}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default HotelCardItem;
