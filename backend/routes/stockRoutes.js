const {
  getStock,
  tryOutStock,
  getAllStocks,
  updateStock,
  createdStock,
  deleteStock,
  refillStock
} = require("../controllers/stockController");
const checkRole = require("../middleware/checkRole");

const StockRoutes = (router, urlPrefix) => {
  router.post(urlPrefix, checkRole([2]), createdStock);
  router.get(urlPrefix, checkRole([2]), getAllStocks);
  router.get(urlPrefix + "/:productId", checkRole([2]), getStock);
  router.get(urlPrefix + "/:productId/sold", checkRole([2]), tryOutStock);
  router.put(urlPrefix + "/:productId", checkRole([2]), updateStock);
  router.put(urlPrefix + "/:productId/refill",checkRole([2]),refillStock);
  router.delete(urlPrefix + "/:productId",checkRole([2]),deleteStock);
};

module.exports = StockRoutes;
