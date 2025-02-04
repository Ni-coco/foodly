const {
  createUser,
  updateUser,
  deleteUser,
  showUser,
  showUsers,
  getOrdersByUser,
  getOrderByUserById,
} = require("../controllers/userController");
const checkRole = require("../middleware/checkRole");

const UserRoutes = (router, urlPrefix) => {
  router.post(urlPrefix, checkRole([2]), createUser);
  router.put(urlPrefix + "/:id", checkRole([1]), updateUser);
  router.delete(urlPrefix + "/:id", checkRole([2]), deleteUser);
  router.get(urlPrefix, checkRole([2]), showUsers);
  router.get(urlPrefix + "/:id", checkRole([1]), showUser);
  router.get(urlPrefix + "/:id/orders", checkRole([1]), getOrdersByUser);
  router.get(
    urlPrefix + "/:id/orders/:orderId",
    checkRole([1]),
    getOrderByUserById
  );
};

module.exports = UserRoutes;
