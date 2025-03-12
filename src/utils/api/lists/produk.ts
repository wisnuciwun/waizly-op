const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const BASE_URL_V2 = process.env.REACT_APP_API_BASE_URL_V2;

export const produkListing = {
    getShopify: `${BASE_URL_V2}product-listing`,
    getProdukDetail: (id: number | string) => `${BASE_URL_V2}product-listing/${id}`,
    productListing: `${BASE_URL_V2}product-listing/list-product`,
    listingProduct: `${BASE_URL}/product-listings`,
};