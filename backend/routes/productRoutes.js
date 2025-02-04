const {
  fetchProduct,
  fetchProducts,
  fetchGenericName,
  fetchNutriscoreData,
  fetchAllergens,
} = require("../controllers/productController");
const checkRole = require("../middleware/checkRole");

const ProductRoutes = (router, urlPrefix) => {
  router.get(`${urlPrefix}/:id`, checkRole([1]), fetchProduct);
  router.get(`${urlPrefix}/`, checkRole([1]), fetchProducts);
};

module.exports = ProductRoutes;
