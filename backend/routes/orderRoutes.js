const {
  getOrderById,
  getInvoiceByOrderId,
} = require("../controllers/orderController");
const checkRole = require("../middleware/checkRole");

const OrderRoute = (router, urlPrefix) => {
  router.get(`${urlPrefix}/:id`, checkRole([1]), getOrderById);
  router.get(`${urlPrefix}/:id/invoice`, checkRole([1]), getInvoiceByOrderId);
};

module.exports = OrderRoute;
