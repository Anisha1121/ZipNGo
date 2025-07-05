import React, { useState, useRef } from 'react';

function PlacesAutocomplete({ onSelect, placeholder = 'Search a city…' }) {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

  // Fetch suggestions from Mapbox Places API
  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      const resp = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?types=place&access_token=${MAPBOX_TOKEN}`
      );
      const data = await resp.json();
      setSuggestions(data.features || []);
    } catch {
      setSuggestions([]);
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setValue(val);
    setShowDropdown(true);
    fetchSuggestions(val);
  };

  const handleSelect = (city) => {
    setValue(city.place_name);
    setShowDropdown(false);
    setSuggestions([]);
    if (onSelect) onSelect(city);
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-md p-2 outline-blue-400"
        autoComplete="off"
        onFocus={() => value && setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
      />
      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((city) => (
            <li
              key={city.id}
              className="px-3 py-2 cursor-pointer text-sm hover:bg-blue-100"
              onMouseDown={() => handleSelect(city)}
            >
              {city.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PlacesAutocomplete;
