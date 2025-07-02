import React from 'react';
import PlaceCardItem from './PlaceCardItem';

function PlacesToVisit({ trip }) {
  if (!trip?.tripData?.itinerary?.length) return null;

  const placesByDay = trip.tripData.itinerary.reduce((acc, place) => {
    const day = place.day || 'Day';
    if (!acc[day]) acc[day] = [];
    acc[day].push(place);
    return acc;
  }, {});

  const orderedDays = Object.keys(placesByDay).sort(
    (a, b) => Number(a.match(/\d+/)) - Number(b.match(/\d+/))
  );

  return (
    <div>
      <h2 className="font-bold text-xl mb-4">Places To Visit</h2>

      {orderedDays.map((dayKey) => (
        <div key={dayKey} className="mb-5">
          <h2 className="font-medium text-xl text-gray-800 mb-2">
            {dayKey}
          </h2>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {placesByDay[dayKey].map((place, index) => (
              <div key={index}>
                <p className="text-sm text-orange-600 mb-1">
                   {place.
exactTimeToVisit
 || 'Time N/A'}
                </p>
                <PlaceCardItem place={place} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PlacesToVisit;
