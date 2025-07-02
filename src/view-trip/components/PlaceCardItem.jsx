import React from 'react';
import { Link } from 'react-router-dom';

function PlaceCardItem({ place }) {
  return (
    <Link
      to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.placeName)}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="border rounded-xl shadow-sm p-3 flex flex-row gap-4 h-[160px] bg-white transition hover:shadow-md">
        <img
          src="/placeholder.jpg"
          alt={place.placeName}
          className="w-[120px] h-full object-cover rounded-lg"
        />
        <div className="flex flex-col justify-between flex-1 overflow-hidden">
          <div>
            <h2 className="font-semibold text-lg">{place.placeName}</h2>
            <p className="text-sm text-gray-500 mt-1 line-clamp-3">
              {place.placeDetails}
            </p>
          </div>
          <p className="text-sm text-gray-700 mt-2">🕒 {place.requiredTime}</p>
        </div>
      </div>
    </Link>
  );
}

export default PlaceCardItem;
