import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchPlaceDetails } from '@/service/GlobalApi';

function PlaceCardItem({ place }) {
  const defaultImage = '/placeholder.jpg';
  const [photoUrl, setPhotoUrl] = useState(place?.placeImageUrl || defaultImage);

  const getPlacePhoto = useCallback(async () => {
    try {
      const query = place?.placeName?.trim();
      if (!query) return;

      const resp = await fetchPlaceDetails({ placeName: query });

      const photoName = resp?.data?.places?.[0]?.photos?.[0]?.name;
      if (photoName) {
        const url = `https://places.googleapis.com/v1/${photoName}/media?key=${import.meta.env.VITE_GOOGLE_PLACES_API}&maxWidthPx=400`;
        setPhotoUrl(url);
      } else {
        setPhotoUrl(defaultImage);
      }
    } catch (error) {
      console.error('Failed to fetch place photo:', error);
      setPhotoUrl(defaultImage);
    }
  }, [place]);

  useEffect(() => {
    getPlacePhoto();
  }, [getPlacePhoto]);

  if (!place) return null;

  return (
    <Link
      to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.placeName)}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="border rounded-xl shadow-sm p-3 flex flex-row gap-4 bg-white hover:scale-105 transition-all cursor-pointer hover:shadow-md">
        <img
          src={photoUrl}
          alt={place.placeName}
          className="w-[120px] h-[150px] object-cover rounded-lg"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultImage;
          }}
        />
        <div className="flex flex-col justify-between flex-1">
          <div>
            <h2 className="font-semibold text-lg">{place.placeName}</h2>
            <p className="text-sm text-gray-500 mt-1 whitespace-normal break-words">
              {place.placeDetails}
            </p>
          </div>
          <div className="text-sm text-gray-700 mt-2">
            🕒 {place.requiredTime || 'N/A'} <br />
            🎟 {place.ticketPricing || 'N/A'}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PlaceCardItem;
