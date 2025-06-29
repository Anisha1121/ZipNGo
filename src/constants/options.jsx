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
export const AI_PROMPT='Generate Travel Plan for Location : {location}, for {totaldays} Days for {traveler} with a {budget} budget, Give me a Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itnerary with placeNam Details, Place Image Url, ticket Pricing, Time t travel in JSON format.'