const { getCities } = require('../controllers/statController');

const StatRoutes = (router, urlPrefix) => {
    router.get(`${urlPrefix}`, getCities);
}

module.exports = StatRoutes;