const {
  getInvoices,
  getInvoiceById,
  getInvoicesByOrderId,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} = require("../controllers/invoiceController");
const checkRole = require("../middleware/checkRole");

const InvoiceRoute = (router, urlPrefix) => {
  router.get(`${urlPrefix}`, checkRole([2]), getInvoices);
  router.get(`${urlPrefix}/:id`, checkRole([2]), getInvoiceById);
  router.get(`${urlPrefix}/order/:id`, checkRole([2]), getInvoicesByOrderId);
  router.post(`${urlPrefix}`, checkRole([2]), createInvoice);
  router.put(`${urlPrefix}/:id`, checkRole([2]), updateInvoice);
  router.delete(`${urlPrefix}/:id`, checkRole([2]), deleteInvoice);
};

module.exports = InvoiceRoute;
