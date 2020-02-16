const uuidv4 = require("uuid/v4");

const DUMMY_PLACES = [
  {
    id: uuidv4(),
    image:
      "https://untappedcities.com/wp-content/uploads/2015/07/Flatiron-Building-Secrets-Roof-Basement-Elevator-Sonny-Atis-GFP-NYC_5.jpg",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world.",
    address: "20 W 34th St, New York, NY 10001, United States",
    creator: "u1",
    location: {
      lat: 40.7484405,
      lng: -73.9878531,
    },
  },
];

module.exports = DUMMY_PLACES;
