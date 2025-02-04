const { getProduct, getProducts } = require("../utils/openFruitApiService");

const fetchProducts = async (req, res) => {
  const { ...params } = req.query;
  try {
    const { products, count } = await getProducts(params.filters, params.page, params.sortBy);
    res.status(200).json({ products, count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const fetchProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await getProduct(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { fetchProduct, fetchProducts };