const { getCities, getRevenueByDay } = require('../controllers/statController');

const StatRoutes = (router, urlPrefix) => {
    router.get(`${urlPrefix}`, getCities);
    router.get(`${urlPrefix}/revenue`, getRevenueByDay);
}

module.exports = StatRoutes;