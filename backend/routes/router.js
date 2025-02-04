const express = require("express");
const StockRoutes = require("./stockRoutes");
const UserRoutes = require("./userRoutes");
const ProductRoutes = require("./productRoutes");
const requireAuth = require("../middleware/requireAuth");
const OrderRoute = require("./orderRoutes");
const InvoiceRoute = require("./invoiceRoutes");
const { getRoles } = require("../controllers/roleController");
const StatRoutes = require("./statRoutes");

const router = express.Router();

// Les routes suivantes ne nécessitent pas d'authentification

router.use(requireAuth); // Les routes suivantes nécessitent une authentification (JWT token)
ProductRoutes(router, "/products");
StockRoutes(router, "/stocks");
UserRoutes(router, "/users");
OrderRoute(router, "/orders");
InvoiceRoute(router, "/invoices");
StatRoutes(router, "/stats");
router.get("/roles", getRoles);

module.exports = router;
