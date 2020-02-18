const axios = require("axios");

const HttpError = require("../models/http-error");
const { NODE_APP_GOOGLE_PLACES_API_KEY } = process.env;

async function readLocationFromAddress(address) {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address,
    )}&key=${NODE_APP_GOOGLE_PLACES_API_KEY}`,
  );
  const { data } = response;
  if (!data || data.status === "ZERO_RESULTS") {
    throw new HttpError(
      "Could not find the location for the specified address",
      422,
    );
  }
  const { location } = data.results[0].geometry;
  return location;
}

module.exports = readLocationFromAddress;
