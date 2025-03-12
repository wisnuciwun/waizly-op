// const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const BASE_URL_V2 = process.env.REACT_APP_API_BASE_URL_V2;

export const shipping = {
  listShipping: `${BASE_URL_V2}shipping-rate`,
  getDestination: (destination) =>
    `${BASE_URL_V2}shipping-rate/search-region?search=${destination}`,
};
