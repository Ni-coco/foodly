const axios = require("axios");
const { Product } = require("../dtos/productDto");

const getProduct = async (id) => {
  try {
    const response = await axios.get(`https://fr.openfoodfacts.org/api/v2/product/${id}`, {
      params: {
        fields: 'code,brands,origins,quantity,generic_name,ingredients,allergens,labels,nutriments,nutriscore_version,nutriscore_data,nutrient_levels,selected_images',
        json: true,
      },
    });
    return new Product(response.data.product);
  } catch (error) {
    throw new Error(error.message);
  }
};

const getProducts = async (filtersParams, page, sortBy) => {
  let filters = filtersParams || '';
  if (filters && !filters.endsWith('&'))
    filters += '&';

  try {
    const url = `https://world.openfoodfacts.org/cgi/search.pl?action=process&${filters}fields=code,brands,origins,quantity,generic_name,ingredients,allergens,labels,nutriments,nutriscore_version,nutriscore_data,nutrient_levels,selected_images&page=${page}&${sortBy}&json=true`;
    console.log(`Request URL: ${url}`);

    const response = await axios.get(url);
    const products = await Promise.all(
      response.data.products.map(async (dto) => {
        try {
          const detailedResponse = await axios.get(`https://fr.openfoodfacts.org/api/v2/product/${dto.code}`, {
            params: {
              fields: 'selected_images',
              json: true,
            },
          });

          dto.selected_images = detailedResponse.data.product.selected_images || {};
        } catch (error) {
          console.error(`Erreur lors de la récupération des images pour le produit ${dto.code}:`, error.message);
        }

        return new Product(dto);
      })
    );

    const filteredProducts = products.filter(product => product.img.front !== null && product.img.front !== '')

    return { products: filteredProducts, count: response.data.count };
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

module.exports = { getProduct, getProducts };