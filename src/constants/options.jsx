export const SelectTravelList = [
  {
    id: 1,
    title: 'Just Me',
    desc: 'A solo explorer ready to roam',
    icon: '🧍‍♂️',
    people: '1',
  },
  {
    id: 2,
    title: 'A Couple',
    desc: 'Two hearts traveling as one',
    icon: '👨‍❤️‍👩',
    people: '2 People',
  },
  {
    id: 3,
    title: 'Family',
    desc: 'A crew of adventurers of all ages',
    icon: '👨‍👩‍👧‍👦',
    people: '3 to 5 People',
  },
  {
    id: 4,
    title: 'Friends',
    desc: 'A wild bunch chasing thrills together',
    icon: '🎉',
    people: '5 to 10 People',
  },
];
export const SelectBudgetOptions = [
  {
    id: 1,
    title: 'Cheap',
    desc: 'Stay conscious of costs',
    icon: '💸',
  },
  {
    id: 2,
    title: 'Moderate',
    desc: 'Keep cost on the average side',
    icon: '🪙',
  },
  {
    id: 3,
    title: 'Luxury',
    desc: 'Premium experience all the way',
    icon: '💎',
  },
];
export const AI_PROMPT = `Generate a detailed travel plan for:
- Location: {location}
- Duration: {totaldays} Days
- Travelers: {traveler}
- Budget: {budget}

Return only a valid JSON object with the following **top-level keys**:

1. hotels (Array of 3 hotel objects)
2. itinerary (Array of {totaldays} itinerary objects)
3. userSelection (Object containing user inputs)

❗ DO NOT nest hotels and itinerary inside another object like "tripData".
❗ DO NOT include any outer wrapper like "tripData" or "response".
❗ Use ONLY the top-level keys exactly as follows:
- hotels
- itinerary
- userSelection

Each hotel object must contain:
- hotelName (string)
- hotelAddress (string)
- hotelImageUrl (string)
- geoCoordinates: { latitude (number), longitude (number) }
- pricePerNight (number, in rupees)
- rating (number, 1–5 scale)
- description (string)

Each itinerary object must contain:
- day (e.g. "Day 1")
- exactTime (e.g. "9:00 AM")
- placeName (string)
- placeDetails (string)
- placeImageUrl (string)
- geoCoordinates: { latitude (number), longitude (number) }
- ticketPricing (string)
- requiredTime (e.g. "2 hours")

userSelection object must include:
- userEmail (string)
- location (string)
- days (number)
- travelers (string)
- budget (string)

⚠️ STRICT RULES:
- Return ONLY a valid JSON object. No markdown, no triple backticks, no extra text.
- Use **camelCase keys exactly as described above**.
- DO NOT include any wrapper key like "tripData".

Respond only with a valid JSON object in the exact format above.`;


