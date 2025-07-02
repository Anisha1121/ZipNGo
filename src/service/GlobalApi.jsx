import axios from 'axios';

const BASE_URL = 'https://places.googleapis.com/v1/places:searchText';

export const fetchPlaceDetails = async (data) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': import.meta.env.VITE_GOOGLE_PLACES_API,
      'X-Goog-FieldMask': [
        'places.photos',
        'places.displayName',
        'places.id'
      ]
    }
  };

  const payload = {
    textQuery: data.placeName, // e.g., "Albert Hall Museum"
    locationBias: {
      circle: {
        center: {
          latitude: 26.9124,
          longitude: 75.7873
        },
        radius: 5000
      }
    }
  };
  console.log("API Config:", config);
console.log("Payload:", payload);

  return axios.post(BASE_URL, payload, config);
};

export const PHOTO_REF_URL = `https://places.googleapis.com/v1/${'{NAME}'}/media?key=${import.meta.env.VITE_GOOGLE_PLACES_API}`;
